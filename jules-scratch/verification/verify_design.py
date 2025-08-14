import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the index.html file
        html_file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        page.goto(f'file://{html_file_path}')

        # Wait for the default weather for San Francisco to load
        city_name_element = page.locator("#city-name")
        expect(city_name_element).to_contain_text("San Francisco", timeout=10000)

        # Take a screenshot of the initial state
        page.screenshot(path="jules-scratch/verification/sf_weather.png")

        # Test the search functionality
        search_input = page.locator("#search-input")
        search_input.fill("London")
        search_input.press("Enter")

        # Wait for the weather to update to London
        expect(city_name_element).to_contain_text("London", timeout=10000)

        # Take a screenshot of the updated state
        page.screenshot(path="jules-scratch/verification/london_weather.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
