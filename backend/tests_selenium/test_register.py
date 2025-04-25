from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import tempfile
import random

temp_user_data_dir = tempfile.mkdtemp()

options = Options()
options.binary_location = "/usr/bin/chromium-browser"
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--remote-debugging-port=9222")
options.add_argument(f"--user-data-dir={temp_user_data_dir}")


service = Service("./chromedriver")
driver = webdriver.Chrome(service=service, options=options)

try:
    driver.get("http://localhost:3000/register")
    print("Title is:", driver.title)

    random_number = random.randint(1000, 9999)
    username = f"testuser{random_number}"
    email = f"{username}@test.com"

    print(f"Url1: {driver.current_url}")
    #WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "First Name")))

    driver.find_element(By.XPATH, '//input[@placeholder="First Name"]').send_keys("Test")
    driver.find_element(By.XPATH, '//input[@placeholder="Last Name"]').send_keys("User")
    driver.find_element(By.XPATH, '//input[@placeholder="Email"]').send_keys(email)
    dob_input = driver.find_element(By.XPATH, '//input[@type="date"]')
    driver.execute_script("arguments[0].value = '01-01-2000';", dob_input)
    #driver.find_element(By.XPATH, '//input[@placeholder="Date of Birth"]').send_keys("01/01/2000")
    driver.find_element(By.XPATH, '//input[@placeholder="Username"]').send_keys(username)
    driver.find_element(By.XPATH, '//input[@placeholder="Password"]').send_keys("TestPass123!")
    driver.find_element(By.XPATH, '//input[@placeholder="Confirm Password"]').send_keys("TestPass123!")

    print(f"Url2: {driver.current_url}")

    #register_button = WebDriverWait(driver, 10).until(
    #EC.element_to_be_clickable((By.XPATH, '//button[text()="Register"]'))
    #)
    #register_button.click()

    register_button = driver.find_element(By.XPATH, '//button[text()="Register"]')
    driver.execute_script("arguments[0].click();", register_button)

    print(f"Url3: {driver.current_url}")

    if "/login" in driver.current_url:
        print(f"Registration successful!\nUsername: {username}\nEmail: {email}")
    else:
        #print(f"Registration might have failed.\nUsername: {username}\nEmail: {email}")
        try:
            error_element = driver.find_element(By.CLASS_NAME, "error")
            print(f"Registration failed with error: {error_element.text}")
        except:
            print(f"Registration might have failed but no error message was found.\nUsername: {username}\nEmail: {email}")

except Exception as e:
    print("An error occurred during the test:", e)

finally:
    driver.quit()