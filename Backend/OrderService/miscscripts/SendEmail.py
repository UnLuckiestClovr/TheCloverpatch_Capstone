import pika, json

def sendEmail(subject, message, email):
    conn = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=9000))
    channel = conn.channel()

    channel.queue_declare(queue='email_queue')

    # ExampleEmailObject

    emailObject = {
        'ESubject': subject,
        'EMessage': message,
        'toEmail': email
    }

    channel.basic_publish(exchange='', routing_key='email_queue', body=json.dumps(emailObject))
    print('Sent Email to Queue!')

    conn.close()