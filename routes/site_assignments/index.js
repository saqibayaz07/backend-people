const express = require('express');

const router = express.Router();

const {
  createSiteAssignment,
  getAllSiteAssignments,
  getSiteAssignmentById,
  updateSiteAssignment,
  deleteSiteAssignment
} = require('./operations');


// Route for creating a new site assignment
router.post('/add', createSiteAssignment);

router.get('/get', getAllSiteAssignments);
router.get('/get/:id', getSiteAssignmentById);

router.put('/update/:id', updateSiteAssignment);

router.delete('/delete/:id', deleteSiteAssignment);

module.exports = router;