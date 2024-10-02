import time

from py_eureka_client import eureka_client


def Eureka_Register(host, port):
    max_retries = 3
    retry_delay = 2  # Delay between retries in seconds
    attempt = 0

    while attempt < max_retries:
        time.sleep(3)  # Wait for 3 seconds before the next iteration
        try:
            eureka_client.init(
                eureka_server=f"http://{host}:{port}/eureka/",
                app_name="OrderAPI",
                instance_host="localhost", 
                instance_port=12000,
            )
            print("Eureka client initialized successfully.")
            break
        except Exception as e:
            print(f"Failed to initialize Eureka client: {e}")
            attempt += 1
            print(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)