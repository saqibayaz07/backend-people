const { job_positions, departments, job_skills } = require('../../models');

const createJobPosition = async (req, res) => {
  try {
    const { position_title, department_id } = req.body;

    // validate whether department exists or not: 
    const department = await departments.findByPk(department_id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        error: 'Department not found'
      });
    }
    const data = {
      position_title,
      department_id,
      description: req.body.description
    }

    // Create a new job position in the database
    const [newJobPosition, created] = await job_positions.findOrCreate({
      where: { position_title },
      defaults: data
    });

    if (!created) {
      return res.status(400).json({ success: false, message: 'Job position with this title already exists in this department', error: 'Job position exists' });
    }

    res.status(201).json({ success: true, data: newJobPosition, message: 'Job position created successfully' });
  } catch (error) {
    // console.error('Error creating job position:', error);
    res.status(500).json({ success: false, message: 'Failed to create job position', error: error.message });
  }
};


// Get all job positions
const getAllJobPositions = async (req, res) => {
  try {
    const jobPositions = await job_positions.findAll();
    if (jobPositions.length === 0) {
      return res.status(404).json({ success: false, message: 'Job positions not found', error: 'Job positions not found' });
    }
    res.json({ success: true, messsage: 'Job positions fetched successfully', data: jobPositions });
  } catch (error) {
    // console.error('Error fetching job positions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job positions', error: error.message });
  }
};

const getAllJobPositionsByDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPositions = await job_positions.findAll({ where: { department_id: id } });
    if (jobPositions.length === 0) {
      return res.status(404).json({ success: false, message: 'Job positions not found', error: 'Job positions not found' });
    }
    res.json({ success: true, messsage: 'Job positions fetched successfully', data: jobPositions });
  } catch (error) {
    // console.error('Error fetching job positions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job positions', error: error.message });
  }
};


// Create job position with relationship of job-skills so skills list pass in jobs and it will as well as create jobPosition and then create job-skills record
// {
//   "position_title": "QA Engineer",
//     // "position_title": "Senior Software Developer",
//     "description": "Focuses on automating test cases to improve efficiency and ensure the scalability of testing processes.",
//       "department_id": "497a2000-1e5e-4868-9e1e-0865e850a995",
//         "skills": [
//           "fe0a0122-4571-4b43-b875-8e4891773722",
//           "f3e25c8a-751f-4cd3-bb61-d67a4fd93310",
//           "874c4159-1c04-4037-b625-efa578e26403",
//           "0f95e98e-69e2-44b0-9623-82a11766c024"
//         ]
// }

const createJobPositionWithJobSkills = async (req, res) => {
  try {
    const { position_title, department_id, skills, description } = req.body;

    // Validate whether the department exists:
    const department = await departments.findByPk(department_id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found', error: 'Department not found' });
    }

    // Find or create the job position with the department relation
    const [jobPosition, created] = await job_positions.findOrCreate({
      where: { position_title, department_id },
      defaults: { position_title, department_id, description }
    });

    // Check if the job position was already created
    if (!created) {
      return res.status(400).json({ success: false, message: 'Job position with this title already exists in this department', error: 'Job position exists' });
    }

    // Create job-skills records and associate the job position with skills
    const jobSkills = await Promise.all(skills.map(async (skillId) => {
      // Assuming skills are passed as an array of skill IDs
      const jobSkill = await job_skills.create({ job_positions_id: jobPosition.id, skills_id: skillId });
      return jobSkill;
    }));

    // Respond with a success message and created data
    res.status(201).json({
      success: true,
      message: 'Job position and job-skills created successfully',
      data: {
        jobPosition,
        jobSkills
      }
    });

  } catch (error) {
    console.error('Error creating job position with skills:', error);
    res.status(500).json({ success: false, message: 'Error creating job position with skills', error: error.message });
  }
};

// Get a job position by ID
const getJobPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPosition = await job_positions.findByPk(id);
    if (!jobPosition) {
      return res.status(404).json({ success: false, message: 'Job position not found' });
    }
    res.json(jobPosition);
  } catch (error) {
    // console.error('Error fetching job position by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job position by ID', error: error.message });
  }
};


// Update a job position
const updateJobPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position_title, department_id } = req.body;

    // Find the job position by ID
    const jobPosition = await job_positions.findByPk(id);
    if (!jobPosition) {
      return res.status(404).json({ success: false, message: 'Job position not found' });
    }

    // Update the job position
    jobPosition.position_title = position_title;
    jobPosition.department_id = department_id;
    await jobPosition.save();

    res.json(jobPosition);
  } catch (error) {
    console.error('Error updating job position:', error);
    res.status(500).json({ error: 'Failed to update job position' });
  }
};


// Delete a job position
const deleteJobPosition = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the job position by ID
    const jobPosition = await job_positions.findByPk(id);
    if (!jobPosition) {
      return res.status(404).json({ error: 'Job position not found' });
    }

    // Delete the job position
    await jobPosition.destroy();

    res.json({ message: 'Job position deleted successfully' });
  }
  catch (error) {
    console.error('Error deleting job position:', error);
    res.status(500).json({ error: 'Failed to delete job position' });
  }
};

module.exports = {
  createJobPosition,
  createJobPositionWithJobSkills,

  getAllJobPositions,
  getAllJobPositionsByDepartment,
  getJobPositionById,

  updateJobPosition,

  deleteJobPosition
}