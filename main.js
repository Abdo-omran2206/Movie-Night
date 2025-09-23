const api_key = "46c6b94ccce1c631a65491288f4b23b1";
const base_url = "https://api.themoviedb.org/3";
const image_url = "https://image.tmdb.org/t/p/w500";

let genresMap = {};

// Fetch genres once and store them
async function fetchGenres() {
  try {
    const response = await fetch(
      `${base_url}/genre/movie/list?api_key=${api_key}&language=en-US`
    );
    const data = await response.json();
    genresMap = data.genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

// Reusable fetch function
async function fetchMovies(endpoint) {
  try {
    const response = await fetch(
      `${base_url}${endpoint}?api_key=${api_key}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
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
      '<i class="fa-solid fa-star-half-stroke" style="color:gold"></i>'
    );
  for (let i = 0; i < emptyStars; i++)
    stars.push('<i class="fa-regular fa-star" style="color:gold"></i>');

  return stars.join("");
}

// Card for trending movies (backdrop style)
function TrendingMovieBuilder(movie) {
  const backdropUrl = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
  const stars = getStars(movie.vote_average);

  const genres =
    movie.genre_ids && genresMap
      ? movie.genre_ids
          .map((id) => `<span class="genre-tag">${genresMap[id] || id}</span>`)
          .join(" ")
      : '<span class="genre-tag">N/A</span>';

  return `
    <div class="swiper-slide">
      <article
        style="background-image: url(${backdropUrl}); background-size: cover; background-position: center;"
        class="movie-card"
        role="listitem"
        itemscope
        itemtype="https://schema.org/Movie"
      >
        <meta itemprop="image" content="${backdropUrl}" />
        <div class="movie-info">
          <h3 class="movie-title" itemprop="name">${movie.title}</h3>
          <div class="movie-meta">
            
            <div class="rating" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
              <span class="release-date" itemprop="datePublished">
              ${movie.release_date}
            </span>
              <span itemprop="ratingValue">${movie.vote_average.toFixed(
                1
              )}/10 ${stars}</span>
              <span itemprop="reviewCount"> (${movie.vote_count} votes)</span>
            </div>

            <div class="movie-genres">${genres}</div>
            <div class="movie-overview">
            
            <h3>OVERVIEW</h3>
            <p itemprop="description">
              ${
                movie.overview 
              }
            </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
}

// Card for other sections (poster style)
function MovieCardGenerator(movie) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const stars = getStars(movie.vote_average);

  return `
    <article class="top-rated-card" 
             onclick="location.href='moviedetails/index.html?movieID=${
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

// General loader for sections
async function loadSection(
  endpoint,
  containerId,
  sectionId,
  builderFn,
  isSwiper = false
) {
  try {
    const movies = await fetchMovies(endpoint);
    movies.forEach((movie) => {
      $(`#${containerId}`).append(builderFn(movie));
    });
    $(`#${sectionId}`).show();
    if (isSwiper && typeof swiper !== "undefined") swiper.update();
  } catch (error) {
    console.error(`Error loading section ${sectionId}:`, error);
  }
}

$(document).ready(async function () {
  $("#main-loading-spinner").show();

  // Load genres once
  await fetchGenres();

  // Load all sections
  await loadSection(
    "/trending/movie/week",
    "trending-movies",
    "trending-section",
    TrendingMovieBuilder,
    true
  );
  await loadSection(
    "/movie/top_rated",
    "top-rated-movies",
    "top-rated-section",
    MovieCardGenerator
  );
  await loadSection(
    "/movie/popular",
    "popular-movies",
    "popular-section",
    MovieCardGenerator
  );
  await loadSection(
    "/movie/upcoming",
    "upcoming-movies",
    "upcoming-section",
    MovieCardGenerator
  );
  await loadSection(
    "/movie/now_playing",
    "now-playing-movies",
    "now-playing-section",
    MovieCardGenerator
  );

  $("#main-loading-spinner").hide();
});
