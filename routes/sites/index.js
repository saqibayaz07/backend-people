const express = require('express'); 
const router = express.Router();

const {
  createSite,
  getAllSites,
  getSiteById,
  getSitesByMangerId,
  updateSite,
  deleteSite
} = require('./operations');

router.post('/add', createSite);

router.get('/get', getAllSites);
router.get('/get/:id', getSiteById);
router.get('/manager/get/:id', getSitesByMangerId);

router.put('/update/:id', updateSite);
router.delete('/delete/:id', deleteSite);

module.exports = router;
