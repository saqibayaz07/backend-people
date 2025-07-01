const express = require('express');
const router = express.Router();

const {
  getBankDetailsByPeopleId,
  updateBankDetails
} = require('./operations');

/**
 * @swagger
 * /bank-detail/get/{people_id}:
 *   get:
 *     summary: Retrieve bank details by person ID
 *     description: Fetches all bank details associated with a specific person using their unique ID.
 *     tags:
 *       - Bank Details
 *     parameters:
 *       - name: people_id
 *         in: path
 *         description: The UUID of the person to retrieve bank details for
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully fetched bank details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Bank details fetched successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                       people_id:
 *                         type: string
 *                         format: uuid
 *                         example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                       account_name:
 *                         type: string
 *                         example: "John Doe"
 *                       account_number:
 *                         type: string
 *                         example: "12345678"
 *                       bank_name:
 *                         type: string
 *                         example: "XYZ Bank"
 *                       iban:
 *                         type: string
 *                         example: "PK36SCBL0000001123456702"
 *                       swift_code:
 *                         type: string
 *                         example: "SCBLPKKX"
 *       400:
 *         description: Invalid people_id format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid people_id format."
 *       500:
 *         description: Error fetching bank details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error fetching bank details."
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/get/:people_id', getBankDetailsByPeopleId);

/**
 * @swagger
 * /bank-detail/update/{id}:
 *   put:
 *     summary: Update bank details for a specific person
 *     description: Updates the bank details of a specific record by its unique ID and validates the provided people_id.
 *     tags:
 *       - Bank Details
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique ID of the bank details record to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               people_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the person associated with the bank details (for validation and filtering)
 *               account_name:
 *                 type: string
 *                 description: Name of the account holder
 *               sort_code:
 *                 type: string
 *                 description: Bank sort code
 *               account_number:
 *                 type: string
 *                 description: Bank account number
 *               bank_name:
 *                 type: string
 *                 description: Name of the bank
 *               payment_reference:
 *                 type: string
 *                 description: Payment reference
 *               building_society_reference:
 *                 type: string
 *                 description: Building society reference
 *               iban:
 *                 type: string
 *                 description: International Bank Account Number (IBAN)
 *               swift_code:
 *                 type: string
 *                 description: SWIFT code
 *               country_code:
 *                 type: string
 *                 description: Country code of the bank
 *               account_type:
 *                 type: string
 *                 description: Type of the account (e.g., savings, current)
 *               branch_address:
 *                 type: string
 *                 description: Address of the bank branch
 *     responses:
 *       200:
 *         description: Bank details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Bank details updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "b2c3d4e5-f6g7-8901-hijk-1234567890lm"
 *                     account_name:
 *                       type: string
 *                       example: "John Doe"
 *                     bank_name:
 *                       type: string
 *                       example: "XYZ Bank"
 *       400:
 *         description: Validation failed (e.g., invalid ID or people_id format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid people_id format."
 *       404:
 *         description: Bank details not found for the provided person
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Bank details not found for the provided person."
 *       500:
 *         description: Error updating bank details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error updating bank details."
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put('/update/:id', updateBankDetails);


module.exports = router;