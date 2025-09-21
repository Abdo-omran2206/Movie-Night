const api_key = "46c6b94ccce1c631a65491288f4b23b1";
const base_url = "https://api.themoviedb.org/3";
const image_url = "https://image.tmdb.org/t/p/w500";

// For current page URL
const urlParams = new URLSearchParams(window.location.search);
const paramValue = urlParams.get("paramName");

const name = urlParams.get("category");
let page = 1;
let totalPages = 500;

async function fetchMovies(category, page) {
  try {
    if (
      !["trending", "top_rated", "popular", "upcoming", "now_playing"].includes(
        category
      )
    ) {
      throw new Error("Invalid category");
    }
    if (category === "trending") {
      const response = await fetch(
        `${base_url}/${category}/movie/week?api_key=${api_key}&page=${page}`
      );
      const data = await response.json();
      totalPages = data.total_pages; // Set total pages
      return data.results; // Array of movies
    } else {
      const response = await fetch(
        `${base_url}/movie/${category}?api_key=${api_key}&page=${page}`
      );
      const data = await response.json();
      totalPages = data.total_pages; // Set total pages
      return data.results; // Array of movies
    }
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}

function createMovieCard(movie) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return `<div class="top-rated-card" onclick="location.href='../moviedetails/index.html?movieID=${movie.id}'">
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

async function updatePagination() {
  // Show loading spinner
  $("#movies-loading-spinner").show();
  $("#category-title").hide();
  $("#movie-list-section").hide();
  $("#pagination-section").hide();
  
  $("#movie-list-section").empty();
  try {
    const movieData = await fetchMovies(name, page); // استنى لحد ما البيانات ترجع
    movieData.forEach((element) => {
      const movieHTML = createMovieCard(element);
      $("#movie-list-section").append(movieHTML);
    });
    
    // Hide loading and show content
    $("#movies-loading-spinner").hide();
    $("#category-title").show();
    $("#movie-list-section").show();
    $("#pagination-section").show();
  } catch (error) {
    console.error("Error loading movies:", error);
    $("#movies-loading-spinner").hide();
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

$("#prev-btn").on("click", function () {
  if (page > 1) {
    page--;
    updatePagination();
    $("#page-info").text(`Page ${page} of ${totalPages}`);
    scrollToTop()
  }
});

$("#next-btn").on("click", function () {
  if (page < totalPages) {
    page++;
    updatePagination();
    $("#page-info").text(`Page ${page} of ${totalPages}`);
    scrollToTop()
  }
});

$(document).ready(async function () {
  $("#category-title").text(
    `${name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ")} Movies`
  );
  updatePagination();
  $("#page-info").text(`Page ${page} of ${totalPages}`);
});
