# Weather App

This is a simple weather application built using React, Axios, and Leaflet. The app allows users to search for a city and get real-time weather information along with a map showing the location.

## Features

-   Search for cities with autocomplete suggestions.
-   Fetch real-time weather data.
-   Display weather details including temperature, humidity, visibility, and weather conditions.
-   Show the city location on an interactive map using Leaflet.
-   User-friendly UI with Bootstrap and React Toast notifications.

## Technologies Used

-   React
-   Axios
-   Leaflet (for maps)
-   React-Leaflet
-   Bootstrap
-   React-Toastify
-   Vite (for development and build)

## Prerequisites

Make sure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (version 16 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/weather-app.git
    cd weather-app
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

## Environment Variables

Create a `.env` file in the root directory and add your API keys:

```sh
REACT_APP_WEATHER_API_KEY=your_weather_api_key
REACT_APP_GEO_DB_API_KEY=your_geo_db_api_key
```

## Running the Project

To start the development server, run:

```sh
npm run dev
```

OR

```sh
yarn dev
```

This will start the project on `http://localhost:5173/` by default.

## Build the Project

To create a production build, run:

```sh
npm run build
```

OR

```sh
yarn build
```

## Preview the Build

To preview the production build locally, run:

```sh
npm run preview
```

OR

```sh
yarn preview
```

## Lint the Code

To check for linting issues, run:

```sh
npm run lint
```

OR

```sh
yarn lint
```

## Dependencies

The project uses the following dependencies:

```json
{
    "dependencies": {
        "axios": "^1.7.9",
        "bootstrap": "^5.3.3",
        "leaflet": "^1.9.4",
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
        "react-leaflet": "^5.0.0",
        "react-toastify": "^11.0.5"
    },
    "devDependencies": {
        "@eslint/js": "^9.19.0",
        "@types/react": "^19.0.8",
        "@types/react-dom": "^19.0.3",
        "@vitejs/plugin-react-swc": "^3.5.0",
        "eslint": "^9.19.0",
        "eslint-plugin-react": "^7.37.4",
        "eslint-plugin-react-hooks": "^5.0.0",
        "eslint-plugin-react-refresh": "^0.4.18",
        "globals": "^15.14.0",
        "vite": "^6.1.0"
    }
}
```

## License

This project is licensed under the MIT License.

For more information
-------------------
Please reach at osamakhan99@hotmail.com
