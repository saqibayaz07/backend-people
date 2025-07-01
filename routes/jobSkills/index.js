const express = require('express');

const router = express.Router();

const {
  createJobSkillsRecord,
  getAllJobSkillsRecords,
  bulkCreateJobSkillsRecords
} = require('./operations');


router.get('/get', getAllJobSkillsRecords);
router.post('/add', createJobSkillsRecord);
router.post('/bulk/add', bulkCreateJobSkillsRecords);


module.exports = router;