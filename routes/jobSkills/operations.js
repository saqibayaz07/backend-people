const { job_skills, skills, job_positions } = require('../../models'); // Assuming models are in the models directory
const { isUUID } = require('validator');

// Create a job_skills record
const createJobSkillsRecord = async (req, res) => {
  const { job_positions_id, skills_id } = req.body;

  try {
    // job_position_id validation
    if (!job_positions_id || !isUUID(job_positions_id)) {
      return res.status(400).json({ error: 'Invalid or missing job_position_id' });
    }
    const jobPosition = await job_positions.findByPk(job_positions_id);
    if (!jobPosition) {
      return res.status(404).json({ error: 'Job position not found' });
    }

    // skill_id validation
    if (!skills_id || !isUUID(skills_id)) {
      return res.status(400).json({ error: 'Invalid or missing skill_id' });
    }

    const presentSkill = await job_skills.findOne({
      where: {
        job_positions_id,
        skills_id
      }
    });

    if (presentSkill) {
      return res.status(400).json({ success: true, message: "Job skill already exists.", data: presentSkill });
    }
    const skill = await skills.findByPk(skills_id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Create the job_skills record
    const jobSkill = await job_skills.create({ job_positions_id, skills_id });

    return res.status(201).json({ success: true, message: "Job skill created successfully.", data: jobSkill }); // Respond with the newly created job skill
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating job skill: ', error: error.message });
  }
};

// Bulk create job_skills records
const bulkCreateJobSkillsRecords = async (req, res) => {
  const { job_positions_id, skills_id } = req.body;
  try {
    // Validate job_position_id
    if (!job_positions_id || !isUUID(job_positions_id)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing job_position_id' });
    }

    // Check if the job position exists
    const jobPosition = await job_positions.findByPk(job_positions_id);
    if (!jobPosition) {
      return res.status(404).json({ success: false, message: 'Job position not found' });
    }

    // Validate skills_id array
    if (!Array.isArray(skills_id) || skills_id.length === 0) {
      return res.status(400).json({ success: false, message: 'skills_id must be a non-empty array' });
    }

    // Validate each skill_id
    for (const skillId of skills_id) {
      if (!isUUID(skillId)) {
        return res.status(400).json({ success: false, message: `Invalid skill_id: ${skillId}` });
      }

      const skill = await skills.findByPk(skillId);
      if (!skill) {
        return res.status(404).json({ success: false, message: `Skill not found: ${skillId}` });
      }
    }

    // Create job skills records
    const jobSkillsRecords = skills_id.map(skillId => ({
      job_positions_id,
      skills_id: skillId,
    }));

    // Bulk insert into the job_skills table (assuming a Sequelize model)
    const createdJobSkills = await job_skills.bulkCreate(jobSkillsRecords);

    return res.status(201).json({ success: true, message: 'Job skills records created successfully', data: createdJobSkills });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
  }
};

// Get all job_skills records
const getAllJobSkillsRecords = async (req, res) => {
  try {
    const jobSkills = await job_skills.findAll();
    if (jobSkills.length === 0) {
      return res.status(404).json({ success: false, message: 'No job skills found', error: 'No job skills found' });
    }
    return res.status(200).json(jobSkills);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error fetching job skills: ' + error.message });
  }
};

// Get a job_skills record by Job Position ID
const getRecordByJobPositionId = async (req, res) => {
  const { job_positions_id } = req.params;

  try {
    const jobSkills = await job_skills.findAll({
      where: { job_positions_id },
      include: [skills], // Including skills to get detailed information
    });

    if (!jobSkills.length) {
      return res.status(404).json({ error: 'No job skills found for this job position' });
    }

    return res.status(200).json(jobSkills);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error fetching job skills by job position ID: ' + error.message });
  }
};

// Get a job_skills record by ID
const getJobSkillById = async (req, res) => {
  const { id } = req.params;

  try {
    const jobSkill = await job_skills.findByPk(id, {
      include: [skills, job_positions], // Including related models
    });

    if (!jobSkill) {
      return res.status(404).json({ error: 'Job skill not found' });
    }

    return res.status(200).json(jobSkill);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching job skill by ID: ' + error.message });
  }
};

// Update job_skills record
const updateJobPositionRecord = async (req, res) => {
  const { id } = req.params;
  const { job_position_id, skill_id, proficiency_level } = req.body;

  try {
    const jobSkill = await job_skills.findByPk(id);
    if (!jobSkill) {
      return res.status(404).json({ error: 'Job skill not found' });
    }

    if (job_position_id) {
      const jobPosition = await job_positions.findByPk(job_position_id);
      if (!jobPosition) {
        return res.status(404).json({ error: 'Job position not found' });
      }
    }

    if (skill_id) {
      const skill = await skills.findByPk(skill_id);
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
    }

    const updatedJobSkill = await jobSkill.update({ job_position_id, skill_id, proficiency_level });

    return res.status(200).json(updatedJobSkill);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating job skill: ' + error.message });
  }
};

// Delete a job_skills record
const deleteJobPositionSkillsRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const jobSkill = await job_skills.findByPk(id);
    if (!jobSkill) {
      return res.status(404).json({ error: 'Job skill not found' });
    }

    await jobSkill.destroy();

    return res.status(200).json({ message: 'Job skill deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting job skill: ' + error.message });
  }
};



module.exports = {
  createJobSkillsRecord,
  bulkCreateJobSkillsRecords,
  getAllJobSkillsRecords,
  getRecordByJobPositionId,
  getJobSkillById,
  updateJobPositionRecord,
  deleteJobPositionSkillsRecord
}