
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const message = document.getElementById("message");
const weatherInfo = document.getElementById("weatherInfo");

// Convert weather codes into descriptions and icons
function getWeather(code) {

    const weatherTypes = {
        0: ["Clear Sky", "☀️"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy Drizzle", "🌧️"],
        61: ["Light Rain", "🌧️"],
        63: ["Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Light Snow", "❄️"],
        73: ["Snow", "❄️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Rain Showers", "🌧️"],
        82: ["Heavy Rain Showers", "🌧️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Thunderstorm with Hail", "⛈️"]
    };

    return weatherTypes[code] || ["Unknown", "🌡️"];
}

// Fetch weather data
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    try {

        message.textContent = "Loading weather...";
        searchBtn.disabled = true;

        // Step 1: Get city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather using coordinates
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Convert weather code
        const weather = getWeather(current.weather_code);

        // Step 4: Display weather information
        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        wind.textContent =
            `${current.wind_speed_10m} km/h`;

        condition.textContent = weather[0];

        weatherIcon.textContent = weather[1];

        message.textContent = "";

    }
    catch (error) {

        message.textContent = error.message;

    }
    finally {

        searchBtn.disabled = false;

    }
}

// Search button click
searchBtn.addEventListener("click", getWeather);

// Search using Enter key
cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});

// Load default city when website opens
cityInput.value = "Siliguri";
getWeather();
