const express = require('express');
const router = express.Router();

// Import the peoples operations (functions)
const {
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
} = require('./operations.js');


// Add new people to the database
/**
 * @swagger
 * /people/add:
 *   post:
 *     summary: Create a new person
 *     description: Creates a new person with their personal, job, financial, and bank details.
 *     tags:
 *       - People
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 required: true
 *               middle_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               gender:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               marital_status:
 *                 type: string
 *               nationality:
 *                 type: string
 *               preferred_language:
 *                 type: string
 *                 required: true
 *               country:
 *                 type: string
 *               base_currency:
 *                 type: string
 *                 default: 'PKR'
 *                 required: true
 *               timezone:
 *                 type: string
 *                 default: 'Asia/Karachi'
 *                 required: true
 *               email:
 *                 type: string
 *                 required: true
 *               work_email:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               phone_number:
 *                 type: string
 *                 required: true
 *               worker_type:
 *                 type: string
 *               title:
 *                 type: string
 *               org_id:
 *                 type: string
 *               org_group:
 *                 type: string
 *               org_position:
 *                 type: string
 *               work_id:
 *                 type: string
 *               job_title:
 *                 type: string
 *               seniority_level:
 *                 type: string
 *               department_id:
 *                 type: string
 *               direct_report:
 *                 type: string
 *               reporting_manager_id:
 *                 type: string
 *               worker_id:
 *                 type: string
 *               employment_type:
 *                 type: string
 *               contract_start_date:
 *                 type: string
 *                 format: date
 *               contract_end_date:
 *                 type: string
 *                 format: date
 *               salary:
 *                 type: number
 *                 format: float
 *               payment_frequency:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               account_name:
 *                 type: string
 *               sort_code:
 *                 type: string
 *               account_number:
 *                 type: string
 *               bank_name:
 *                 type: string
 *               payment_reference:
 *                 type: string
 *               building_society_reference:
 *                 type: string
 *               iban:
 *                 type: string
 *               swift_code:
 *                 type: string
 *               country_code:
 *                 type: string
 *               shift_preferences:
 *                 type: string
 *                 required: true
 *               work_location:
 *                 type: string
 *                 required: true
 *               contract_type:
 *                 type: string
 *                 required: true
 *               work_permit_status:
 *                 type: string
 *                 required: true
 *             required:
 *               - first_name
 *               - email
 *               - phone_number
 *               - employment_status
 *               - shift_preferences
 *               - work_location
 *               - contract_type
 *               - work_permit_status
 *               - preferred_language
 *               - base_currency
 *               - timezone
 *     responses:
 *       200:
 *         description: Person created successfully
 *       400:
 *         description: Invalid request body or missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/add', createPerson);

// Route for getting all people
/**
 * @swagger
 * /people/get:
 *   get:
 *     summary: Get a list of all employees
 *     description: Fetch all employees' details from the database.
 *     tags:
 *       - People
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of employees.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The employee's unique ID.
 *                       first_name:
 *                         type: string
 *                         description: Employee's first name.
 *                       middle_name:
 *                         type: string
 *                         description: Employee's middle name.
 *                       last_name:
 *                         type: string
 *                         description: Employee's last name.
 *                       gender:
 *                         type: string
 *                         description: Employee's gender.
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                         description: Employee's date of birth.
 *                       marital_status:
 *                         type: string
 *                         description: Employee's marital status.
 *                       nationality:
 *                         type: string
 *                         description: Employee's nationality.
 *                       preferred_language:
 *                         type: string
 *                         description: Employee's preferred language.
 *                       country:
 *                         type: string
 *                         description: Employee's country.
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Employee's email address.
 *                       work_email:
 *                         type: string
 *                         format: email
 *                         description: Employee's work email address.
 *                       mobile_number:
 *                         type: string
 *                         description: Employee's mobile phone number.
 *                       phone_number:
 *                         type: string
 *                         description: Employee's work phone number.
 *                       worker_type:
 *                         type: string
 *                         description: Type of worker (e.g., full-time, part-time).
 *                       title:
 *                         type: string
 *                         description: Employee's job title.
 *                       org_id:
 *                         type: string
 *                         description: The organization ID where the employee belongs.
 *                       org_group:
 *                         type: string
 *                         description: The organization group the employee belongs to.
 *                       org_position:
 *                         type: string
 *                         description: The employee's position in the organization.
 *                       hire_date:
 *                         type: string
 *                         format: date
 *                         description: Employee's hire date.
 *                       status:
 *                         type: string
 *                         description: Employee's current status (active, inactive, etc.).
 *       404:
 *         description: No employees found.
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
 *                   example: 'No people found.'
 *       500:
 *         description: Error fetching employees data.
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
 *                   example: 'Error fetching people data.'
 *                 error:
 *                   type: string
 *                   example: 'Database connection failed.'
 */
router.get('/get', getAllPeople);

// Route for getting all people ids and names only
router.get('/id/get' , getAllPeopleIds);

// Route for getting people wihtiout security
router.get('/null-security/get', getAllPeopleWithoutSecurity);

// Route for getting a person by ID
/**
 * @swagger
 * /people/get/{id}:
 *   get:
 *     summary: Get a person by ID
 *     description: Fetches a person from the database using the provided UUID.
 *     tags:
 *       - People
 *     parameters:
 *       - name: id
 *         in: path
 *         description: UUID of the person to fetch
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved person data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     middle_name:
 *                       type: string
 *                       example: "M"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     preferred_language:
 *                       type: string
 *                       example: "English"
 *                     country:
 *                       type: string
 *                       example: "Pakistan"
 *                     country_iso_code:
 *                       type: string
 *                       example: "PK"
 *                     base_currency:
 *                       type: string
 *                       example: "PKR"
 *                     timezone:
 *                       type: string
 *                       example: "Asia/Karachi"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       400:
 *         description: Invalid ID format
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
 *                   example: "Invalid ID format."
 *       404:
 *         description: Person not found
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
 *                   example: "Person not found."
 *       500:
 *         description: Error fetching person
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
 *                   example: "Error fetching person."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/get/:id', getPersonById);

// Update Personal Details of People
/**
 * @swagger
 * /people/personal_details/update/{id}:
 *   patch:
 *     summary: Update a person's personal details
 *     description: Updates the personal and team details of a person identified by their ID.
 *     tags:
 *       - People
 *     parameters:
 *       - name: id
 *         in: path
 *         description: UUID of the person whose details need to be updated
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
 *               first_name:
 *                 type: string
 *               middle_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               gender:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               marital_status:
 *                 type: string
 *               nationality:
 *                 type: string
 *               preferred_language:
 *                 type: string
 *               country:
 *                 type: string
 *               base_currency:
 *                 type: string
 *                 default: 'PKR'
 *               timezone:
 *                 type: string
 *                 default: 'Asia/Karachi'
 *               email:
 *                 type: string
 *               work_email:
 *                 type: string
 *               mobile_number:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               worker_type:
 *                 type: string
 *               title:
 *                 type: string
 *               org_id:
 *                 type: string
 *               org_group:
 *                 type: string
 *               org_position:
 *                 type: string
 *               work_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated person details
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
 *                   example: 'Person updated successfully.'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     first_name:
 *                       type: string
 *                       example: 'John'
 *                     middle_name:
 *                       type: string
 *                       example: 'M'
 *                     last_name:
 *                       type: string
 *                       example: 'Doe'
 *                     gender:
 *                       type: string
 *                       example: 'Male'
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                       example: '1990-01-01'
 *                     marital_status:
 *                       type: string
 *                       example: 'Single'
 *                     nationality:
 *                       type: string
 *                       example: 'Pakistan'
 *                     preferred_language:
 *                       type: string
 *                       example: 'English'
 *                     country:
 *                       type: string
 *                       example: 'Pakistan'
 *                     base_currency:
 *                       type: string
 *                       example: 'PKR'
 *                     timezone:
 *                       type: string
 *                       example: 'Asia/Karachi'
 *                     email:
 *                       type: string
 *                       example: 'john.doe@example.com'
 *                     work_email:
 *                       type: string
 *                       example: 'john.doe@work.com'
 *                     mobile_number:
 *                       type: string
 *                       example: '+92 300 1234567'
 *                     phone_number:
 *                       type: string
 *                       example: '+92 21 12345678'
 *                     worker_type:
 *                       type: string
 *                       example: 'Full-time'
 *                     title:
 *                       type: string
 *                       example: 'Mr.'
 *                     org_id:
 *                       type: string
 *                       example: 'org123'
 *                     org_group:
 *                       type: string
 *                       example: 'HR'
 *                     org_position:
 *                       type: string
 *                       example: 'Manager'
 *                     work_id:
 *                       type: string
 *                       example: 'work987'
 *       400:
 *         description: Invalid input data
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
 *                   example: 'Invalid input data.'
 *       404:
 *         description: Person not found
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
 *                   example: 'Person not found.'
 *       500:
 *         description: Internal server error
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
 *                   example: 'Error updating person.'
 */
router.patch('/personal_details/update/:id', udpatePersonalDetails);

// Update Job Details of People 
/**
 * @swagger
 * /people/job_details/update/{id}:
 *   patch:
 *     summary: Update job details of a person
 *     description: Updates the job-related details of a person identified by their ID.
 *     tags:
 *       - People
 *     parameters:
 *       - name: id
 *         in: path
 *         description: UUID of the person whose job details need to be updated
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
 *               job_title:
 *                 type: string
 *               seniority_level:
 *                 type: string
 *               department_id:
 *                 type: string
 *               direct_report:
 *                 type: string
 *               work_location:
 *                 type: string
 *               reporting_manager_id:
 *                 type: string
 *               worker_id:
 *                 type: string
 *               employment_type:
 *                 type: string
 *                 default: "full-time"
 *               contract_start_date:
 *                 type: string
 *                 format: date
 *               contract_end_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Successfully updated job details
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
 *                   example: "Job Details of Person updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                     job_title:
 *                       type: string
 *                       example: "Software Engineer"
 *                     seniority_level:
 *                       type: string
 *                       example: "Mid-level"
 *                     department_id:
 *                       type: string
 *                       example: "IT"
 *                     direct_report:
 *                       type: string
 *                       example: "Team Lead"
 *                     work_location:
 *                       type: string
 *                       example: "Remote"
 *                     reporting_manager_id:
 *                       type: string
 *                       example: "abc1234"
 *                     worker_id:
 *                       type: string
 *                       example: "emp9876"
 *                     employment_type:
 *                       type: string
 *                       example: "full-time"
 *                     contract_start_date:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-01"
 *                     contract_end_date:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                       example: "2025-01-01"
 *       404:
 *         description: Person not found or update failed
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
 *                   example: "Person not found or could not update."
 *       500:
 *         description: Server error during the update process
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
 *                   example: "Error updating person job details."
 */
router.patch('/job_details/update/:id', udpateJobDetails);


// Update Bank Details of People
/**
 * @swagger
 * /people/bank_details/update/{id}:
 *   patch:
 *     summary: Update bank and financial details of a person
 *     description: Updates the bank and financial details of a person identified by their ID.
 *     tags:
 *       - People
 *     parameters:
 *       - name: id
 *         in: path
 *         description: UUID of the person whose bank and financial details need to be updated
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
 *               salary:
 *                 type: number
 *                 format: float
 *               payment_frequency:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               account_name:
 *                 type: string
 *               sort_code:
 *                 type: string
 *               account_number:
 *                 type: string
 *               bank_name:
 *                 type: string
 *               payment_reference:
 *                 type: string
 *               building_society_reference:
 *                 type: string
 *               iban:
 *                 type: string
 *               swift_code:
 *                 type: string
 *               country_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated bank and financial details
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
 *                   example: "Bank & Financial Details of Person updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-abcd-1234567890ab"
 *                     salary:
 *                       type: number
 *                       example: 50000.00
 *                     payment_frequency:
 *                       type: string
 *                       example: "monthly"
 *                     payment_method:
 *                       type: string
 *                       example: "bank_transfer"
 *                     account_name:
 *                       type: string
 *                       example: "John Doe"
 *                     sort_code:
 *                       type: string
 *                       example: "123456"
 *                     account_number:
 *                       type: string
 *                       example: "1234567890"
 *                     bank_name:
 *                       type: string
 *                       example: "Bank XYZ"
 *                     payment_reference:
 *                       type: string
 *                       example: "REF123456"
 *                     building_society_reference:
 *                       type: string
 *                       example: "BSREF123"
 *                     iban:
 *                       type: string
 *                       example: "GB29NWBK60161331926819"
 *                     swift_code:
 *                       type: string
 *                       example: "NWBKGB2L"
 *                     country_code:
 *                       type: string
 *                       example: "GB"
 *       404:
 *         description: Person not found or could not be updated
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
 *                   example: "Person not found."
 *       500:
 *         description: Error updating person bank and financial details
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
 *                   example: "Error updating person bank and financial details."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed."
 */
router.patch('/bank_details/update/:id', udpateBankDetails);

// Route for updating a person by ID
router.patch('/update/:id', updatePerson);

// Route for deleting a person by ID
/**
 * @swagger
 * /people/delete/{id}:
 *   delete:
 *     summary: Delete a person by ID
 *     description: Deletes a person from the database based on the provided UUID.
 *     tags:
 *       - People
 *     parameters:
 *       - name: id
 *         in: path
 *         description: UUID of the person to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully deleted the person
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
 *                   example: "Person deleted successfully."
 *       400:
 *         description: Invalid ID format
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
 *                   example: "Invalid ID format."
 *       404:
 *         description: Person not found
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
 *                   example: "Person not found."
 *       500:
 *         description: Error deleting the person
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
 *                   example: "Error deleting person."
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.delete('/delete/:id', deletePerson);

module.exports = router;