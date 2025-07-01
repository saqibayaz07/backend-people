const express = require('express');
const router = express.Router();

// Import operations (functions)
const {
  createSecurityRecord,
  bulkCreateSecurityRecords, 
  getAllSecurityRecords,
  getSecurityRecordById,
  getSecuritiesForNullPeople,
  updateSecurityRecord,
  deleteSecurityRecord,
} = require('./operations');

// Route for creating a new record
router.post('/add', createSecurityRecord);

// Route for creating multiple records
router.post('/multiple/add', bulkCreateSecurityRecords);

// Route for getting all records
router.get('/get', getAllSecurityRecords);

// Route for getting a record by ID
router.get('/get/:id', getSecurityRecordById);

// Route for getting all records where people_id is null
router.get('/null-people/get', getSecuritiesForNullPeople);

// Route for updating a record by ID
router.put('/update/:id', updateSecurityRecord);

// Route for deleting a record by ID
router.delete('/delete/:id', deleteSecurityRecord);

module.exports = router;
