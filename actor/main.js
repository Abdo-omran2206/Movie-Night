const api_key = "46c6b94ccce1c631a65491288f4b23b1";
const base_url = "https://api.themoviedb.org/3";
const image_url = "https://image.tmdb.org/t/p/w500";

const urlParams = new URLSearchParams(window.location.search);
const actorIDFromQuery = urlParams.get("actorID");

function setLoading(isLoading) {
  const spinner = document.getElementById("loading-spinner");
  const details = document.getElementById("actor-details");
  if (!spinner || !details) return;
  spinner.style.display = isLoading ? "flex" : "none";
  details.style.display = isLoading ? "none" : "block";
}

function showError(message) {
  const errorEl = document.getElementById("error-message");
  const spinner = document.getElementById("loading-spinner");
  const details = document.getElementById("actor-details");
  if (spinner) spinner.style.display = "none";
  if (details) details.style.display = "none";
  if (errorEl) {
    errorEl.style.display = "flex";
    if (message) {
      const p = errorEl.querySelector("p");
      if (p) p.textContent = message;
    }
  }
}

function safeText(value, fallback = "-") {
  return value && String(value).trim().length > 0 ? value : fallback;
}

function buildImageUrl(path) {
  return path ? `${image_url}${path}` : "https://via.placeholder.com/300x450?text=No+Image";
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function createMovieCard(movie) {
  const posterSrc = movie.poster_path
    ? `${image_url}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  const vote = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "-";
  const title = movie.title || movie.name || "Untitled";

  const card = document.createElement("div");
  card.className = "movie-card";
  card.onclick = function () {
    window.location.href = `../moviedetails/index.html?movieID=${movie.id}`;
  };

  card.innerHTML = `
    <img src="${posterSrc}" alt="${title}" loading="lazy" />
    <div class="card-info">
      <h3>${title}</h3>
      <div class="rating"><i class="fa-solid fa-star"></i> ${vote}</div>
    </div>
  `;

  return card;
}

function populateActorDetails(actor, credits) {
  const photoEl = document.getElementById("actor-photo-img");
  const nameEl = document.getElementById("actor-name");
  const birthdayEl = document.getElementById("actor-birthday");
  const departmentEl = document.getElementById("actor-department");
  const bioEl = document.getElementById("actor-bio");
  const moviesGrid = document.getElementById("actor-movies");
  const placeEl = document.getElementById("actor-place");
  const genderEl = document.getElementById("actor-gender");
  const popularityEl = document.getElementById("actor-popularity");
  const alsoKnownEl = document.getElementById("actor-also-known");

  if (!actor) {
    showError("Sorry, we couldn't find the actor you're looking for.");
    return;
  }

  if (photoEl) photoEl.src = buildImageUrl(actor.profile_path);
  if (nameEl) nameEl.textContent = safeText(actor.name);
  if (birthdayEl) birthdayEl.textContent = actor.birthday ? `Born: ${actor.birthday}` : "Born: -";
  if (departmentEl) departmentEl.textContent = actor.known_for_department ? actor.known_for_department : "";
  if (bioEl) bioEl.textContent = safeText(actor.biography, "No biography available.");
  if (placeEl) placeEl.textContent = safeText(actor.place_of_birth, "-");
  if (genderEl) genderEl.textContent = actor.gender === 1 ? "Female" : actor.gender === 2 ? "Male" : "-";
  if (popularityEl) popularityEl.textContent = typeof actor.popularity === "number" ? actor.popularity.toFixed(1) : "-";
  if (alsoKnownEl) {
    const aliases = Array.isArray(actor.also_known_as) ? actor.also_known_as.filter(Boolean) : [];
    alsoKnownEl.textContent = aliases.length ? aliases.slice(0, 5).join(", ") : "-";
  }

  if (moviesGrid) {
    moviesGrid.innerHTML = "";
    const cast = Array.isArray(credits && credits.cast) ? credits.cast.slice() : [];
    cast.sort((a, b) => {
      const popDiff = (b.popularity || 0) - (a.popularity || 0);
      if (popDiff !== 0) return popDiff;
      const da = a.release_date || a.first_air_date || "";
      const db = b.release_date || b.first_air_date || "";
      return db.localeCompare(da);
    });
    const uniqueById = new Map();
    for (const item of cast) {
      if (!uniqueById.has(item.id)) uniqueById.set(item.id, item);
    }
    const top = Array.from(uniqueById.values()).slice(0, 24);
    top.forEach((m) => moviesGrid.appendChild(createMovieCard(m)));
  }
}

async function getActorDetailsById(personId) {
  const [details, credits] = await Promise.all([
    fetchJson(`${base_url}/person/${personId}?api_key=${api_key}&language=en-US`),
    fetchJson(`${base_url}/person/${personId}/movie_credits?api_key=${api_key}&language=en-US`)
  ]);
  return { details, credits };
}

async function searchActor(nameOrId) {
  try {
    setLoading(true);

    let personId = null;
    if (/^\d+$/.test(String(nameOrId))) {
      personId = String(nameOrId);
    } else {
      const search = await fetchJson(
        `${base_url}/search/person?api_key=${api_key}&query=${encodeURIComponent(String(nameOrId))}&include_adult=false&language=en-US&page=1`
      );
      const first = Array.isArray(search.results) ? search.results[0] : null;
      if (!first) {
        showError("No actor matched your search.");
        return;
      }
      personId = String(first.id);
    }

    const { details, credits } = await getActorDetailsById(personId);
    populateActorDetails(details, credits);
    setLoading(false);
  } catch (err) {
    console.error("Failed to load actor details", err);
    showError("We hit a problem loading this actor. Please try again later.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (actorIDFromQuery) {
    searchActor(actorIDFromQuery);
  }
});

window.searchActor = searchActor;


