const JokeModel = require('../models/jokeModel');
const axios = require('axios');

exports.getCategories = async (req, res) => {
    try {
      const categories = await JokeModel.getCategories();
      res.json({ categories });
    } catch (error) {
      console.error('[getCategories] Error:', error);  // <-- Add this
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  exports.getJokesByCategory = async (req, res) => {
    const category = req.params.category;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
  
    try {
      let jokes = await JokeModel.getJokesByCategory(category, limit);
  
      if (!jokes) {
        // 🔥 Category not found — try JokeAPI
        console.log(`[Info] Category "${category}" not found. Fetching from JokeAPI...`);
  
        const apiURL = `https://v2.jokeapi.dev/joke/${category}?type=twopart&amount=3&safe-mode`;
  
        const response = await axios.get(apiURL);
        const data = response.data;
  
        // Handle if API returns error
        if (data.error || !data.jokes) {
          return res.status(404).json({ error: `No jokes found for category "${category}" from JokeAPI.` });
        }
  
        const jokesToInsert = data.jokes.map(j => ({
          setup: j.setup,
          delivery: j.delivery
        }));
  
        // Save the new category and jokes
        await JokeModel.createCategoryWithJokes(category, jokesToInsert);
  
        // Retrieve again to return from local DB
        jokes = await JokeModel.getJokesByCategory(category, limit);
      }
  
      res.json({ category, jokes });
  
    } catch (error) {
      console.error('[getJokesByCategory] Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.getRandomJoke = async (req, res) => {
  try {
    const joke = await JokeModel.getRandomJoke();
    res.json(joke);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addJoke = async (req, res) => {
  const { category, setup, delivery } = req.body;

  if (!category || !setup || !delivery) {
    return res.status(400).json({ error: 'Missing required fields: category, setup, or delivery.' });
  }

  try {
    const updatedJokes = await JokeModel.addJoke(category, setup, delivery);
    res.json({ message: 'Joke added successfully.', updatedCategory: category, jokes: updatedJokes });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error adding joke.' });
  }
};
