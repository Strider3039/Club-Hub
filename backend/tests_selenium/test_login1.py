from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
import time
import tempfile

temp_user_data_dir = tempfile.mkdtemp()

options = Options()
options.binary_location = "/usr/bin/chromium-browser"
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--remote-debugging-port=9222")
options.add_argument(f"--user-data-dir={temp_user_data_dir}")


service = Service("./chromedriver")
driver = webdriver.Chrome(service=service, options=options)

try:
    driver.get("http://localhost:3000/login")
    print("Test login with credentials.")

    username = "testlogin"
    password = "pass"

    driver.find_element(By.XPATH, '//input[@placeholder="Username"]').send_keys(username)
    driver.find_element(By.XPATH, '//input[@placeholder="Password"]').send_keys(password)

    driver.find_element(By.XPATH, '//button[text()="Login"]').click()

    time.sleep(5)

    if "/home" in driver.current_url:
        print(f"Test passed. Login successful.")
    else:
        print("Test failed. Login failed.")

except Exception as e:
    print("An error occurred during the test:", e)

finally:
    driver.quit()