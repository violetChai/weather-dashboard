const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("result");

const weatherIcons = {
    0: "☀️", 1: "🌤", 2: "⛅", 3: "☁️", 45: "🌫", 48: "🌫",
    51: "🌦", 53: "🌦", 55: "🌧", 56: "🌧", 57: "🌧",
    61: "🌦", 63: "🌧", 65: "🌧", 66: "🌧", 67: "🌧",
    71: "🌨", 73: "🌨", 75: "❄️", 77: "❄️",
    80: "🌦", 81: "🌧", 82: "🌧",
    85: "🌨", 86: "❄️",
    95: "⛈", 96: "⛈", 99: "⛈"
};

const weatherDescriptions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Drizzle: Light", 53: "Drizzle: Moderate", 55: "Drizzle: Dense",
    56: "Freezing Drizzle: Light", 57: "Freezing Drizzle: Dense",
    61: "Rain: Slight", 63: "Rain: Moderate", 65: "Rain: Heavy",
    66: "Freezing Rain: Light", 67: "Freezing Rain: Heavy",
    71: "Snow fall: Slight", 73: "Snow fall: Moderate", 75: "Snow fall: Heavy",
    77: "Snow grains", 80: "Rain showers: Slight", 81: "Rain showers: Moderate",
    82: "Rain showers: Violent", 85: "Snow showers: Slight", 86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight or moderate", 96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) {
        result.innerHTML = "Please enter a city.";
        return;
    }

    try {
        // Geocoding
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
        );
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.innerHTML = "City not found.";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherResponse.json();

        if (!weatherData.current_weather) {
            result.innerHTML = "Weather data not available.";
            return;
        }

        const { temperature, windspeed, weathercode } = weatherData.current_weather;
        const icon = weatherIcons[weathercode] || "❓";
        const description = weatherDescriptions[weathercode] || "Unknown";

        // Display
        result.innerHTML = `
            <div class="weather-card">
                <h2>${name}, ${country}</h2>
                <p class="temp">${temperature}°C</p>
                <p class="condition">${description} ${icon}</p>
                <p>Wind: ${windspeed} km/h</p>
                <iframe
                    width="100%"
                    height="200"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.05},${latitude-0.05},${longitude+0.05},${latitude+0.05}&layer=mapnik&marker=${latitude},${longitude}">
                </iframe>
            </div>
        `;
    } catch (error) {
        console.error(error);
        result.innerHTML = "An error occurred. Please try again.";
    }
});
