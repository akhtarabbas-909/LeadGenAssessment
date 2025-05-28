const express = require('express');
const router = express.Router();
const { submitAndScoreLead } = require('../controllers/leadaicontroller');

router.post('/score', submitAndScoreLead);

module.exports = router;
