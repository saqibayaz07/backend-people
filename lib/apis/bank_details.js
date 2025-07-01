const {people_bank_details} = require("../../models");

// creating bank details data for this person  
// "sort_code": "601613",
// "account_name": "James Arthur Smith",
// "bank_name": "Barclays Bank",
// "account_type": "Current",
// "country_code": "44",
// "payment_reference": "PAY-12345-JAMES",
// "building_society_reference": "BSR-7890-JAMES",
// "iban": "GB29NWBK60161331926819",
// "swift_code": "NWBKGB2L",
// "branch_address": "1 Churchill Place, London"



const createBankDetails = async (req, res) => {
  try {


    const bankDetails = await people_bank_details.create(req.body);
    res.status(201).json({ success: true, message: 'Bank details created successfully.', data: bankDetails });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating bank details.', error: error.message });
  }
}


module.exports = { createBankDetails };