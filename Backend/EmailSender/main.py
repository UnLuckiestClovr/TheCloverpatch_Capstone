import pika, json, smtplib, time, traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# Email configuration
SMTP_SERVER = 'smtp.ethereal.email'  # Replace with your SMTP server
SMTP_PORT = 587                     # Common SMTP ports: 587 or 465
SMTP_USERNAME = 'euna.greenfelder82@ethereal.email'     # Your email username
SMTP_PASSWORD = 'VbybS132B36DGBnMkY'     # Your email password


def sendEmail(subject, message, toEmail):
    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = toEmail
    msg['Subject'] = subject

    # Attach Message Body
    msg.attach(MIMEText(message, 'plain'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, toEmail, msg.as_string())

            print(f'Email sent to {toEmail}')
    except Exception as e:
        print(f'Faield to send Email to {toEmail}: {str(e)}')


#Callback Function to Process Messages from Queue
def callback(ch, method, properties, body):
    print('Recieved Message')
    email_data = json.loads(body)

    print(email_data, type(email_data))

    subject = email_data["ESubject"]
    message = email_data["EMessage"]
    toEmail = email_data["toEmail"]

    sendEmail(subject, message, toEmail)

    ch.basic_ack(delivery_tag=method.delivery_tag)  # Acknowledge the Message


# Connect to RabbitMQ and Consume Messages
def main():
    while(True):
        try:
            # Attempt to connect to RabbitMQ
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                host='CloverpatchRabbitMQ',
                credentials=pika.PlainCredentials("CloverlyTheAdmin", "1_L0v3_G04ts")
            ))
            channel = connection.channel()

            channel.queue_declare(queue='email_queue') # Declare the Queue
            channel.basic_consume(queue='email_queue', on_message_callback=callback)

            print('Waiting for Messages. To Exit press CTRL+C')
            channel.start_consuming()
            break
        except pika.exceptions.AMQPConnectionError as e:
            # Handle connection error and print the stack trace
            print(f"Connection failed: {e}")
            traceback.print_exc()  # Print the full stack trace
            print("Retrying in 2 seconds...")
            time.sleep(5)  # Wait for 5 seconds before retrying
        except Exception as e:
            # Handle any other exceptions and print the stack trace
            print(f"An error occurred: {e}")
            traceback.print_exc()  # Print the full stack trace
            print("Retrying in 2 seconds...")
            time.sleep(5)  # Wait for 5 seconds before retrying


if __name__ == '__main__':
    main()
