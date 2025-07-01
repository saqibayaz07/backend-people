const { people_bank_details } = require('../../models');
const { isUUID } = require('validator'); // For validating UUID format
// const createBankDetails = async (req, res) => {
//   try {
//     const { people_id, ...rest } = req.body;

//     if (!isUUID(people_id)) {
//       return res.status(400).json({ success: false, message: "Invalid people_id format." });
//     }

//     const person = await peoples.findByPk(people_id);

//     if (!person) {
//       return res.status(404).json({ success: false, message: "Person not found." });
//     }

//     const bankDetails = await people_bank_details.create({
//       ...rest,
//       people_id: people_id,
//     });

//    return res.status(201).json({ success: true, message: "Bank details created successfully.", data: bankDetails });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Error creating bank details.", error: error.message });
//   }
// };


const getBankDetailsByPeopleId = async (req, res) => {
  try {
    const { people_id } = req.params;
    // return res.status(200).json({ success: true, message: "Bank details fetched successfully." });

    if (!isUUID(people_id)) {
      return res.status(400).json({ success: false, message: "Invalid people_id format." });
    }

    const bankDetails = await people_bank_details.findAll({
      where: { people_id },
    });

    if (bankDetails.length === 0) {
      return res.status(404).json({ success: false, message: "Bank details not found." });
    }
    return res.status(200).json({ success: true, message: "Bank details fetched successfully.", data: bankDetails });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching bank details.", error: error.message });
  }
};


const updateBankDetails = async (req, res) => {
  try {
    const {
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
      people_id, // Extract people_id from request body
    } = req.body;
    const { id } = req.params;

    if(!isUUID(people_id)) {
      return res.status(400).json({ success: false, message: "Invalid people_id format." });
    }

    // Validate the bank details ID
    const bankDetails = await people_bank_details.findOne({
      where: { id, people_id }, // Ensure the record matches both id and people_id
    });

    if (!bankDetails) {
      return res.status(404).json({ success: false, message: "Bank details not found for the provided person." });
    }

    // Update the bank details
    await bankDetails.update({
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
    });

    return res.status(200).json({
      success: true,
      message: "Bank details updated successfully.",
      data: bankDetails,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating bank details.", error: error.message });
  }
};


// const getBankDetails = async (req, res) => {
//   try {
//     const { people_id } = req.params;

//     if (!isUUID(people_id)) {
//       return res.status(400).json({ success: false, message: "Invalid people_id format." });
//     }

//     const bankDetails = await people_bank_details.findAll({
//       where: { people_id },
//     });

//     res.status(200).json({ success: true, message: "Bank details fetched successfully.", data: bankDetails });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching bank details.", error: error.message });
//   }
// };


module.exports = {
  // createBankDetails,  

  getBankDetailsByPeopleId,

  // getBankDetails 

  updateBankDetails,
};