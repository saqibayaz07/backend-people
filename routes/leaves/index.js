
const express = require('express');
const router = express.Router();


const {
  createLeaveRecord,
  getAllLeaveRecords,
  getLeaveRecordById,
  getLeaveRecordOfUser,
  updateLeaveRecord,
  deleteLeaveRecord
} = require('./operations');



router.post('/add', createLeaveRecord);
router.get('/get', getAllLeaveRecords);
router.get('/get/:id', getLeaveRecordById);
router.get('/user/get/:id', getLeaveRecordOfUser);
router.put('/update/:id', updateLeaveRecord);
router.delete('/delete/:id', deleteLeaveRecord);


module.exports = router;