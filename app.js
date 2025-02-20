const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const gameDetails = document.getElementById("gameDetails");
const searchContainer = document.getElementById("searchContainer");
const gameContainer = document.getElementById("gameContainer");

const STEAM_API_KEY = "CEA69638E9E6D22BF2B3865055F6C309"; // Replace with your Steam API key

// Dummy Data for AAA Games
const dummyGames = [
  {
    name: "The Witcher 3: Wild Hunt",
    image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
    description: "An open-world RPG where you play as Geralt of Rivia.",
  },
  {
    name: "Cyberpunk 2077",
    image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    description: "A futuristic open-world RPG set in Night City.",
  },
  {
    name: "Red Dead Redemption 2",
    image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
    description: "An epic tale of life in America’s unforgiving heartland.",
  },
  {
    name: "Elden Ring",
    image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    description: "An action RPG by FromSoftware, set in a vast, fantastical world.",
  },
  {
    name: "Halo Infinite",
    image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg",
    description: "The latest installment in the Halo franchise.",
  },
  {
    name: "God of War",
    image_url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
    description: "Follow Kratos and Atreus on their journey through Norse mythology.",
  },
];

// Display Dummy Games
function displayDummyGames() {
  gameContainer.innerHTML = "";
  dummyGames.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.className = "game-card";
    gameCard.innerHTML = `
      <img src="${game.image_url}" alt="${game.name}">
      <h3>${game.name}</h3>
    `;
    gameCard.addEventListener("click", () => displayGameDetails(game));
    gameContainer.appendChild(gameCard);
  });
}

// Fetch Game Details from Steam
async function fetchGameDetailsFromSteam(gameName) {
  try {
    const appListResponse = await fetch(
      `https://api.steampowered.com/ISteamApps/GetAppList/v2/`
    );
    const appListData = await appListResponse.json();
    const appList = appListData.applist.apps;

    const game = appList.find(
      (app) => app.name.toLowerCase() === gameName.toLowerCase()
    );

    if (!game) return null;

    const appDetailsResponse = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${game.appid}`
    );
    const appDetailsData = await appDetailsResponse.json();

    if (appDetailsData[game.appid]?.success) {
      const data = appDetailsData[game.appid].data;
      return {
        name: data.name,
        image_url: data.header_image,
        description: data.short_description || "No description available.",
        rating: data.metacritic?.score ? `${data.metacritic.score}/100` : "N/A",
        reviews: data.recommendations
          ? `${data.recommendations.total} reviews`
          : "No reviews available.",
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null;
  }
}

// Display Game Details
function displayGameDetails(game) {
  gameContainer.style.display = "none";
  searchContainer.style.display = "none";
  gameDetails.style.display = "block";

  if (game) {
    gameDetails.innerHTML = `
      <h2>${game.name}</h2>
      <img src="${game.image_url}" alt="${game.name}">
      <p>${game.description}</p>
      <p><strong>Rating:</strong> ${game.rating || "N/A"}</p>
      <p><strong>Reviews:</strong> ${game.reviews || "No reviews available."}</p>
      <button id="backButton">Back to Search</button>
    `;

    document.getElementById("backButton").addEventListener("click", () => {
      gameDetails.style.display = "none";
      gameContainer.style.display = "grid";
      searchContainer.style.display = "flex";
    });
  } else {
    gameDetails.innerHTML = `
      <p>No game found for the given search term.</p>
      <button id="backButton">Back to Search</button>
    `;

    document.getElementById("backButton").addEventListener("click", () => {
      gameDetails.style.display = "none";
      gameContainer.style.display = "grid";
      searchContainer.style.display = "flex";
    });
  }
}

// Handle Search
searchButton.addEventListener("click", async () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    const gameData = await fetchGameDetailsFromSteam(searchTerm);
    displayGameDetails(gameData);
  }
});


// Initial Render of Dummy Games
displayDummyGames();
