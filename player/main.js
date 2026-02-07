document.addEventListener("DOMContentLoaded", () => {
  // 1. Movie Player Logic
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get("movieID");
  const player = document.getElementById("player");

  if (movieID && player) {
    // MultiEmbed URL construction
    // video_id param for the movie ID
    // tmdb=1 indicates we are using a TMDB ID
    const embedUrl = `https://multiembed.mov/?video_id=${encodeURIComponent(movieID)}&tmdb=1`;
    player.src = embedUrl;

    // Update document title if possible (fetching details would be better, but we don't have them here)
    document.title = `Movie Player - ID: ${movieID}`;
  } else if (!movieID) {
    console.error("No Movie ID provided in URL.");
    if (player) {
      // Show a placeholder or error message
      player.srcdoc = `
                <style>
                    body { display: flex; justify-content: center; align-items: center; height: 100%; margin: 0; background: #000; color: #fff; font-family: sans-serif; }
                    .error { text-align: center; }
                    h2 { color: #e50914; }
                </style>
                <div class="error">
                    <h2>Movie Not Found</h2>
                    <p>No movie ID was provided. Please return to the homepage.</p>
                </div>
            `;
    }
  }

  // 2. Search Functionality
  const searchBtn = document.getElementById("search-btn");
  const searchBar = document.getElementById("search-bar");

  const performSearch = (e) => {
    if (e) e.preventDefault();
    const searchTerm = searchBar.value.trim();
    if (searchTerm) {
      // Redirect to search page with query
      window.location.href = `../search/index.html?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  if (searchBtn) {
    searchBtn.addEventListener("click", performSearch);
  }

  if (searchBar) {
    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch(e);
      }
    });
  }
});
