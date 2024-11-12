import pika, json, smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# Email configuration
SMTP_SERVER = 'smtp.example.com'  # Replace with your SMTP server
SMTP_PORT = 587                     # Common SMTP ports: 587 or 465
SMTP_USERNAME = 'your_username'     # Your email username
SMTP_PASSWORD = 'your_password'     # Your email password


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
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='CloverpatchRabbitMQ', credentials=pika.PlainCredentials("CloverlyTheAdmin","1_L0v3_G04ts"), port=5672))
    channel = connection.channel()

    channel.queue_declare(queue='email_queue') # Declare the Queue
    channel.basic_consume(queue='email_queue', on_message_callback=callback)

    print('Waiting for Messages. To Exit press CTRL+C')
    channel.start_consuming()


if __name__ == '__main__':
    main()
