# 🎬 Movie Night

A modern, responsive movie discovery web application built with vanilla JavaScript, HTML, and CSS. Browse trending movies, search for your favorites, and explore detailed movie information with a beautiful, Netflix-inspired interface.

<p align="center">
  <img src="favicon.svg" alt="Movie Night" width="180" height="180" />
</p>

## ✨ Features

### 🏠 **Home Page**
- **Trending Movies**: Large hero cards with backdrop images and movie details
- **Movie Categories**: Top Rated, Popular, Upcoming, and Now Playing sections
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects and transitions throughout

### 🔍 **Search Functionality**
- **Real-time Search**: Search through thousands of movies
- **Pagination**: Navigate through search results with page controls
- **Instant Results**: Fast API responses with loading states

### 📱 **Movie Details Page**
- **Comprehensive Information**: Cast, crew, ratings, genres, and overview
- **High-Quality Images**: Backdrop and poster images in HD
- **Similar Movies**: Discover related content
- **Interactive Elements**: Action buttons and smooth scrolling

### 🎨 **Design Features**
- **Dark Theme**: Modern black and red color scheme
- **Glass Morphism**: Backdrop blur effects and transparency
- **Typography**: Bebas Neue headers and Roboto Slab body text
- **Loading States**: Smooth spinners and progress indicators
- **Custom Favicon**: Film reel icon matching the brand

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start exploring movies!

### File Structure
```
Movie Night/
├── index.html              # Main homepage
├── main.js                 # Homepage functionality
├── styles.css              # Main stylesheet
├── favicon.svg             # Custom film reel favicon
├── movies/
│   ├── index.html          # Movies listing page
│   ├── main.js             # Movies page functionality
│   └── styles.css          # Movies page styles
├── search/
│   ├── index.html          # Search results page
│   ├── search.js           # Search functionality
│   └── styles.css          # Search page styles
└── moviedetails/
    ├── index.html          # Movie details page
    ├── main.js             # Movie details functionality
    └── styles.css          # Movie details styles
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Async/await, fetch API, DOM manipulation
- **jQuery**: DOM manipulation and event handling
- **Font Awesome**: Icons throughout the interface
- **Google Fonts**: Bebas Neue and Roboto Slab typography
- **TMDB API**: The Movie Database for movie data

## 🎯 Key Features Breakdown

### **API Integration**
- Fetches data from The Movie Database (TMDB) API
- Handles multiple endpoints: trending, top-rated, popular, upcoming, now-playing
- Search functionality with query parameters
- Detailed movie information with cast and crew

### **Responsive Design**
- **Desktop**: Full layout with side-by-side content
- **Tablet**: Adjusted spacing and sizing
- **Mobile**: Stacked layout with touch-friendly controls
- **Breakpoints**: 1024px, 768px, and 480px

### **Performance Optimizations**
- Lazy loading for images
- Efficient API calls with error handling
- Smooth animations with CSS transitions
- Optimized loading states

### **User Experience**
- Intuitive navigation between pages
- Loading spinners during data fetching
- Error handling with user-friendly messages
- Smooth scrolling and transitions

## 🎨 Design System

### **Color Palette**
- **Primary Background**: `#000000` (Black)
- **Accent Color**: `#e50914` (Netflix Red)
- **Secondary Text**: `#b3b3b3` (Light Gray)
- **Primary Text**: `#ffffff` (White)

### **Typography**
- **Headers**: Bebas Neue (Cinematic, bold)
- **Body Text**: Roboto Slab (Readable, modern)

### **Components**
- **Movie Cards**: Hover effects with overlay information
- **Search Bar**: Glass morphism with gradient button
- **Loading Spinners**: Branded red accent color
- **Navigation**: Fixed header with smooth transitions

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔧 Customization

### **API Key**
To use your own TMDB API key:
1. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Replace the `api_key` variable in all JavaScript files

### **Styling**
- Modify CSS variables in `:root` for easy color changes
- Adjust breakpoints in media queries for different screen sizes
- Customize animations and transitions in the CSS files

## 🚀 Future Enhancements

- [ ] User authentication and favorites
- [ ] Movie trailers and video integration
- [ ] Advanced filtering and sorting options
- [ ] Dark/light theme toggle
- [ ] Progressive Web App (PWA) features
- [ ] Offline functionality
- [ ] Social sharing features


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

---

**Made with ❤️ for movie lovers everywhere** 🍿

*Enjoy your Movie Night!* 🎬
