const api_key = "46c6b94ccce1c631a65491288f4b23b1";
const base_url = "https://api.themoviedb.org/3";
const image_url = "https://image.tmdb.org/t/p/w500";

// Get movie ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieID = urlParams.get("movieID");

// Fetch movie details
async function fetchMovieDetails(movieID) {
  try {
    const response = await fetch(
      `${base_url}/movie/${movieID}?api_key=${api_key}&language=en-US&append_to_response=credits,similar,videos`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Format runtime from minutes to hours and minutes
function formatRuntime(minutes) {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Format release date
function formatReleaseDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate star rating
function generateStarRating(rating) {
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;
  let stars = "★".repeat(fullStars);
  if (hasHalfStar) stars += "☆";
  return stars;
}

// Display movie details
function displayMovieDetails(movie) {
  // Set backdrop image
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : "https://via.placeholder.com/1280x720/333/fff?text=No+Image";

  document.querySelector(
    ".movie-backdrop"
  ).style.backgroundImage = `url(${backdropUrl})`;

  // Set poster image
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/350x525/333/fff?text=No+Image";

  document.getElementById("movie-poster-img").src = posterUrl;
  document.getElementById("movie-poster-img").alt = movie.title;

  // Set movie title
  document.getElementById("movie-title").textContent = movie.title;

  // Set movie meta information
  document.getElementById("movie-release-date").textContent = formatReleaseDate(
    movie.release_date
  );
  document.getElementById("movie-runtime").textContent = formatRuntime(
    movie.runtime
  );
  document.getElementById(
    "movie-rating"
  ).textContent = `${movie.vote_average.toFixed(1)}/10 ${generateStarRating(
    movie.vote_average
  )}`;

  // Set genres
  const genresContainer = document.getElementById("movie-genres");
  genresContainer.innerHTML = "";
  movie.genres.forEach((genre) => {
    const genreTag = document.createElement("span");
    genreTag.className = "genre-tag";
    genreTag.textContent = genre.name;
    genresContainer.appendChild(genreTag);
  });

  // Call this after fetching movie details
  function setupWatchButton(videos) {
    const $watchBtn = $("#movie-actions .watch-btn");

    $watchBtn.off("click").on("click", function () {
      // Find a YouTube trailer
      const trailer = videos.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );

      if (trailer) {
        // Create overlay
        const $overlay = $(`
        <div id="video-overlay" style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        ">
          <iframe width="90%" height="80%"
            src="https://www.youtube.com/embed/${trailer.key}?autoplay=1"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
          <span id="close-overlay" style="
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 30px;
            color: white;
            cursor: pointer;
          ">&times;</span>
        </div>
      `);

        $("body").append($overlay);

        // Close overlay
        $("#close-overlay").on("click", function () {
          $overlay.remove();
        });
      } else {
        // Fallback: open YouTube search
        const movieTitle = $("#movie-title").text();
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            movieTitle + " trailer"
          )}`,
          "_blank"
        );
      }
    });
  }

  // In your displayMovieDetails(movie) function, after setting movie.videos:
  setupWatchButton(movie.videos);

  // Set overview
  document.getElementById("movie-description").textContent =
    movie.overview || "No overview available.";

  // Set page title
  document.title = `${movie.title} (${
    movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"
  }) - Movie Details | Movie Night`;

  // Display cast
  displayCast(movie.credits.cast.slice(0, 12)); // Show first 12 cast members

  // Display similar movies
  displaySimilarMovies(movie.similar.results.slice(0, 8)); // Show first 8 similar movies
}

// Display cast information
function displayCast(cast) {
  const castGrid = document.getElementById("cast-grid");
  castGrid.innerHTML = "";

  cast.forEach((person) => {
    const castCard = document.createElement("div");
    castCard.className = "cast-card";
    castCard.addEventListener("click", () => {
      location.href = `../actor/index.html?actorID=${person.id}`;
    });
    const profileUrl = person.profile_path
      ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
      : "https://via.placeholder.com/300x450/333/fff?text=No+Image";

    castCard.innerHTML = `
      <img src="${profileUrl}" alt="${person.name}" loading="lazy" />
      <div class="cast-info">
        <div class="cast-name">${person.name}</div>
        <div class="cast-character">${person.character}</div>
      </div>
    `;

    castGrid.appendChild(castCard);
  });
}

// Display similar movies
function displaySimilarMovies(movies) {
  const similarGrid = document.getElementById("similar-movies-grid");
  similarGrid.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "similar-movie-card";
    movieCard.onclick = () => {
      window.location.href = `./index.html?movieID=${movie.id}`;
    };

    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : "https://via.placeholder.com/300x450/333/fff?text=No+Image";

    movieCard.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title}" loading="lazy" />
      <div class="similar-movie-info">
        <div class="similar-movie-title">${movie.title}</div>
        <div class="similar-movie-rating">${movie.vote_average.toFixed(
          1
        )}/10</div>
      </div>
    `;

    similarGrid.appendChild(movieCard);
  });
}

// Show error message
function showError() {
  document.getElementById("loading-spinner").style.display = "none";
  document.getElementById("error-message").style.display = "flex";
}

// Show movie details
function showMovieDetails() {
  document.getElementById("loading-spinner").style.display = "none";
  document.getElementById("movie-details").style.display = "block";
}

// Initialize the page
$(document).ready(async function () {
  if (!movieID) {
    showError();
    return;
  }

  try {
    const movie = await fetchMovieDetails(movieID);

    if (!movie || movie.success === false) {
      showError();
      return;
    }

    displayMovieDetails(movie);
    showMovieDetails();
  } catch (error) {
    console.error("Error loading movie details:", error);
    showError();
  }
});
