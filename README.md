# Weather App

A simple web application that displays the current weather conditions for a searched city using the Visual Crossing Weather API.

## Live Demo

You can view a live demo of the application here: [Weather App](https://anselmem.github.io/Weather-app/)

## Description

This project allows users to enter a city name and retrieve real-time weather information, including temperature, weather condition, humidity, and wind speed. It features a clean, responsive user interface that adapts to different screen sizes.

## Features

* **City Search:** Users can input a city name to get weather data.
* [cite_start] **Current Weather Display:** Shows temperature (in Fahrenheit), weather condition (e.g., sunny, cloudy), humidity percentage, and wind speed (in mph). [cite: 2]
* [cite_start] **Dynamic Weather Icons:** Displays an icon representing the current weather conditions (though currently, it's a static image, this can be enhanced). [cite: 2]
* [cite_start] **Loading State:** Indicates when data is being fetched. [cite: 2]
* [cite_start] **Error Handling:** Provides user-friendly messages for various errors, such as invalid city name, API key issues, or server errors. [cite: 2]
* **Responsive Design:** The layout adjusts for optimal viewing on desktop, tablet, and mobile devices.

## Technologies Used

* [cite_start] HTML [cite: 1]
* CSS
* [cite_start] JavaScript [cite: 2]
* [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api)

## Setup and Usage

1.  **Clone or download the repository.**
2.  **Obtain an API Key:**
    * You will need an API key from [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api).
    * Once you have your API key, open the `script.js` file.
    * Replace `'MSZFX378W9LM39D466F5WW32R'` with your actual API key in the following line:
        ```javascript
        const apiKey = 'YOUR_API_KEY_HERE'; [cite_start] // [cite: 2]
        ```
3.  **Open `index.html` in your web browser:**
    * [cite_start] Navigate to the project directory and open the `index.html` file in a web browser to use the application. [cite: 1]

## File Structure

Weather-app-main/
├── img/ # Folder for images
│   ├── 5094671_find_glass_search_zoom_icon.png
│   ├── weather-app.png
│   ├── —Pngtree—vector humidity icon_3981808.png
│   ├── 316296_wind_icon.png
│   └── —Pngtree—cartoon rain icon download_4441280.png
[cite_start] ├── index.html      # Main HTML structure 
[cite_start] ├── script.js       # JavaScript for API calls and DOM manipulation 
├── style.css       # CSS for styling the application
└── api_info.txt    # Information about the API used


## How It Works

[cite_start] The application takes a city name input by the user. [cite: 1] [cite_start] When the "Get Weather" button is clicked, a JavaScript function (`getWeatherData`) is triggered. [cite: 2] [cite_start] This function makes an asynchronous call to the Visual Crossing Weather API using the provided city name and API key. [cite: 2]

[cite_start] The API returns JSON data containing weather information for the specified city. [cite: 2] [cite_start] The JavaScript then parses this data and updates the relevant HTML elements to display the temperature, city name, weather condition, humidity, and wind speed. [cite: 2] [cite_start] It also handles potential errors during the API request and displays appropriate messages to the user. [cite: 2]

## Customization

* [cite_start] **Units:** The API request is currently set to `unitGroup=us` (for US/Fahrenheit units). [cite: 2] You can change this in the `url` construction within `script.js` to other unit groups supported by the Visual Crossing API (e.g., `metric`).
* **Styling:** All styling is handled in `style.css`. You can modify this file to change the appearance of the application.
* [cite_start] **Weather Icons:** The `weatherIcon.src` in `script.js` is currently hardcoded. [cite: 2] This could be dynamically updated based on the `data.currentConditions.icon` field from the API response for more accurate visual feedback.
