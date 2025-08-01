const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// POST /api/v0/signup
router.get('/all', eventController.getAllEvents);
router.get('/slug/:slug', eventController.getEventBySlug);
router.get('/search', eventController.getEventByKeyword);
router.get('/banner', eventController.getBannerEvents);
router.get('/feature', eventController.getSpecialEvents);

module.exports = router;