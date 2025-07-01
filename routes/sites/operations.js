const { sites, peoples} = require('../../models'); // Assuming models are in the models directory

// site_name
// site_code
// address_1
// address_2
// city
// state
// post_code
// country
// contact_person
// contact_phone
// email
// manager_id
// site_type
// status
// description

const createSite = async (req, res) => {
  try { 
    const { site_name, manager_id} = req.body;

    if (!site_name || !manager_id) {
      return res.status(400).json({success: false, message: 'Internal server error', error: 'Missing required fields' });
    }

    const manager = await peoples.findByPk(manager_id);

    if (!manager) {
      return res.status(404).json({success: false, message: 'Bad request', error: 'Manager not found' });
    }

    const site = await sites.create({
      site_name,
      manager_id,
      ...req.body
    });

    return res.status(201).json({ success: true, message: 'Site created successfully', data: site});
  } catch (error) {
    console.error(error);
    return res.status(500).json( { success: false, message: 'Error While Creating Site',  error: error.message });
  }
};

const getAllSites = async (req, res) => {
  try {
    const sites = await sites.findAll();
    return res.status(200).json({ success: true, message: 'All sites', data: sites });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error While Fetching sites', error: error.message });
  }
};

const getSiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const site = await sites.findByPk(id);
    if (!site) {
      return res.status(404).json({ success: false, message: 'Site not found' });
    }
    return res.status(200).json({ success: true, message: 'Site found', data: site });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error While Fetching Site', error: error.message });
  }
};

const getSitesByMangerId = async (req, res) => {  
  try {
    const { manager_id } = req.params;
    const sites = await sites.findAll({ where: { manager_id } });
    return res.status(200).json({ success: true, message: 'sites found', data: sites });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error While Fetching sites', error: error.message });
  }
};

const updateSite = async (req, res) => {
  try {
    const { id } = req.params;
    const site = await sites.findByPk(id);
    if (!site) {
      return res.status(404).json({ success: false, message: 'Site not found' });
    }
    await site.update(req.body);
    return res.status(200).json({ success: true, message: 'Site updated successfully', data: site });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error While Updating Site', error: error.message });
  }
};

const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;
    const site = await sites.findByPk(id);
    if (!site) {
      return res.status(404).json({ success: false, message: 'Site not found' });
    }
    await site.destroy();
    return res.status(200).json({ success: true, message: 'Site deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error While Deleting Site', error: error.message });
  }
};



module.exports = {
  createSite,
  getAllSites,
  getSiteById,
  getSitesByMangerId,
  updateSite,
  deleteSite
};