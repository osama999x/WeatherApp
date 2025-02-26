import { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";

function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [location, setLocation] = useState({ lat: 20, lon: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const GEO_DB_API_KEY = import.meta.env.VITE_GEO_DB_API_KEY;

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
        <div className="container-fluid weather-app">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="weather-container p-4 shadow-lg rounded-4 bg-gradient">
                        <div className="search-container text-center mb-4">
                            <h2 className="weather-title display-4 fw-bold mb-3">🌦️ Weather App</h2>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault(); // Prevents page reload
                                    fetchWeather();
                                }}
                            >
                                <div className="input-group mb-3">
                                    <input
                                        list="city-options"
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Enter city name"
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            fetchCitySuggestions(e.target.value);
                                        }}
                                    />
                                    <button className="btn btn-primary btn-lg" type="submit">
                                        Get Weather
                                    </button>
                                </div>
                            </form>

                            <datalist id="city-options">
                                {suggestions.map((suggestion, index) => (
                                    <option key={index} value={suggestion.name} />
                                ))}
                            </datalist>
                        </div>

                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Fetching Weather...</p>
                            </div>
                        ) : weather && (
                            <div className="weather-display fade-in">
                                <div className="row">
                                    <div className="col-12 text-center mb-4">
                                        <h3 className="display-5 fw-bold">📍 {weather.location.name}, {weather.location.country}</h3>
                                        <p className="text-muted">🕒 {weather.location.localtime}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="weather-info p-3 rounded-3 bg-light">
                                            <div className="weather-main text-center">
                                                <img src={weather.current.condition.icon} alt="weather-icon" className="mb-3" />
                                                <p className="h4">☀ {weather.current.condition.text}</p>
                                            </div>

                                            <div className="weather-details mt-3">
                                                <p className="h5">🌡 Temperature: <strong>{weather.current.temp_c}°C</strong></p>
                                                <p className="h5">💦 Humidity: <strong>{weather.current.humidity}%</strong></p>
                                                <p className="h5">🌫 Visibility: <strong>{weather.current.vis_km} km</strong></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="map-container rounded-3 overflow-hidden">
                                            <MapContainer
                                                center={[location.lat, location.lon]}
                                                zoom={10}
                                                scrollWheelZoom={true}
                                                className="map"
                                                style={{ height: "300px", width: "100%" }} // Set height
                                                key={`${location.lat}-${location.lon}`} // Unique key
                                            >
                                                <ChangeView center={[location.lat, location.lon]} zoom={10} />
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Weather;
