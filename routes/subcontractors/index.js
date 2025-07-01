const express = require('express');
const router = express.Router();

const {
  createSubcontractor,

  getAllSubcontractors,
  getSubcontractorById,
  getSubcontractorsByCompanyName,
  
  updateSubcontractor,
  deleteSubcontractor
} = require('./operations');


router.post('/add', createSubcontractor);

router.get('/get', getAllSubcontractors);
router.get('/get/:id', getSubcontractorById);
router.get('/company/get/:id', getSubcontractorsByCompanyName);

router.put('/update/:id', updateSubcontractor);
router.delete('/delete/:id', deleteSubcontractor);

module.exports = router;