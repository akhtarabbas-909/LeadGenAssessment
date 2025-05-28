const express = require('express');
const router = express.Router();
const webhooksController = require('../controllers/webhooksController');

router.get('/', webhooksController.getAll);
router.get('/:id', webhooksController.getById);
router.post('/', webhooksController.create);
router.put('/:id', webhooksController.update);
router.delete('/:id', webhooksController.remove)    ;

module.exports = router;
