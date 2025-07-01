// const { where } = require('sequelize');
const { people_bank_details, peoples, security_people_extensions } = require('../../models');
// import { createBankDetails } from '../../lib/apis/bank_details';
const { isUUID } = require('validator'); // For validating UUID format
// const axios = require('axios');  // Assuming you are using Axios for HTTP requests

const createPerson = async (req, res) => {
  try {
    // Destructure all the fields from the request body
    const {
      // People table fields
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      marital_status,
      nationality,
      preferred_language,
      country,
      base_currency = 'PKR',
      timezone = 'Asia/Karachi',
      email,
      work_email,
      mobile_number,
      phone_number, // for work phone
      worker_type,
      title, // new field

      // Team Details fields
      org_id,
      org_group,
      org_position,
      work_id,
      work_location = 'on-site',




      // Job Details fields
      job_title,
      seniority_level, // new field
      department_id,
      direct_report, // new field
      reporting_manager_id,
      worker_id, // new field
      employment_type = 'full-time',
      contract_start_date,

      // Financial Details fields
      salary = 0.00,
      payment_frequency, // new field
      payment_method, // new field

      profile_picture,
      contact_type,
      employment_status = 'inactive',
      contract_end_date,

      // Bank details fields
      account_name,
      sort_code,
      account_number,
      bank_name,
      payment_reference,
      building_society_reference,
      iban,
      swift_code,
      country_code,

      account_type,
      branch_address,

      hire_date,
      termination_date,
      employee_id_number,
      status,
      emergency_contact_name,
      emergency_contact_phone,
      salary_currency = 'PKR',
      hourly_rate = 0.00,
      position_start_date,
      position_end_date,
      shift_preferences = 'day',
      contract_type = 'temporary',
      probation_end_date,
      work_permit_status = 'not-required',
    } = req.body;


    const name = `${first_name}${(middle_name && middle_name !== '') ? ' ' + middle_name : ''}${(last_name && last_name !== '') ? ' ' + last_name : ''}`;

    // Prepare the peoples data
    const peoplesData = {
      name,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      marital_status,
      nationality,
      preferred_language,
      country,
      base_currency,
      timezone,
      email,
      work_email,
      mobile_number,
      phone_number,
      worker_type,
      title,


      org_id,
      org_group,
      org_position,
      work_id,
      work_location,

      job_title,
      seniority_level,
      department_id,
      direct_report,
      reporting_manager_id,
      worker_id,
      employment_type,
      contract_start_date,

      salary,
      payment_frequency,
      // payment_method,
      payment_method: payment_method ? payment_method.toLowerCase() : payment_method,

      emergency_contact_name,
      emergency_contact_phone,
      profile_picture,
      contact_type,
      employment_status,
      hire_date,
      termination_date,
      employee_id_number,
      status,
      salary_currency,
      hourly_rate,
      payment_frequency,

      position_start_date,
      position_end_date,
      shift_preferences,
      contract_type,
      probation_end_date,
      payment_method,
      work_permit_status,
      contract_end_date,

      // Conditionally add JSON fields if they exist
      // ...(bank_account_details && { bank_account_details }),
      // ...(next_of_kin && { next_of_kin }),
      // ...(address_history && { address_history }),
      // ...(employment_history && { employment_history }),
      // ...(skills && { skills }),
      // ...(education && { education }),
      // ...(languages && { languages }),
    };

    if (!account_number && !iban) {
      return res.status(400).json({
        success: false,
        message: "Account number or IBAN is required.",
      });
    }

    // Create the person in the 'peoples' table
    const newPerson = await peoples.create(peoplesData);

    if (!newPerson) {
      return res.status(400).json({
        success: false,
        message: "Failed to create person in peoples table.",
      });
    }

    // Create bank details if account information is provided
    let bankDetailsData = null;
    bankDetailsData = await people_bank_details.create({
      people_id: newPerson.id,
      account_name,
      account_number,
      account_type,
      bank_name,
      branch_address,
      iban,
      country: country_code,
      sort_code,
      swift_code,
      payment_reference,
      building_society_reference,
    });

    if (!bankDetailsData) {
      return res.status(400).json({
        success: false,
        message: "Failed to create bank details.",
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Person whole data created successfully.',
      data: {
        person: newPerson,
        bankDetails: bankDetailsData
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};

// Create a person Simple Function.
/*
const createPerson = async (req, res) => {
  try {
    const {
      contact_id,
      name,
      gender,
      profile_picture,
      employment_status,
      job_title,
      department_id,
      employment_type,
      hire_date,
      termination_date,
      salary,
      bank_account_details,
      next_of_kin,
      address_history,
      employment_history,
      employee_id_number,
      status,
      nationality,
      marital_status,
      date_of_birth,
      emergency_contact_name,
      emergency_contact_phone,
      salary_currency,
      hourly_rate,
      position_start_date,
      position_end_date,
      reporting_manager_id,
      skills,
      shift_preferences,
      work_location,
      contract_type,
      education,
      languages,
      probation_end_date,
      work_permit_status,
      contract_start_date,
      contract_end_date,
    } = req.body;
 
    // Validate required fields
    // if (!name || !gender || !hire_date || !salary) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Missing required fields.',
    //   });
    // }
 
    // // Validate field types and formats
    // if (typeof name !== 'string' || name.length < 3) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Name must be a string with at least 3 characters.',
    //   });
    // }
 
    // if (!['male', 'female', 'other'].includes(gender)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Gender must be either "male", "female", or "other".',
    //   });
    // }
 
    // if (profile_picture && !/^http[s]?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(profile_picture)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Profile picture must be a valid URL pointing to an image.',
    //   });
    // }
 
    // if (!['active', 'inactive'].includes(employment_status)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Employment status must be either "active" or "inactive".',
    //   });
    // }
 
    // if (!['full-time', 'part-time', 'contract'].includes(employment_type)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Employment type must be either "full-time", "part-time", or "contract".',
    //   });
    // }
 
    // if (isNaN(Date.parse(hire_date))) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Hire date must be a valid date.',
    //   });
    // }
 
    // if (termination_date && isNaN(Date.parse(termination_date))) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Termination date must be a valid date.',
    //   });
    // }
 
    // if (isNaN(salary) || salary <= 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Salary must be a positive number.',
    //   });
    // }
 
    // if (bank_account_details && !Array.isArray(bank_account_details)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Bank account details must be an array of objects.',
    //   });
    // }
 
    // if (next_of_kin && typeof next_of_kin !== 'object') {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Next of kin must be an object.',
    //   });
    // }
 
    // if (address_history && !Array.isArray(address_history)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Address history must be an array of objects.',
    //   });
    // }
 
    // if (employment_history && !Array.isArray(employment_history)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Employment history must be an array of objects.',
    //   });
    // }
 
    // if (!employee_id_number || isNaN(employee_id_number) || employee_id_number.length !== 10) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Employee ID number must be a 10-digit number.',
    //   });
    // }
 
    // if (!['single', 'married', 'divorced', 'widowed'].includes(marital_status)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Marital status must be one of: "single", "married", "divorced", "widowed".',
    //   });
    // }
 
    // if (isNaN(Date.parse(date_of_birth))) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Date of birth must be a valid date.',
    //   });
    // }
 
    // if (emergency_contact_phone && !/^\+92-\d{3}-\d{7}$/.test(emergency_contact_phone)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Emergency contact phone must be in the format +92-XXX-XXXXXXX.',
    //   });
    // }
 
    // if (salary_currency && !['PKR', 'USD', 'EUR'].includes(salary_currency)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Salary currency must be one of: "PKR", "USD", "EUR".',
    //   });
    // }
 
    // if (hourly_rate && (isNaN(hourly_rate) || hourly_rate <= 0)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Hourly rate must be a positive number.',
    //   });
    // }
 
    // if (position_start_date && isNaN(Date.parse(position_start_date))) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Position start date must be a valid date.',
    //   });
    // }
 
    // if (position_end_date && isNaN(Date.parse(position_end_date))) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Position end date must be a valid date.',
    //   });
    // }
 
    // // if (reporting_manager_id && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(reporting_manager_id)) {
    // if (reporting_manager_id && isUUID(reporting_manager_id)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Reporting manager ID must be a valid UUID.',
    //   });
    // }
 
    // Create a new person in the database
    const newPerson = await peoples.create({
      contact_id,
      name,
      gender,
      profile_picture,
      employment_status,
      job_title,
      department_id,
      employment_type,
      hire_date,
      termination_date,
      salary,
      bank_account_details,
      next_of_kin,
      address_history,
      employment_history,
      employee_id_number,
      status,
      nationality,
      marital_status,
      date_of_birth,
      emergency_contact_name,
      emergency_contact_phone,
      salary_currency,
      hourly_rate,
      position_start_date,
      position_end_date,
      reporting_manager_id,
      skills,
      shift_preferences,
      work_location,
      contract_type,
      education,
      languages,
      probation_end_date,
      work_permit_status,
      contract_start_date,
      contract_end_date,
    });
 
    res.status(201).json({
      success: true,
      message: 'Person created successfully.',
      data: newPerson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};
*/

// Create a person Detailed version
/*
const createPerson = async (req, res) => {
  try {
    const {
      name,
      gender,
      profile_picture,
      employment_status,
      job_title,
      department_id,
      employment_type,
      hire_date,
      termination_date,
      salary,
      bank_account_details,
      next_of_kin,
      address_history,
      employment_history,
    } = req.body;
 
    // Validation for required fields
    if (!name || !gender || !employment_status || !job_title || !employment_type || !hire_date || !salary || !bank_account_details || !next_of_kin || !address_history) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
 
    // Validate 'name' (should not be empty and should be a string)
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name must be a non-empty string.' });
    }
 
    // Validate 'gender' (should be one of 'male', 'female', or 'other')
    const validGenders = ['male', 'female', 'non-binary', 'prefer-not'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ success: false, message: 'Gender must be one of "male", "female", or "other".' });
    }
 
    // Validate 'employment_status' (should be one of 'active' or 'inactive')
    const validStatuses = ['active', 'inactive', 'terminated', 'leave'];
    if (!validStatuses.includes(employment_status)) {
      return res.status(400).json({ success: false, message: 'Employment status must be either "active" or "inactive".' });
    }
 
    // Validate 'salary' (should be a positive number)
    if (isNaN(salary) || salary <= 0) {
      return res.status(400).json({ success: false, message: 'Salary must be a positive number.' });
    }
 
    // Validate 'hire_date' (should be a valid date)
    if (isNaN(Date.parse(hire_date))) {
      return res.status(400).json({ success: false, message: 'Hire date must be a valid date.' });
    }
 
    // Validate 'bank_account_details' (should be an object with required fields)
    if (
      !bank_account_details ||
      !bank_account_details.account_number ||
      !bank_account_details.sort_code ||
      !bank_account_details.bank_name
    ) {
      return res.status(400).json({ success: false, message: 'Bank account details must include account_number, sort_code, and bank_name.' });
    }
 
    // Validate 'next_of_kin' (should be an object with required fields)
    if (!next_of_kin || !next_of_kin.name || !next_of_kin.relationship || !next_of_kin.contact_number) {
      return res.status(400).json({ success: false, message: 'Next of kin must include name, relationship, and contact_number.' });
    }
 
    // Validate 'address_history' (should be an array of objects with required fields)
    if (!Array.isArray(address_history) || address_history.length === 0) {
      return res.status(400).json({ success: false, message: 'Address history must be a non-empty array.' });
    }
 
    address_history.forEach((address) => {
      if (!address.address || !address.start_date) {
        return res.status(400).json({ success: false, message: 'Each address history entry must have address and start_date.' });
      }
      if (address.end_date && isNaN(Date.parse(address.end_date))) {
        return res.status(400).json({ success: false, message: 'End date in address history must be a valid date if provided.' });
      }
    });
 
    // Validate 'employment_history' (should be an array of objects with required fields)
    if (employment_history && !Array.isArray(employment_history)) {
      return res.status(400).json({ success: false, message: 'Employment history must be an array.' });
    }
 
    employment_history.forEach((employment) => {
      if (!employment.company_name || !employment.job_title || !employment.start_date) {
        return res.status(400).json({ success: false, message: 'Each employment history entry must have company_name, job_title, and start_date.' });
      }
    });
 
    // Create a new person in the database
    const newPerson = await peoples.create({
      name,
      gender,
      profile_picture,
      employment_status,
      job_title,
      department_id,
      employment_type,
      hire_date,
      termination_date,
      salary,
      bank_account_details,
      next_of_kin,
      address_history,
      employment_history,
    });
 
    res.status(201).json({
      success: true,
      message: 'Person created successfully.',
      data: newPerson,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating person.', error: error.message });
  }
};
 
*/



// Get all peoples with contacts details
const getAllPeople = async (req, res) => {
  try {
    // Fetch all people from the database
    const people = await peoples.findAll();

    if (!people.length) {
      return res.status(404).json({ success: false, message: 'No people found.' });
    }

    // Respond with the updated people data, now including the contact information
    res.status(200).json({ success: true, data: people });
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).json({ success: false, message: 'Error fetching people data.', error: error.message });
  }
};


const getAllPeopleIds = async (req, res) => {
  try {
    const people = await peoples.findAll({
      attributes: ['id', 'name']
    });
    if (!people.length) {
      return res.status(404).json({ success: false, message: 'No people found.' });
    }
    res.status(200).json({ success: true, data: people });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching people.', error: error.message });
  }
}

// Get a person by ID
const getPersonById = async (req, res) => {
  const { id } = req.params;

  // Validate the UUID format of the ID
  if (!isUUID(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  }

  try {
    const person = await peoples.findByPk(id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found.' });
    }
    res.status(200).json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching person.', error: error.message });
  }
};


// Get all Persons without security
const getAllPeopleWithoutSecurity = async (req, res) => {
  try {
    // Fetch people who do not have a corresponding security record using the correct alias
    const peopleWithoutSecurity = await peoples.findAll({
      where: {
        '$people_security.id$': null  // Use the alias 'people_security' in the condition
      },
      attributes: ['id', 'name'],
      include: [{
        model: security_people_extensions,
        as: 'people_security',  // Specify the alias used in the association
        required: false  // LEFT JOIN, so people without a security record will still be included
      }]
    });

    if (!peopleWithoutSecurity.length) {
      return res.status(404).json({ success: false, message: 'No people found without security records.' });
    }

    return res.status(200).json({ success: true, data: peopleWithoutSecurity });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching people without security records.', error: error.message });
  }
};


// Update a person Personal Details by ID
// const udpateBankDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const person = await peoples.findByPk(id);

//     if (!person) {
//       return res.status(404).json({ success: false, message: 'Person not found.' });
//     }

//     // Update fields with the new data
//     const updatedPerson = await person.patch(req.body);

//     if (!updatedPerson) {
//       return res.status(404).json({ success: false, message: 'Person not found.' });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Person updated successfully.',
//       data: updatedPerson,
//     })
//   }

//   catch (err) {
//     res.status(500).json({ success: false, message: 'Error updating person.', error: error.message });
//   }
// }

// Update a person Personal Details by ID
const udpatePersonalDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await peoples.findByPk(id);

    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found.' });
    }

    const {
      // People table fields
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      marital_status,
      nationality,
      preferred_language,
      country,
      base_currency = 'PKR',
      timezone = 'Asia/Karachi',
      email,
      work_email,
      mobile_number,
      phone_number, // for work phone
      worker_type,
      title, // new field

      // Team Details fields
      org_id,
      org_group,
      org_position,
      work_id,
    } = req.body;

    // Update fields with the new data
    const updatedPerson = await person.update({// People table fields
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      marital_status,
      nationality,
      preferred_language,
      country,
      base_currency,
      timezone,
      email,
      work_email,
      mobile_number,
      phone_number, // for work phone
      worker_type,
      title, // new field

      // Team Details fields
      org_id,
      org_group,
      org_position,
      work_id,
    });

    if (!updatedPerson) {
      return res.status(404).json({ success: false, message: 'Person could not update.' });
    }

    res.status(200).json({
      success: true,
      message: 'Person updated successfully.',
      data: updatedPerson,
    })
  }

  catch (err) {
    res.status(500).json({ success: false, message: 'Error updating person.', error: err.message });
  }
}

// Update Job Details for a person by ID
const udpateJobDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await peoples.findByPk(id);

    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found.' });
    }

    const {
      // Job Details fields
      job_title,
      seniority_level, // new field
      department_id,
      direct_report, // new field
      work_location,

      reporting_manager_id,
      worker_id, // new field
      employment_type = 'full-time',
      contract_start_date,
      contract_end_date = null,
    } = req.body;

    // Update fields with the new data
    const updatedPerson = await person.update({// People table fields
      // Job Details fields
      job_title,
      seniority_level, // new field
      department_id,
      direct_report, // new field
      work_location,

      reporting_manager_id,
      worker_id, // new field
      employment_type,
      contract_start_date,
      contract_end_date,
    });

    if (!updatedPerson) {
      return res.status(404).json({ success: false, message: 'Person could not update.' });
    }

    res.status(200).json({
      success: true,
      message: 'Job Details of Person updated successfully.',
      data: updatedPerson,
    })
  }

  catch (err) {
    res.status(500).json({ success: false, message: 'Error updating person bank and financial.', error: err.message });
  }
}


// Update Job Details for a person by ID
const udpateBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await peoples.findByPk(id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found.' });
    }

    const {
      // Financial Details fields
      salary,
      payment_frequency, // new field
      payment_method, // new field

      // Bank details fields
      account_name,
      sort_code,
      account_number,
      bank_name,
      payment_reference,
      building_society_reference,
      iban,
      swift_code,
      country_code,
    } = req.body;

    // Update fields with the new data
    const updatedPerson = await person.update({
      // Financial Details fields
      salary,
      payment_frequency, // new field
      payment_method, // new field

      // Bank details fields
      account_name,
      sort_code,
      account_number,
      bank_name,
      payment_reference,
      building_society_reference,
      iban,
      swift_code,
      country_code,
    });

    if (!updatedPerson) {
      return res.status(404).json({ success: false, message: 'Person could not update.' });
    }

    res.status(200).json({
      success: true,
      message: 'Bank & Financial Details of Person updated successfully.',
      data: updatedPerson,
    })
  }

  catch (err) {
    res.status(500).json({ success: false, message: 'Error updating person bank and financial details.', error: err.message });
  }
}

// Update a person by ID
const updatePerson = async (req, res) => {
  const { id } = req.params;

  // Validate the UUID format of the ID
  // if (!isUUID(id)) {
  //   return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  // }

  try {
    const person = await peoples.findByPk(id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found.' });
    }

    // Update fields with the new data
    const updatedPerson = await person.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Person updated successfully.',
      data: updatedPerson,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating person.', error: error.message });
  }
};

// Delete a person by ID
const deletePerson = async (req, res) => {
  const { id } = req.params;

  // Validate the UUID format of the ID
  if (!isUUID(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  }

  try {
    const person = await peoples.findByPk(id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found.' });
    }

    // Delete the person from the database
    await person.destroy();

    res.status(200).json({
      success: true,
      message: 'Person deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting person.', error: error.message });
  }
};

module.exports = {
  createPerson,

  getAllPeople,
  getPersonById,
  getAllPeopleIds,
  getAllPeopleWithoutSecurity,

  udpatePersonalDetails,
  udpateJobDetails,
  udpateBankDetails,

  updatePerson,

  deletePerson,
};