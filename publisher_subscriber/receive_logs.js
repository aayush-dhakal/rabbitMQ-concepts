const amqplib = require("amqplib");

const exchangeName = "logs";

const recieveMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true }); // empty string means creating a new queue on its own and not assigning to any specific queue and exclusive:true means deleting the queue after its work is finished ie the queue service is terminated or stopped
  console.log(`Waiting for messages in queue: ${q.queue}`); // q.queue gives the dynamically generated queue
  channel.bindQueue(q.queue, exchangeName, ""); // empty string is routing key, since fanout doesn't care about it we leave it empty. Here, the random queue is connected to the exchange that we defined
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) console.log("THe message is: ", msg.content.toString()); // all queues might not have the message so we have to check for it so that customer is not left hanging to receive the message
    },
    { noAck: true }
  );
};

recieveMsg();
