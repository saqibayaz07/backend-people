const { subcontractors } = require('../../models');

// company_name
// contact_person
// phone_number
// email
// address_1
// address_2
// city
// state
// post_code
// country
// services_provided
// status
// rating
// contract_start_date
// contract_end_date
// compliance_documents
// remarks



const createSubcontractor = async (req, res) => {
  try {
    const {
      company_name,
      contact_person,
      phone_number,
      email,
      address_1,
      address_2,
      city,
      state,
      post_code,
      country,
      services_provided,
      status,
      rating,
      contract_start_date,
      contract_end_date,
      compliance_documents,
      remarks
    } = req.body;

    const existingSubcontractor = await subcontractors.findOne({ where: { company_name } });
    if (existingSubcontractor) {
      return res.status(400).json({ success: false, message: 'Subcontractor with the same company name already exists.' });
    }



    const subcontractor = await subcontractors.create({
      company_name,
      contact_person,
      phone_number,
      email,
      address_1,
      address_2,
      city,
      state,
      post_code,
      country,
      services_provided,
      status,
      rating,
      contract_start_date,
      contract_end_date,
      compliance_documents,
      remarks
    });

    res.status(201).json({ success: true, message: 'Subcontractor created successfully.', data: subcontractor });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create subcontractor', error: error.message });
  }
}


const getAllSubcontractors = async (req, res) => {
  try {
    const subcontractors = await subcontractors.findAll();
    res.status(200).json({ success: true, message: 'Subcontractors fetched successfully.', data: subcontractors });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch subcontractors', error: error.message });
  }
}

const getSubcontractorById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcontractor = await subcontractors.findByPk(id);
    if (!subcontractor) {
      return res.status(404).json({ success: false, message: 'Subcontractor not found' });
    }
    res.status(200).json({ success: true, message: 'Subcontractor fetched successfully.', data: subcontractor });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch subcontractor', error: error.message });
  }
}


const getSubcontractorsByCompanyName = async (req, res) => {
  try {
    const { company_name } = req.params;
    const subcontractors = await subcontractors.findAll({ where: { company_name } });
    res.status(200).json({ success: true, message: 'Subcontractors fetched successfully.', data: subcontractors });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch subcontractors', error: error.message });
  }
}

const updateSubcontractor = async (req, res) => {
  try {
    const { id } = req.params;
    const subcontractor = await subcontractors.findByPk(id);
    if (!subcontractor) {
      return res.status(404).json({ success: false, message: 'Subcontractor not found' });
    }
    await subcontractor.update(req.body);
    res.status(200).json({ success: true, message: 'Subcontractor updated successfully.', data: subcontractor });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update subcontractor', error: error.message });
  }
}


const deleteSubcontractor = async (req, res) => {
  try {
    const { id } = req.params;
    const subcontractor = await subcontractors.findByPk(id);
    if (!subcontractor) {
      return res.status(404).json({ success: false, message: 'Subcontractor not found' });
    }
    await subcontractor.destroy();
    res.status(200).json({ success: true, message: 'Subcontractor deleted successfully.' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete subcontractor', error: error.message });
  }
}


module.exports = {
  createSubcontractor,

  getAllSubcontractors,
  getSubcontractorById,
  getSubcontractorsByCompanyName,
  
  updateSubcontractor,
  deleteSubcontractor
}