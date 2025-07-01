const { peoples, security_people_extensions } = require('../../models'); // Import the model



// Create a new Security Record
/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new security record
 *     description: This endpoint creates a new security record for a person. It checks whether the person exists and if there is no existing record for the person.
 *     operationId: createSecurityRecord
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - people_id
 *               - background_checks
 *               - security_clearance_level
 *             properties:
 *               people_id:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the person the security record belongs to
 *               background_checks:
 *                 type: object
 *                 description: The background check details (e.g., criminal record, credit check)
 *               security_clearance_level:
 *                 type: string
 *                 description: The security clearance level of the person
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                   - top-secret
 *               certifications:
 *                 type: object
 *                 description: Certifications related to security (e.g., security training)
 *               training_completed:
 *                 type: string
 *                 description: The training completed by the person
 *               license_number:
 *                 type: string
 *                 description: The license number of the person
 *               license_expiry_date:
 *                 type: string
 *                 format: date
 *                 description: The expiry date of the license
 *               work_permit_status:
 *                 type: string
 *                 description: The status of the work permit (e.g., valid, expired)
 *               incident_reports:
 *                 type: object
 *                 description: Reports of incidents involving the person
 *               risk_assessment_score:
 *                 type: integer
 *                 description: The risk assessment score of the person
 *               assigned_security_zone:
 *                 type: string
 *                 description: The security zone assigned to the person
 *     responses:
 *       201:
 *         description: The security record was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: The UUID of the newly created security record
 *                 people_id:
 *                   type: string
 *                   format: uuid
 *                   description: The UUID of the person the security record belongs to
 *                 background_checks:
 *                   type: object
 *                   description: The background check details (e.g., criminal record, credit check)
 *                 security_clearance_level:
 *                   type: string
 *                   description: The security clearance level of the person
 *                   enum:
 *                     - low
 *                     - medium
 *                     - high
 *                     - top-secret
 *                 certifications:
 *                   type: object
 *                   description: Certifications related to security (e.g., security training)
 *                 training_completed:
 *                   type: string
 *                   description: The training completed by the person
 *                 license_number:
 *                   type: string
 *                   description: The license number of the person
 *                 license_expiry_date:
 *                   type: string
 *                   format: date
 *                   description: The expiry date of the license
 *                 work_permit_status:
 *                   type: string
 *                   description: The status of the work permit (e.g., valid, expired)
 *                 incident_reports:
 *                   type: object
 *                   description: Reports of incidents involving the person
 *                 risk_assessment_score:
 *                   type: integer
 *                   description: The risk assessment score of the person
 *                 assigned_security_zone:
 *                   type: string
 *                   description: The security zone assigned to the person
 *       400:
 *         description: Bad request. Missing required fields or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating missing or invalid data
 *       404:
 *         description: People not found with the provided `people_id`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the person was not found
 *       500:
 *         description: Internal server error. Failed to create the security record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message if the creation failed
 */

const createSecurityRecord = async (req, res) => {
  const {
    people_id,
    background_checks,
    security_clearance_level,
    certifications,
    training_completed,
    license_number,
    license_expiry_date,
    work_permit_status,
    incident_reports,
    risk_assessment_score,
    assigned_security_zone
  } = req.body;

  // Validate required fields
  if (!people_id || !background_checks || !security_clearance_level) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {

    // Check if People exists in the database
    const people = await peoples.findOne({ where: { id: people_id } });
    if (!people) {
      return res.status(400).json({ success: false, error: 'People not found' });
    }

    // Check if record already exists
    const existing_people = await security_people_extensions.findOne({ where: { people_id: people_id } });
    if (existing_people) {
      return res.status(400).json({ success: false, error: 'Record cannot create because same record exist for other people.' });
    }

    // Create the record
    const record = await security_people_extensions.create({
      people_id,
      background_checks,
      security_clearance_level,
      certifications,
      training_completed,
      license_number,
      license_expiry_date,
      work_permit_status,
      incident_reports,
      risk_assessment_score,
      assigned_security_zone
    });

    return res.status(201).json(record); // Respond with the newly created record
  } catch (error) {
    return res.status(500).json({ error: 'Error creating record: ' + error.message });
  }
};

// Bulk create Security records
/**
 * @swagger
 * /records/bulk:
 *   post:
 *     summary: Bulk create security records
 *     description: This endpoint allows the bulk creation of security records for multiple people. The request body should contain an array of records to be created.
 *     operationId: bulkCreateSecurityRecords
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - people_id
 *                 - background_checks
 *                 - security_clearance_level
 *               properties:
 *                 people_id:
 *                   type: string
 *                   format: uuid
 *                   description: The UUID of the person the security record belongs to
 *                 background_checks:
 *                   type: object
 *                   description: The background check details (e.g., criminal record, credit check)
 *                 security_clearance_level:
 *                   type: string
 *                   description: The security clearance level of the person
 *                   enum:
 *                     - low
 *                     - medium
 *                     - high
 *                     - top-secret
 *                 certifications:
 *                   type: object
 *                   description: Certifications related to security (e.g., security training)
 *                 training_completed:
 *                   type: string
 *                   description: The training completed by the person
 *                 license_number:
 *                   type: string
 *                   description: The license number of the person
 *                 license_expiry_date:
 *                   type: string
 *                   format: date
 *                   description: The expiry date of the license
 *                 work_permit_status:
 *                   type: string
 *                   description: The status of the work permit (e.g., valid, expired)
 *                 incident_reports:
 *                   type: object
 *                   description: Reports of any security incidents
 *                 risk_assessment_score:
 *                   type: number
 *                   format: float
 *                   description: The person's risk assessment score
 *                 assigned_security_zone:
 *                   type: string
 *                   description: The assigned security zone for the person
 *     responses:
 *       201:
 *         description: Successfully created records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: The UUID of the created security record
 *                   people_id:
 *                     type: string
 *                     format: uuid
 *                     description: The UUID of the person the security record belongs to
 *                   background_checks:
 *                     type: object
 *                     description: The background check details
 *                   security_clearance_level:
 *                     type: string
 *                     description: The security clearance level
 *       400:
 *         description: Bad request - validation errors or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Error creating records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message if the bulk creation failed
 */
const bulkCreateSecurityRecords = async (req, res) => {
  const records = req.body;

  try {
    const createdRecords = await security_people_extensions.bulkCreate(records);
    return res.status(201).json(createdRecords); // Respond with the newly created records
  } catch (error) {
    return res.status(500).json({ error: 'Error creating records: ' + error.message });
  }
};

// Get all records
/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all security records
 *     description: This endpoint retrieves all security records from the database.
 *     operationId: getAllSecurityRecords
 *     tags:
 *       - Records
 *     responses:
 *       200:
 *         description: A list of all security records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the security record
 *                   people_id:
 *                     type: integer
 *                     description: The ID of the person the security record belongs to
 *                   background_checks:
 *                     type: string
 *                     description: The background check status
 *                   security_clearance_level:
 *                     type: string
 *                     description: The security clearance level of the person
 *                   certifications:
 *                     type: string
 *                     description: The certifications the person holds
 *                   training_completed:
 *                     type: string
 *                     description: The training completed by the person
 *                   license_number:
 *                     type: string
 *                     description: The license number of the person
 *                   license_expiry_date:
 *                     type: string
 *                     format: date
 *                     description: The expiry date of the person's license
 *                   work_permit_status:
 *                     type: string
 *                     description: The status of the person's work permit
 *                   incident_reports:
 *                     type: string
 *                     description: Incident reports associated with the person
 *                   risk_assessment_score:
 *                     type: integer
 *                     description: The person's risk assessment score
 *                   assigned_security_zone:
 *                     type: string
 *                     description: The security zone assigned to the person
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Error retrieving records: some error message"
 */
const getAllSecurityRecords = async (req, res) => {
  try {
    const records = await security_people_extensions.findAll();
    return res.status(200).json(records); // Respond with all records
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving records: ' + error.message });
  }
};

// Get a record by ID
/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a specific security record by ID
 *     description: This endpoint retrieves a specific security record based on the provided ID.
 *     operationId: getSecurityRecordById
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The UUID of the security record to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The security record corresponding to the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: The unique identifier for the security record (UUID)
 *                 people_id:
 *                   type: string
 *                   format: uuid
 *                   description: The UUID of the person the security record belongs to
 *                 background_checks:
 *                   type: object
 *                   description: The background check details (e.g., criminal record, credit check)
 *                 security_clearance_level:
 *                   type: string
 *                   description: The security clearance level of the person
 *                   enum:
 *                     - low
 *                     - medium
 *                     - high
 *                     - top-secret
 *                 certifications:
 *                   type: object
 *                   description: The certifications the person holds
 *                 training_completed:
 *                   type: string
 *                   description: The training completed by the person
 *                 license_number:
 *                   type: string
 *                   description: The license number of the person
 *                 license_expiry_date:
 *                   type: string
 *                   format: date
 *                   description: The expiry date of the person's license
 *                 work_permit_status:
 *                   type: string
 *                   description: The status of the person's work permit
 *                 incident_reports:
 *                   type: string
 *                   description: Incident reports associated with the person
 *                 risk_assessment_score:
 *                   type: integer
 *                   description: The person's risk assessment score
 *                 assigned_security_zone:
 *                   type: string
 *                   description: The security zone assigned to the person
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message when the record is not found
 *                 message:
 *                   type: string
 *                   description: Detailed message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                 message:
 *                   type: string
 *                   description: Detailed error message
 */
const getSecurityRecordById = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await security_people_extensions.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.status(200).json(record); // Respond with the found record
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving record: ' + error.message });
  }
};

// Get all records with null people_id
/**
 * @swagger
 * /records/null-people:
 *   get:
 *     summary: Get all security records with null people_id
 *     description: This endpoint retrieves all security records where the `people_id` is null.
 *     operationId: getSecuritiesForNullPeople
 *     tags:
 *       - Records
 *     responses:
 *       200:
 *         description: A list of all security records with a null `people_id`
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the security record (UUID)
 *                   people_id:
 *                     type: string
 *                     format: uuid
 *                     description: The UUID of the person the security record belongs to (null if no person is assigned)
 *       500:
 *         description: Error retrieving records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message if the request fails
 */
const getSecuritiesForNullPeople = async (req, res) => {
  try {
    const records = await security_people_extensions.findAll({
      where: {
        people_id: null
      },
      order: [['id', 'ASC']],
      attributes: ['id', 'people_id']
    });
    return res.status(200).json(records); // Respond with all records
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving records: ' + error.message });
  }
}


// Update a record by ID
/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update a specific security record by ID
 *     description: This endpoint allows the updating of a specific security record based on the provided ID. It checks for existing records, and validates that the `people_id` is correctly associated with the record.
 *     operationId: updateSecurityRecord
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The UUID of the security record to update
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
 *                 description: The UUID of the person the security record belongs to
 *               background_checks:
 *                 type: object
 *                 description: The background check details (e.g., criminal record, credit check)
 *               security_clearance_level:
 *                 type: string
 *                 description: The security clearance level of the person
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                   - top-secret
 *               certifications:
 *                 type: object
 *                 description: Certifications related to security (e.g., security training)
 *               training_completed:
 *                 type: string
 *                 description: The training completed by the person
 *               license_number:
 *                 type: string
 *                 description: The license number of the person
 *               license_expiry_date:
 *                 type: string
 *                 format: date
 *                 description: The expiry date of the person's license
 *               work_permit_status:
 *                 type: string
 *                 description: The status of the person's work permit
 *               incident_reports:
 *                 type: string
 *                 description: Incident reports associated with the person
 *               risk_assessment_score:
 *                 type: integer
 *                 description: The person's risk assessment score
 *               assigned_security_zone:
 *                 type: string
 *                 description: The security zone assigned to the person
 *     responses:
 *       200:
 *         description: The security record was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: The UUID of the updated security record
 *                 people_id:
 *                   type: string
 *                   format: uuid
 *                   description: The UUID of the person the updated security record belongs to
 *       400:
 *         description: Invalid request, due to mismatching `people_id` or other constraints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                   description: Error message explaining the issue
 *       404:
 *         description: The specified record was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message if the update fails
 */
const updateSecurityRecord = async (req, res) => {
  const { id } = req.params;
  const {
    people_id,
    background_checks,
    security_clearance_level,
    certifications,
    training_completed,
    license_number,
    license_expiry_date,
    work_permit_status,
    incident_reports,
    risk_assessment_score,
    assigned_security_zone
  } = req.body;

  try {
    const record = await security_people_extensions.findByPk(id);

    // Fetch the record to update
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found for this id' });
    }
    if (record.people_id === null) {
      return res.status(400).json({ success: false, error: 'Record cannot be updated because the people_id is null.' });
    }
    if (!people_id) {
      return res.status(400).json({ success: false, error: 'people_id is required' });
    }

    // Ensure the people_id matches the record
    if (record.people_id !== people_id && record.people_id !== null) {
      return res.status(400).json({ success: false, error: 'Record cannot be updated because the people_id doesn\'t match.' });
    }

    // Check if the people_id is already associated with another record
    const existingRecord = await security_people_extensions.findOne({ where: { people_id } });
    if (existingRecord && existingRecord.id !== record.id) {
      return res.status(400).json({ success: false, error: 'Record cannot be updated because the same people_id exists for another record.' });
    }

    // Prepare the update data
    const updatedData = {
      background_checks,
      security_clearance_level,
      certifications,
      training_completed,
      license_number,
      license_expiry_date,
      work_permit_status,
      incident_reports,
      risk_assessment_score,
      assigned_security_zone
    };

    // Only update fields that have changed
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined || updatedData[key] === null) {
        delete updatedData[key];
      }
    });

    // Update the record with the provided data
    await record.update(updatedData);

    return res.status(200).json({ success: true, message: 'Record updated successfully', data: record });
  } catch (error) {
    console.error('Error updating record:', error); // Log error internally
    return res.status(500).json({ success: false, error: 'Error updating record: ' + error.message });
  }
};


// Delete a record by ID
/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a specific security record by ID
 *     description: This endpoint deletes a specific security record based on the provided ID.
 *     operationId: deleteSecurityRecord
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The UUID of the security record to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The security record was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating successful deletion
 *       404:
 *         description: The security record was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the record was not found
 *       500:
 *         description: Error deleting the record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message if the deletion failed
 */
const deleteSecurityRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await security_people_extensions.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Delete the record
    await record.destroy();
    return res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting record: ' + error.message });
  }
};

module.exports = {
  createSecurityRecord,
  bulkCreateSecurityRecords,
  getAllSecurityRecords,
  getSecuritiesForNullPeople,
  getSecurityRecordById,
  updateSecurityRecord,
  deleteSecurityRecord,
};
