# Weather Analytics Dashboard

A responsive web-based application designed to display current weather data, provide forecasts, and offer interactive visualizations for multiple cities. This project helps users understand both short-term and long-term weather patterns at a glance.

## Features

This dashboard fulfills the requirements of a modern weather analytics application:

*   **Dashboard View:** The main screen displays summary cards for multiple favorite cities.
    *   Each card shows current temperature, a relevant weather condition icon, humidity, and wind speed.
    *   Supports real-time updates for current weather data.
*   **Detailed View (Modal):** Clicking a city card opens a modal with in-depth analytics.
    *   Includes a 5-7 day weather forecast summary.
    *   Provides hour-by-hour forecast data for closer inspection.
    *   Displays detailed current stats such as pressure, humidity, visibility, cloudiness, and an approximation of dew point.
*   **Search & Favorites:**
    *   A search bar allows users to look up cities using API-based autocomplete.
    *   Ability to "favorite" a city, pinning it to the main dashboard for quick access.
    *   Favorite cities and the selected temperature unit (`Celsius`/`Fahrenheit`) persist between browser sessions using local storage.
*   **Data Visualization:** Interactive charts built with Ant Design Charts to visualize weather patterns.
    *   **Temperature Trends:** Hourly and daily temperature trends.
    *   **Precipitation Patterns:** Hourly precipitation (rain/snow) if available.
    *   **Wind Speed/Direction:** Hourly wind speed trends.
    *   Charts include tooltips for detailed data on hover.
*   **Settings:** A simple toggle switch to switch between Celsius (°C) and Fahrenheit (°F) units for all temperature displays.
*   **Real-time Data Fetching:** Utilizes the OpenWeatherMap API to fetch live and forecast weather data.

## Technical Stack

The application is built with a robust and modern frontend stack:

*   **React (with Hooks):** For building dynamic and interactive user interfaces.
*   **Redux / Redux Toolkit:** For centralized, predictable, and scalable state management across the application.
*   **Ant Design:** A professional-grade UI library for React, providing a rich set of high-quality components.
*   **Ant Design Charts:** A powerful and flexible charting library integrated with Ant Design for data visualization.
*   **Ant Design Icons:** A collection of high-quality icons for visual elements.
*   **Axios:** A promise-based HTTP client for making API requests.
*   **Lodash Debounce:** Used to optimize the search input, preventing excessive API calls while typing.
*   **Moment.js:** A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:

*   **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/) (which includes npm).
*   **npm** (Node Package Manager) or **Yarn**: npm comes with Node.js, or you can install Yarn globally (`npm install -g yarn`).

### API Key Setup (Crucial!)

This application relies on the OpenWeatherMap API to fetch weather data. You **must** obtain your own API key and configure it in the project.

1.  **Get your API Key:**
    *   Go to [OpenWeatherMap](https://openweathermap.org/) and sign up for a free account.
    *   Once logged in, navigate to the "My API keys" section.
    *   Generate a new API key or copy an existing one.
    *   **Important:** New API keys can take some time (up to a few hours) to become active. If you face `401 Unauthorized` errors, wait a bit and try again.

2.  **Configure the Key in the Project:**
    *   Open the file `src/utils/constants.js` in your project.
    *   Replace `'YOUR_OPENWEATHERMAP_API_KEY'` with your actual API key:

        ```javascript
        export const API_KEY = 'your_actual_openweathermap_api_key_here';
        ```
    *   Save the file.

### Installation

1.  **Clone the repository (or download the code):**

    ```bash
    git clone https://github.com/your-username/weather-dashboard.git
    cd weather-dashboard
    ```

2.  **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```

### Running the Application

After installation and API key setup, you can start the development server:

Using npm:
```bash
npm start
```

This will open the application in your default web browser at http://localhost:3000.

### Usage
* **Search for Cities**: Use the search bar at the top to type a city name. A list of matching cities will appear below the search bar.
* **Add to Favorites**: Click the "Add" button next to a city in the search results to add it to your dashboard.
* **View Dashboard**: Favorite cities will appear as cards on the main screen, showing current weather conditions.
* **Detailed Forecast**: Click on any city card to open a modal displaying a 5-7 day forecast, hourly trends, and detailed weather statistics.
* **Toggle Units**: Use the Celsius/Fahrenheit switch in the header to change the temperature unit displayed across the application.
* **Remove Favorites**: Click the "X" icon on a city card to remove it from your favorites.
* **Persistence**: Your favorite cities and preferred unit are saved in your browser's local storage and will be remembered on your next visit.

### Project Structure
The project is organized into logical directories for maintainability and scalability:
src/
├── App.js                  # Main application component
├── index.js                # Entry point for the React application
├── store/                  # Redux state management
│   ├── index.js            # Redux store configuration
│   └── weatherSlice.js     # Redux slice for weather data, actions, and reducers
├── components/             # Reusable UI components
│   ├── CityCard.js         # Displays summary weather for a single city
│   ├── SearchBar.js        # Handles city search and adding to favorites
│   ├── UnitToggle.js       # Component for switching between Celsius/Fahrenheit
│   └── WeatherCharts.js    # Displays detailed weather charts (temperature, precipitation, wind)
├── pages/                  # Top-level application screens
│   └── Dashboard.js        # The main dashboard view
├── utils/                  # Utility functions and constants
   ├── constants.js        # Contains API key, base URLs, refresh intervals
   ├── localStorage.js     # Helpers for interacting with browser local storage
   └── weatherUtils.js     # Helper functions for weather data formatting and icons

### API Integration Details
The application primarily uses the OpenWeatherMap API for fetching weather data.
* **Asynchronous Data Fetching**: Redux Toolkit's createAsyncThunk is used to handle asynchronous API calls for current weather, forecast data, and city search.
* **Endpoints Used**:
   * data/2.5/weather: For current weather conditions.
   * data/2.5/forecast: For 5-day / 3-hour forecasts.
   * data/2.5/find: For searching cities by name with autocomplete suggestions.
* **API Key Handling**: The API key is stored in src/utils/constants.js and included in all API requests.
* **Rate Limiting**: While the free OpenWeatherMap plan has rate limits, the lodash.debounce utility on the search bar helps mitigate rapid requests.

### State Management (Redux Toolkit)
* **Centralized State**: All core application data, including favorite cities, current weather data, forecasts, search results, and unit preferences, is managed centrally using Redux.
* **Redux Toolkit createSlice**: Simplifies Redux development by combining reducers, action types, and action creators into a single file (weatherSlice.js).
* **createAsyncThunk**: Handles the lifecycle of asynchronous API requests (pending, fulfilled, rejected states) and updates the Redux store accordingly.
* **Persistence**: src/utils/localStorage.js handles saving and loading specific parts of the Redux state (favorite cities, unit preference) to and from the browser's local storage, ensuring data persists across sessions.
## Data Caching
* To reduce redundant API calls and improve performance, a simple caching mechanism is implemented for current weather and forecast data:
* When fetchCurrentWeather or fetchForecast is called, the application first checks if valid data for that city exists in the Redux store's cache.
* Data is considered valid if it was fetched within a CACHE_DURATION (e.g., 5 minutes, configurable in src/utils/constants.js).
* If cached data is fresh, it's returned immediately; otherwise, a new API call is made.
