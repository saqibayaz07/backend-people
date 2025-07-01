const express = require('express');
const router = express.Router();

// Import operations (functions)
const {
  createSkillRecord,
  bulkCreateSkillRecord ,
  getAllSkillRecord ,
  getSkillsByCategory,
  getSkillRecordById,
  updateSkillRecord,
  deleteSkillRecord,
} = require('./operations');

// Route for creating a new record
router.post('/add', createSkillRecord);

// Route for creating multiple records
router.post('/multiple/add', bulkCreateSkillRecord);

// Route for getting all records
router.get('/get', getAllSkillRecord);

// Route for getting all records by category
router.get('/category/get', getSkillsByCategory);

// Route for getting a record by ID
router.get('/get/:id', getSkillRecordById);

// Route for updating a record by ID
router.put('/update/:id', updateSkillRecord);

// Route for deleting a record by ID
router.delete('/delete/:id', deleteSkillRecord);

module.exports = router;
