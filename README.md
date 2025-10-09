# Movie Night 🎬

Welcome to Movie Night - your ultimate companion for discovering and tracking movies and TV shows! This modern mobile application is built with React Native and Expo, offering a seamless experience for movie enthusiasts.

## Features

- 🏠 **Home Feed**: Browse trending movies and TV shows
- 🔍 **Search**: Find your favorite movies and TV shows easily
- 📱 **Movie Details**: View comprehensive information about movies, including:
  - Cast information
  - Trailers
  - Related content
- 📺 **TV Show Details**: Detailed information about TV series
- 🔖 **Bookmarks**: Save your favorite content for later
- 👨‍👩‍👦 **Actor Profiles**: Explore detailed information about cast members

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Project Structure

```
app/
├── _layout.tsx          # Main layout component
├── index.tsx           # Entry point
├── actordata/         # Actor details
├── api/               # API and database handlers
├── main/             # Main app screens
│   ├── Home/         # Home screen
│   ├── Explore/      # Explore section
│   ├── search/       # Search functionality
│   └── bookmark/     # Bookmarks feature
├── moviedetails/     # Movie detail screens
└── tvdetails/        # TV show detail screens
```

## Tech Stack

- [React Native](https://reactnative.dev/) - Mobile application framework
- [Expo](https://expo.dev/) - Development platform
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Expo Router](https://docs.expo.dev/router/introduction/) - Navigation
- [SQLite](https://www.sqlite.org/index.html) - Local database storage
- [React Native YouTube](https://www.npmjs.com/package/react-native-youtube-iframe) - Video playback

## Dependencies

Key dependencies include:
- `@expo/vector-icons` - Icon library
- `expo-sqlite` - Local database management
- `react-native-youtube-iframe` - YouTube video integration
- `react-native-webview` - Web content display
- `expo-linear-gradient` - Gradient effects

## Version

Current version: 1.0.0

## License

This project is private and proprietary.
