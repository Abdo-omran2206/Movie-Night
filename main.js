const api_key = "46c6b94ccce1c631a65491288f4b23b1";
const base_url = "https://api.themoviedb.org/3";
const image_url = "https://image.tmdb.org/t/p/w500";

async function fetchTrendingMovies() {
  try {
    const response = await fetch(
      `${base_url}/trending/movie/week?api_key=${api_key}`
    );
    const data = await response.json();
    return data.results; // Array of movies
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}
async function fetchTopRatedMovies() {
  try {
    const response = await fetch(
      `${base_url}/movie/top_rated?api_key=${api_key}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results; // Array of movies
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}
async function fetchPopular() {
  try {
    const response = await fetch(
      `${base_url}/movie/popular?api_key=${api_key}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results; // Array of movies
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}
async function fetchUpcoming() {
  try {
    const response = await fetch(
      `${base_url}/movie/upcoming?api_key=${api_key}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results; // Array of movies
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return [];
  }
}
async function fetchNowPlaying() {
  try {
    const response = await fetch(
      `${base_url}/movie/now_playing?api_key=${api_key}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results; // Array of movies
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return [];
  }
}

function TrendingMovieBuilder(movie) {
  // base urls للصور
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const backdropUrl = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;

  return `
    <div
      style="
        background-image: url(${backdropUrl});
        background-size: cover;
        background-position: center;
      "
      class="movie-card"
    >
      <!-- صورة البوستر -->
      <img
        src="${posterUrl}"
        alt="${movie.title}"
        loading="lazy"
        class="poster"
      />

      <!-- تفاصيل الفيلم -->
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="release-date">Release Date: ${movie.release_date || "N/A"}</p>
        <p class="rating">⭐ ${movie.vote_average.toFixed(1)} (${
    movie.vote_count
  } votes)</p>
        <p class="language">Language: ${movie.original_language}</p>
        <p class="overview">${movie.overview || "No description available."}</p>
      </div>
    </div>
  `;
}

function MovieCardGenerator(movie) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return `<div class="top-rated-card" onclick="location.href='/moviedetails/index.html?movieID=${movie.id}'">
            <img
              src="${posterUrl}"
              alt="${movie.title}"
              loading="lazy"
            />
            <div class="card-overlay">
              <h3>${movie.title}</h3>
              <p>Release Date: ${movie.release_date || "N/A"}</p>
              <p>Rating: ${"★".repeat(Math.round(movie.vote_average / 2))}☆</p>
            </div>
          </div>`;
}

$(document).ready(async function () {
  // Show loading spinner
  $("#main-loading-spinner").show();
  
  // Clear all movie containers
  $("#trending-movies").empty();
  $("#top-rated-movies").empty();
  $("#popular-movies").empty();
  $("#upcoming-movies").empty();
  $("#now-playing-movies").empty();
  
  try {
    const movieData = await fetchTrendingMovies(); // استنى لحد ما البيانات ترجع
    movieData.forEach((element) => {
      const movieHTML = TrendingMovieBuilder(element);
      $("#trending-movies").append(movieHTML);
    });
    $("#trending-section").show();
  } catch (error) {
    console.error("Error loading trending movies:", error);
  }

  try {
    const movieData = await fetchTopRatedMovies(); // استنى لحد ما البيانات ترجع
    movieData.forEach((element) => {
      const movieHTML = MovieCardGenerator(element);
      $("#top-rated-movies").append(movieHTML);
    });
    $("#top-rated-section").show();
  } catch (error) {
    console.error("Error loading top rated movies:", error);
  }

  try {
    const movieData = await fetchPopular(); // استنى لحد ما البيانات ترجع
    movieData.forEach((element) => {
      const movieHTML = MovieCardGenerator(element);
      $("#popular-movies").append(movieHTML);
    });
    $("#popular-section").show();
  } catch (error) {
    console.error("Error loading top rated movies:", error);
  }
  try {
    const movieData = await fetchUpcoming(); // استنى لحد ما البيانات ترجع
    movieData.forEach((element) => {
      const movieHTML = MovieCardGenerator(element);
      $("#upcoming-movies").append(movieHTML);
    });
    $("#upcoming-section").show();
  } catch (error) {
    console.error("Error loading upcoming movies:", error);
  }
  try {
    const movieData = await fetchNowPlaying(); // استنى لحد ما البيانات ترجع
    movieData.forEach((element) => {
      const movieHTML = MovieCardGenerator(element);
      $("#now-playing-movies").append(movieHTML);
    });
    $("#now-playing-section").show();
  } catch (error) {
    console.error("Error loading now playing movies:", error);
  }
  
  // Hide loading spinner after all data is loaded
  $("#main-loading-spinner").hide();
});
