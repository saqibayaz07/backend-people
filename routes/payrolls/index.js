const express = require('express');
const router = express.Router();


const {
  createPayroll,
  getAllPayrolls,
  getAllPayrollsByPeopleId,
  getPayrollById,
  updatePayroll,
  deletePayroll
} = require('./operations');


router.post('/add', createPayroll); 

router.get('/get', getAllPayrolls);
router.get('/get/:id', getPayrollById);

router.get('/people/get/:id', getAllPayrollsByPeopleId);

router.put('/update/:id', updatePayroll);

router.delete('/delete/:id', deletePayroll);

module.exports = router;