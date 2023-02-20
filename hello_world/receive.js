const amqplib = require("amqplib");

const queueName = "hello";

// this is no connection close inside so this function will actively always listen to consume queue
const receiveMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost"); // put the url if the rabbitmq is in cloud
  const channel = await connection.createChannel(); // basically creating a pipeline for queue
  await channel.assertQueue(queueName, { durable: false }); // assertQueue is used for safety check like if the consumer first tries to comsume the message without the sender first sending it
  console.log(`waiting for messages in queue ${queueName}`);

  channel.consume(
    queueName,
    (msg) => {
      console.log("[X] Received", msg.content.toString());
    },
    { noAck: true } // this acknowledgement will remove item from queue
  );
};

receiveMsg();
