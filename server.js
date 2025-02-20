const express = require('express');
const axios = require('axios');  // For making HTTP requests
const path = require('path');
const app = express();
const port = 4000;

// Your Steam API Key
const STEAM_API_KEY = 'CEA69638E9E6D22BF2B3865055F6C309';  // Replace with your Steam API key

// Dummy list of game IDs (You can add more or fetch from your own data source)
const gameIds = [
  730,   // Counter-Strike: Global Offensive
  440,   // Team Fortress 2
  570,   // Dota 2
  730,   // CS:GO
  1190,  // Left 4 Dead 2
];

// Function to fetch game details from Steam
async function fetchGameDetails(gameId) {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails`, {
      params: {
        appids: gameId,
        key: STEAM_API_KEY
      }
    });

    // Check if the game details are available
    if (response.data[gameId] && response.data[gameId].success) {
      const game = response.data[gameId].data;
      return {
        name: game.name,
        description: game.short_description,
        image_url: game.header_image,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
}

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname)));

// Endpoint to fetch games from Steam
app.get('/api/games', async (req, res) => {
  const games = [];

  for (let gameId of gameIds) {
    const gameDetails = await fetchGameDetails(gameId);
    if (gameDetails) {
      games.push(gameDetails);
    }
  }

  res.json(games);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
