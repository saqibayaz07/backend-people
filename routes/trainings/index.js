const express = require('express');
const router = express.Router();


const {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining
} = require('./operations');  


router.post('/add', createTraining);
router.get('/get' , getAllTrainings);
router.get('/get/:id', getTrainingById); 
router.put('/update/:id', updateTraining);
router.delete('/delete/:id', deleteTraining);

module.exports = router;