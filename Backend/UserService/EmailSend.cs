using System;
using System.Text;
using Newtonsoft.Json;
using RabbitMQ.Client;  

public class EmailSender()
{
    public void SendEmail(string subject, string message, string email)
    {
        var factory = new ConnectionFactory() { HostName = "localhost" };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        // Declare the Queue
        channel.QueueDeclare(
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
        channel.BasicPublish(
            exchange: "",
            routingKey: "email_queue",
            basicProperties: null,
            body: body
        );

        Console.WriteLine($"Email Sent: '{subject}' | {email}");
    }
}