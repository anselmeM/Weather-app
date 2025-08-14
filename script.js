// API key for accessing the Visual Crossing Weather API
const apiKey = 'MSZFX378W9LM39D466F5WW32R';

// DOM element references
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const weatherImage = document.getElementById('weather-image');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const hourlyForecastContainer = document.getElementById('hourly-forecast');

// Map weather conditions to background images
const weatherImages = {
    'partly-cloudy-day': 'https://images.unsplash.com/photo-1599209248411-5124adbb1da2?q=80&w=2070&auto=format&fit=crop',
    'partly-cloudy-night': 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?q=80&w=2070&auto=format&fit=crop',
    'clear-day': 'https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4?q=80&w=2070&auto=format&fit=crop',
    'clear-night': 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=1964&auto=format&fit=crop',
    'cloudy': 'https://images.unsplash.com/photo-1499956827185-0d63ee78a910?q=80&w=1974&auto=format&fit=crop',
    'rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e682?q=80&w=1974&auto=format&fit=crop',
    'snow': 'https://images.unsplash.com/photo-1517299321609-52485ae3c2be?q=80&w=2070&auto=format&fit=crop',
    'thunder-rain': 'https://images.unsplash.com/photo-1605727226462-581448b45c22?q=80&w=1935&auto=format&fit=crop',
    'fog': 'https://images.unsplash.com/photo-1487621167335-56c636a65e36?q=80&w=2070&auto=format&fit=crop',
    'wind': 'https://images.unsplash.com/photo-1561574221-a31a5f596545?q=80&w=2070&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop',
};

// Fetches weather data from the API
async function fetchWeatherData(city, apiKey) {
  const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  // Using metric units as the new design seems to use them (C, km/h)
  const url = `${baseUrl}${city}?unitGroup=metric&key=${apiKey}&contentType=json`;
  const response = await fetch(url);
  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`;
    if (response.status === 400) {
        const text = await response.text();
        if (text.includes("Provide an API Key")) {
            message = "Invalid API Key. Please check the key in script.js.";
        } else {
            message = "Bad request. Please enter a valid city name.";
        }
    }
    throw new Error(message);
  }
  return await response.json();
}

// Updates the UI with hourly forecast data
function updateHourlyForecastUI(hours) {
    hourlyForecastContainer.innerHTML = '';
    const now = new Date();
    const currentHour = now.getHours();

    // Find the starting hour and get the next 8 hours
    const upcomingHours = hours.filter(hour => {
        const hourTime = parseInt(hour.datetime.split(':')[0], 10);
        return hourTime >= currentHour;
    }).slice(0, 8);

    upcomingHours.forEach(hour => {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40';

        const time = new Date(0, 0, 0, parseInt(hour.datetime.split(':')[0], 10)).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const temp = `${Math.round(hour.temp)}°C`;
        const iconName = hour.icon;
        const imageUrl = weatherImages[iconName] || weatherImages['default'];

        hourDiv.innerHTML = `
            <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col" style="background-image: url('${imageUrl}');"></div>
            <div>
                <p class="text-[#111418] text-base font-medium leading-normal">${time}</p>
                <p class="text-[#637488] text-sm font-normal leading-normal">${temp}</p>
            </div>
        `;
        hourlyForecastContainer.appendChild(hourDiv);
    });
}

// Updates the main weather UI
function updateWeatherUI(data) {
  // City and date
  cityName.textContent = data.resolvedAddress;
  const now = new Date();
  dateTime.textContent = now.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true });

  // Main weather display
  const currentConditions = data.currentConditions;
  temperature.textContent = `${Math.round(currentConditions.temp)}°C`;
  feelsLike.textContent = `Feels like ${Math.round(currentConditions.feelslike)}°C`;

  // Background image
  const iconName = currentConditions.icon;
  weatherImage.style.backgroundImage = `url('${weatherImages[iconName] || weatherImages['default']}')`;

  // Details
  humidity.textContent = `${currentConditions.humidity}%`;
  windSpeed.textContent = `${currentConditions.windspeed} km/h`;
  pressure.textContent = `${currentConditions.pressure} hPa`;
  visibility.textContent = `${currentConditions.visibility} km`;

  // Hourly forecast
  updateHourlyForecastUI(data.days[0].hours);
}

// Main function to get weather
async function getWeather(city) {
  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  try {
    const data = await fetchWeatherData(city, apiKey);
    updateWeatherUI(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert(error.message);
  }
}

// Event listener for search form submission
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = searchInput.value.trim();
  getWeather(city);
});

// Load default weather on page load
getWeather('San Francisco');