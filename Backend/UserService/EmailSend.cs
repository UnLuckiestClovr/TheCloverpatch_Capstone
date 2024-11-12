using System;
using System.Text;
using Newtonsoft.Json;
using RabbitMQ.Client;  

public class EmailSender
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public EmailSender()
    {
        var factory = new ConnectionFactory()
        {
            HostName = "CloverpatchRabbitMQ",
            UserName = "CloverlyTheAdmin",
            Password = "1_L0v3_G04ts"
        };

        // Retry mechanism for connection
        for (int i = 0; i < 5; i++)
        {
            try
            {
                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();
                break; // Exit loop if successful
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to connect to RabbitMQ: {ex.Message}");
                System.Threading.Thread.Sleep(2000); // Wait before retrying
            }
        }

        _channel.QueueDeclare(
            queue: "email_queue",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );
    }

    public void SendEmail(string subject, string message, string email)
    {

        // Declare the Queue
        _channel.QueueDeclare(
            queue: "email_queue",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        // Create the Email Object
        var emailObject = new {
            ESubject = subject,
            EMessage = message,
            toEmail = email
        };

        // Serialize to JSON
        string emailJson = JsonConvert.SerializeObject(emailObject);
        var body = Encoding.UTF8.GetBytes(emailJson);

        // Publish data to Queue
        _channel.BasicPublish(
            exchange: "",
            routingKey: "email_queue",
            basicProperties: null,
            body: body
        );

        Console.WriteLine($"Email Sent: '{subject}' | {email}");
    }
}