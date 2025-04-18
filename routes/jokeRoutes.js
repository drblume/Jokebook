const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');

// GET /jokebook/categories
router.get('/categories', jokeController.getCategories);

// GET /jokebook/joke/:category?limit=3
router.get('/joke/:category', jokeController.getJokesByCategory);

// GET /jokebook/random
router.get('/random', jokeController.getRandomJoke);

// POST /jokebook/joke/add
router.post('/joke/add', jokeController.addJoke);

module.exports = router;
