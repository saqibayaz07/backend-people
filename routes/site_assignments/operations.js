const { site_assignments } = require('../../models');



const createSiteAssignment = async (req, res) => {
  try {
    const siteAssignment = await site_assignments.create(req.body);
    res.status(201).json({success: true , message: 'Site assignment created successfully.', data:siteAssignment});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create site assignment', error: error.message});
  }
};


const getAllSiteAssignments = async (req, res) => {
  try {
    const siteAssignments = await site_assignments.findAll();
    return res.status(200).json({success: true, message: 'Site assignments fetched successfully.', data: siteAssignments});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch site assignments' , error: error.message }); 
  }
};

const getSiteAssignmentById = async (req, res) => {
  try {
    const siteAssignment = await site_assignments.findByPk(req.params.id);
    if (!siteAssignment) {
      return res.status(404).json({ error: 'Site assignment not found' });
    }
    res.json(siteAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site assignment' });
  }
};


const updateSiteAssignment = async (req, res) => {
  try {
    const siteAssignment = await site_assignments.findByPk(req.params.id);
    if (!siteAssignment) {
      return res.status(404).json({success: false, message: 'Bad request', error: 'Site assignment not found' });
    }
    await siteAssignment.update(req.body);
    return res.status(200).json({success: true, message: 'Site assignment updated successfully.', data: siteAssignment});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update site assignment', error : error.message});
  }
};


const deleteSiteAssignment = async (req, res) => {
  try {
    const siteAssignment = await site_assignments.findByPk(req.params.id);
    if (!siteAssignment) {
      return res.status(404).json({success: false, message: 'Site assignment not found' });
    }
    await siteAssignment.destroy();
    return res.status(200).json({success: true, message: 'Site assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete site assignment', error: error.message});
  }
};

module.exports = {
  createSiteAssignment,
  getAllSiteAssignments,
  getSiteAssignmentById,
  updateSiteAssignment,
  deleteSiteAssignment
}