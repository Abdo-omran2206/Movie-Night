$(document).ready(function () {
  // Determine base path based on current location
  const path = window.location.pathname;
  let basePath = "";
  // Check if we are in a subdirectory (assuming 1 level deep for these sections)
  if (
    path.includes("/movies/") ||
    path.includes("/actor/") ||
    path.includes("/moviedetails/") ||
    path.includes("/search/")
  ) {
    basePath = "../";
  }

  // Define menu data
  // Note: hrefs are relative to the root. We will prepend basePath to them.
  const menuData = [
    { type: "link", text: "Home", href: "index.html", icon: "fas fa-home" },
    { type: "header", text: "Categories" },
    {
      type: "link",
      text: "Popular",
      href: "movies/index.html?category=popular",
      icon: "fas fa-fire",
    },
    {
      type: "link",
      text: "Top Rated",
      href: "movies/index.html?category=top_rated",
      icon: "fas fa-star",
    },
    {
      type: "link",
      text: "Upcoming",
      href: "movies/index.html?category=upcoming",
      icon: "fas fa-calendar-alt",
    },
    {
      type: "link",
      text: "Now Playing",
      href: "movies/index.html?category=now_playing",
      icon: "fas fa-play-circle",
    },
    { type: "header", text: "Genres" },
    { type: "genre", text: "Action", id: 28, icon: "fas fa-fist-raised" },
    { type: "genre", text: "Adventure", id: 12, icon: "fas fa-hiking" },
    { type: "genre", text: "Animation", id: 16, icon: "fas fa-smile" },
    { type: "genre", text: "Comedy", id: 35, icon: "fas fa-laugh-beam" },
    { type: "genre", text: "Crime", id: 80, icon: "fas fa-mask" },
    { type: "genre", text: "Documentary", id: 99, icon: "fas fa-file-alt" },
    { type: "genre", text: "Drama", id: 18, icon: "fas fa-theater-masks" },
    { type: "genre", text: "Family", id: 10751, icon: "fas fa-users" },
    { type: "genre", text: "Fantasy", id: 14, icon: "fas fa-dragon" },
    { type: "genre", text: "History", id: 36, icon: "fas fa-landmark" },
    { type: "genre", text: "Horror", id: 27, icon: "fas fa-ghost" },
    { type: "genre", text: "Music", id: 10402, icon: "fas fa-music" },
    { type: "genre", text: "Mystery", id: 9648, icon: "fas fa-user-secret" },
    { type: "genre", text: "Romance", id: 10749, icon: "fas fa-heart" },
    { type: "genre", text: "Science Fiction", id: 878, icon: "fas fa-rocket" },
    { type: "genre", text: "TV Movie", id: 10770, icon: "fas fa-tv" },
    { type: "genre", text: "Thriller", id: 53, icon: "fas fa-spider" },
    { type: "genre", text: "War", id: 10752, icon: "fas fa-fighter-jet" },
    { type: "genre", text: "Western", id: 37, icon: "fas fa-hat-cowboy" },
  ];

  // Construct the menu HTML
  let menuHtml = `
    <div id="side-menu-overlay" class="menu-overlay"></div>
    <div id="side-menu" class="side-menu">
      <div class="menu-header">
         <h2>Menu</h2>
         <button id="close-menu-btn" aria-label="Close menu">&times;</button>
      </div>
      <div class="menu-content">
        <ul>
  `;

  menuData.forEach((item) => {
    if (item.type === "link") {
      const iconHtml = item.icon
        ? `<i class="${item.icon}" style="width: 25px; margin-right: 10px; text-align: center;"></i>`
        : "";
      // Prepend basePath to href
      menuHtml += `<li><a href="${basePath}${item.href}">${iconHtml}${item.text}</a></li>`;
    } else if (item.type === "header") {
      menuHtml += `<li class="menu-section-header">${item.text}</li>`;
    } else if (item.type === "genre") {
      const iconHtml = item.icon
        ? `<i class="${item.icon}" style="width: 25px; margin-right: 10px; text-align: center;"></i>`
        : "";
      // Construct genre link with basePath
      // Original: movies/index.html?genre=...
      // Since 'movies/index.html' is relative to root, we prepend basePath.
      menuHtml += `<li><a href="${basePath}movies/index.html?genre=${
        item.id
      }&name=${encodeURIComponent(item.text)}">${iconHtml}${
        item.text
      }</a></li>`;
    }
  });

  menuHtml += `
        </ul>
      </div>
    </div>
  `;

  // Append to body
  $("body").append(menuHtml);

  // Event Listeners
  const $menu = $("#side-menu");
  const $overlay = $("#side-menu-overlay");

  function openMenu() {
    $menu.addClass("open");
    $overlay.addClass("active");
    $("body").css("overflow", "hidden"); // Prevent background scrolling
  }

  function closeMenu() {
    $menu.removeClass("open");
    $overlay.removeClass("active");
    $("body").css("overflow", "");
  }

  // Toggle button (fa-bars)
  // Note: targeting existing fa-bars. It might need a specific class or ID added in HTML if there are multiple.
  // Assuming the one in header is the main one.
  $(".fa-bars")
    .parent()
    .on("click", function (e) {
      e.stopPropagation(); // Prevent bubbling
      openMenu();
    });

  // Specific targeting if the above is too broad (user pointed to line 118)
  // $('header .fa-bars').on('click', openMenu);

  $("#close-menu-btn").on("click", closeMenu);
  $overlay.on("click", closeMenu);

  // Close when clicking a link
  $("#side-menu a").on("click", closeMenu);
});
