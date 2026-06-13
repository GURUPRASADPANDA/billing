const express = require('express');
const router = express.Router();
const trashController = require('../controllers/trashController');

router.get('/:type', trashController.getTrash);
router.post('/restore/:type/:id', trashController.restoreTrash);
router.delete('/permanent/:type/:id', trashController.permanentDelete);

module.exports = router;
