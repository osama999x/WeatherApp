import { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [location, setLocation] = useState({ lat: 20, lon: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const GEO_DB_API_KEY = import.meta.env.VITE_GEO_DB_API_KEY;

    // Fetch City Suggestions
    const fetchCitySuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(
                `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`,
                {
                    headers: {
                        "x-rapidapi-key": GEO_DB_API_KEY,
                        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
                    },
                }
            );
            setSuggestions(response.data.data.map((city) => ({
                name: city.name,
                lat: city.latitude,
                lon: city.longitude,
            })));
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
        }
    };

    const fetchWeather = async () => {
        if (!city) {
            toast.error("Please Enter a Correct City Name!");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
            );
            console.log("Response Data: ", response.data);
            setWeather(response.data);

            if (response.data.location) {
                setLocation({
                    lat: response.data.location.lat,
                    lon: response.data.location.lon,
                });
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            toast.error("City not found! Try again.");
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    };

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

    ChangeView.propTypes = {
        center: PropTypes.arrayOf(PropTypes.number).isRequired,
        zoom: PropTypes.number.isRequired,
    };

    return (
        <div className="container-fluid">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="row">
                <div className="col-12">
                    <div className="weather-container">
                        <div className="search-container">
                            <h2 className="weather-title">🌦️ Weather App</h2>

                            <input
                                list="city-options"
                                type="text"
                                placeholder="Enter city name"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    fetchCitySuggestions(e.target.value);
                                }}
                            />
                            <datalist id="city-options">
                                {suggestions.map((suggestion, index) => (
                                    <option key={index} value={suggestion.name} />
                                ))}
                            </datalist>

                            <button type="submit" onClick={fetchWeather}>
                                Get Weather
                            </button>
                        </div>

                        <div className="row">
                            <div className={`weather-display ${weather ? "fade-in" : ""}`}>
                                {isLoading ? (
                                    <div className="custom-loader">
                                        <p>Fetching Weather...</p>
                                    </div>
                                ) : weather && (
                                    <div className="row">
                                        <div className="col-12">
                                            <h3>📍 {weather.location.name}, {weather.location.country}</h3>
                                            <p>🕒 {weather.location.localtime}</p>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="weatherInfo">
                                                <div className="weather-main">
                                                    <img src={weather.current.condition.icon} alt="weather-icon" />
                                                    <p>☀ {weather.current.condition.text}</p>
                                                </div>

                                                <div className="weather-details">
                                                    <p>🌡 Temperature: <strong>{weather.current.temp_c}°C</strong></p>
                                                    <p>💦 Humidity: <strong>{weather.current.humidity}%</strong></p>
                                                    <p>🌫 Visibility: <strong>{weather.current.vis_km} km</strong></p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="map-container">
                                                <MapContainer
                                                    center={[location.lat, location.lon]}
                                                    zoom={10}
                                                    scrollWheelZoom={true}
                                                    className="map"
                                                    key={`${location.lat}-${location.lon}`}
                                                >
                                                    <ChangeView center={[location.lat, location.lon]} zoom={10} />
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; OpenStreetMap contributors'
                                                    />
                                                    <Marker position={[location.lat, location.lon]}>
                                                        <Popup>
                                                            {weather.location.name}, {weather.location.country}
                                                        </Popup>
                                                    </Marker>
                                                </MapContainer>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Weather;
