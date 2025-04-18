import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const baseURL = 'http://localhost:3000/jokebook';

function App() {
  const [randomJoke, setRandomJoke] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jokes, setJokes] = useState([]);
  const [formData, setFormData] = useState({ category: '', setup: '', delivery: '' });

  useEffect(() => {
    fetchRandomJoke();
    fetchCategories();
  }, []);

  const fetchRandomJoke = async () => {
    const res = await axios.get(`${baseURL}/random`);
    setRandomJoke(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${baseURL}/categories`);
    setCategories(res.data.categories);
  };

  const fetchJokesByCategory = async (category) => {
    const res = await axios.get(`${baseURL}/joke/${category}`);
    if (res.data.error) {
      setJokes([{ setup: res.data.error, delivery: '' }]);
    } else {
      setJokes(res.data.jokes);
    }
    setSelectedCategory(category);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/joke/add`, formData);
      alert('Joke added!');
      fetchJokesByCategory(formData.category);
      setFormData({ category: '', setup: '', delivery: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add joke.');
    }
  };

  return (
    <div className="container">
      <h1>Jokebook</h1>
  
      <h2>Random Joke</h2>
      {randomJoke && (
        <div className="joke">
          <strong>{randomJoke.setup}</strong> - {randomJoke.delivery}
        </div>
      )}
  
      <h2>Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat}>
            <button onClick={() => fetchJokesByCategory(cat)}>{cat}</button>
          </li>
        ))}
      </ul>
  
      <h2>Search Category</h2>
      <input
        type="text"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        placeholder="Enter category"
      />
      <button onClick={() => fetchJokesByCategory(selectedCategory)}>Search</button>
  
      <h2>Jokes in Category: {selectedCategory}</h2>
      {jokes.map((joke, idx) => (
        <div key={idx} className="joke">
          <strong>{joke.setup}</strong> - {joke.delivery}
        </div>
      ))}
  
      <h2>Add a New Joke</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="setup"
          placeholder="Setup"
          value={formData.setup}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="delivery"
          placeholder="Delivery"
          value={formData.delivery}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Joke</button>
      </form>
    </div>
  );
}  
export default App;
