const express = require('express');

const router = express.Router();


// import operations (functions)
const {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  getAttendancesByPeopleId,
  deleteAttendance,
  updateAttendance
} = require('./operations');


router.post('/add', createAttendance);

router.get('/get', getAllAttendances);
router.get('/get/:id', getAttendanceById);
router.get('/people/get/:id', getAttendancesByPeopleId);

router.put('/update/:id', updateAttendance);

router.delete('/delete/:id', deleteAttendance);

module.exports = router;