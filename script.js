// API key for accessing the Visual Crossing Weather API
const apiKey = 'MSZFX378W9LM39D466F5WW32R';

// Asynchronous function to fetch weather data for a given city
async function getWeatherData(city, apiKey) {
  // Get references to HTML elements for displaying loading status, weather data, and errors
  const loadingIndicator = document.getElementById('loading');
  const weatherDataDisplay = document.getElementById('weatherData');
  const errorDisplay = document.getElementById('error');

  // Base URL for the weather API
  const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  // Construct the full URL with the city name and API key
  const url = `${baseUrl}${city}?unitGroup=us&key=${apiKey}&contentType=json`;

  // Show the loading indicator and hide weather data initially
  loadingIndicator.style.display = 'block';
  weatherDataDisplay.style.display = 'none';
  errorDisplay.textContent = ''; // Clear any previous error messages

  try {
    // Fetch weather data from the API
    const response = await fetch(url);

    // Check if the response is not OK (status code not in the range 200-299)
    if (!response.ok) {
      let message = 'Failed to fetch weather data'; // Default error message

      // Customize error message based on the response status code
      if (response.status === 400) {
        message = 'Bad request. Please check the city name.';
      } else if (response.status === 401) {
        message = 'Unauthorized. Invalid API key.';
      } else if (response.status === 404) {
        message = 'City not found.';
      } else if (response.status >= 500) {
        message = 'Server error while fetching weather data.';
      }

      // Display the error message and hide the loading indicator
      errorDisplay.textContent = message;
      loadingIndicator.style.display = 'none';
      weatherDataDisplay.style.display = 'none';
      return; // Exit the function early due to error
    }

    // Parse the JSON data from the response
    const data = await response.json();

    // Get references to HTML elements for displaying weather details
    const cityName = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const condition = document.getElementById('condition');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const weatherIcon = document.getElementById('weatherIcon');

    // Update the HTML elements with the fetched weather data
    cityName.textContent = data.resolvedAddress;
    temperature.textContent = `Temperature: ${data.currentConditions.temp}°F`;
    condition.textContent = `Condition: ${data.currentConditions.conditions}`;
    humidity.textContent = `Humidity: ${data.currentConditions.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.currentConditions.windspeed} mph`;

    // Set the weather icon image source and alt text based on the current conditions
    weatherIcon.src = 'img/—Pngtree—cartoon rain icon download_4441280.png';
    weatherIcon.alt = data.currentConditions.conditions;

    // Hide the loading indicator and show the weather data
    loadingIndicator.style.display = 'none';
    weatherDataDisplay.style.display = 'block';
    return data; // Return the fetched data
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error('Error fetching weather data:', error);

    // Display a generic error message to the user
    errorDisplay.textContent = 'Failed to fetch weather data.';
    loadingIndicator.style.display = 'none';
    weatherDataDisplay.style.display = 'none';
  }
}

// Add an event listener to the "Get Weather" button
document.getElementById('getWeather').addEventListener('click', () => {
  // Get the city name entered by the user
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value;

  // Check if the city name is not empty
  if (city) {
    // Call the function to fetch weather data for the entered city
    getWeatherData(city, apiKey);
  } else {
    // Display an error message if no city name is entered
    const errorDisplay = document.getElementById('error');
    errorDisplay.textContent = 'Please enter a city name.';
  }
});