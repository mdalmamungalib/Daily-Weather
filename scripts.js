const apiKey = "e820d9e4cb4d4df688c94804242508";
const weatherCard = document.getElementById("weather-card");
const forecastContainer = document.getElementById(
  "forecast-container"
);
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const sortDateButton = document.getElementById("sortDate");
const sortTempButton = document.getElementById("sortTemp");
const filterRainButton = document.getElementById("filterRain");
const resetFilterButton = document.getElementById("resetFilter");

let forecastData = [];
let filteredForecastData = [];

// update document title
const updateTitle = (city) => {
  document.title = `Weather in ${city}`;
};

// fetch data
const fetchWeather = async (city) => {
  if (!city) {
    alert("Please inter a city name.");
    return;
  }

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`
    );

    if (!res?.ok) {
      throw new Error("Error fetching weather data");
    }

    const data = await res?.json();
    updateWeatherCard(data);
    forecastData = data?.forecast?.forecastday;
    filteredForecastData = forecastData;
    updateForecastCards(filteredForecastData);

    updateTitle(city);
  } catch (error) {
    console.log(error);
    alert("Failed to fetch weather data. Please try again later");
  }
};

// update weather card
const updateWeatherCard = (data) => {
  const { location, current } = data;
  const { name, region, country, localtime } = location;
  const localeDateTime = new Date(localtime).toLocaleString();

  weatherCard.innerHTML = `
  <div class="weather-card">
    <h2>${name}</h2>
    <p>Region: ${region}</p>
    <p>Country: ${country}</p>
    <p>${current?.condition?.text}</p>
    <img src="https:${current?.condition?.icon}" alt="${current?.condition?.text}" width="64" hight="64" />
    <p>${current?.temp_c}°C</p>
    <p>${current?.humidity}%Humidity</p>
    <p>Local Time: ${localeDateTime}</p>
  </div>
  `;
};

// update forecast cards
const updateForecastCards = (data) => {
  forecastContainer.innerHTML = data
    ?.map(
      (day) => `
        <div class="forecast-card">
        <h3>${new Date(day?.date).toDateString()}</h3>
        <p>${day?.day?.condition?.text}</p>
        <img src="https:${day?.day?.condition?.icon}" alt="${
        day?.day?.condition?.text
      }" width="64" hight="64"/>
        <p>${day?.day?.avgtemp_c}°C</p>
        <p>${day?.day?.avghumidity}%Humidity</p>

        </div>
        `
    )
    .join("");
};

// sorting filtering
const handleSort = (criteria) => {
  const sortedData = [...filteredForecastData].sort((a, b) => {
    if (criteria === "data") {
      return new Date(a?.date) - new Date(b?.date);
    } else if (criteria === "temperature") {
      return a?.day?.avgtemp_c - b?.day?.avgtemp_c;
    }
    return 0;
  });
  updateForecastCards(sortedData);
};

const handleFilter = (condition) => {
  filteredForecastData = forecastData.filter((day) =>
    day?.day?.condition?.text
      .toLowerCase()
      .includes(condition.toLowerCase())
  );
  updateForecastCards(filteredForecastData);
};

const resetFilter = () => {
  filteredForecastData = forecastData;
  updateForecastCards(filteredForecastData);
};

searchButton.addEventListener("click", () => {
  fetchWeather(cityInput.value.trim());
});

sortDateButton.addEventListener("click", () => handleSort("data"));

sortTempButton.addEventListener("click", () =>
  handleSort("temperature")
);

filterRainButton.addEventListener("click", () =>
  handleFilter("Rain")
);

resetFilterButton.addEventListener("click", resetFilter);

fetchWeather("Bangladesh");

// Dynamic year footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("currentYear");
  const currentYear = new Date().getFullYear();
  if (yearSpan) {
    yearSpan.textContent = currentYear;
  }
});
