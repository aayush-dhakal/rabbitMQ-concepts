const amqplib = require("amqplib");

const queueName = "hello";
const msg = "hello world";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost"); // put the url if the rabbitmq is in cloud
  const channel = await connection.createChannel(); // basically creating a pipeline for queue
  await channel.assertQueue(queueName, { durable: false }); // assertQueue creates a queue with the name as queueName and if the queue with that name already exists then it will be ignored. durable set to false will the create the queue on restart ie the queue will be deleted when the broker restarts
  channel.sendToQueue(queueName, Buffer.from(msg)); // routing id will be queueName which will be sent to direct exchange
  console.log("sent:", msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();
