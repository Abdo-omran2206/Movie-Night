const api_key = "46c6b94ccce1c631a65491288f4b23b1";
const base_url = "https://api.themoviedb.org/3";
const image_url = "https://image.tmdb.org/t/p/w500";

const urlParams = new URLSearchParams(window.location.search);
const paramValue = urlParams.get("paramName");

const name = urlParams.get("search");
const pageNum = urlParams.get("page");
let page = pageNum ? parseInt(pageNum) : 1;
let totalPages;

async function searchMovie(query, page) {
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(
      query,
    )}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    totalPages = data.total_pages; // Set total pages
    return data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}
// Generate rating stars
function getStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  for (let i = 0; i < fullStars; i++)
    stars.push('<i class="fa-solid fa-star" style="color:gold"></i>');
  if (halfStar)
    stars.push(
      '<i class="fa-solid fa-star-half-stroke" style="color:gold"></i>',
    );
  for (let i = 0; i < emptyStars; i++)
    stars.push('<i class="fa-regular fa-star" style="color:gold"></i>');

  return stars.join("");
}
function createMovieCard(movie) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const stars = getStars(movie.vote_average);

  return `
    <article class="top-rated-card" 
             onclick="location.href='../moviedetails/index.html?movieID=${
               movie.id
             }'" 
             role="listitem" 
             itemscope 
             itemtype="https://schema.org/Movie">
      <img src="${posterUrl}" 
           alt="Poster for ${movie.title}" 
           loading="lazy" 
           itemprop="image" />
      <div class="card-overlay">
        <h3 itemprop="name">${movie.title}</h3>
        <p itemprop="datePublished">Release Date: ${
          movie.release_date || "N/A"
        }</p>
        <p itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
          ${stars}
        </p>
      </div>
    </article>
  `;
}

async function updatePagination() {
  $("#search-loading-spinner").show();
  $("#category-title").hide();
  $("#movie-list-section").hide();
  $("#pagination-section").hide();

  $("#movie-list-section").empty();
  try {
    const movieData = await searchMovie(name, page);
    movieData.forEach((element) => {
      const movieHTML = createMovieCard(element);
      $("#movie-list-section").append(movieHTML);
    });

    // Update page info here, AFTER fetching totalPages
    $("#page-info").text(`Page ${page} of ${totalPages}`);

    $("#search-loading-spinner").hide();
    $("#category-title").show();
    $("#movie-list-section").show();
    $("#pagination-section").show();
  } catch (error) {
    console.error("Error loading movies:", error);
    $("#search-loading-spinner").hide();
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

$("#prev-btn").on("click", function () {
  if (page > 1) {
    page--;
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("page", page);
    window.history.pushState({}, "", newUrl);

    updatePagination();
    $("#page-info").text(`Page ${page} of ${totalPages}`);
    scrollToTop();
  }
});

$("#next-btn").on("click", function () {
  if (page < totalPages) {
    page++;
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("page", page);
    window.history.pushState({}, "", newUrl);

    updatePagination();
    $("#page-info").text(`Page ${page} of ${totalPages}`);
    scrollToTop();
  }
});

$(document).ready(function () {
  $("#category-title").text(
    `${name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ")}`,
  );
  updatePagination(); // page-info will update internally
});
