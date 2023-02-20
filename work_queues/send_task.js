const amqplib = require("amqplib");

const queueName = "task";
const msg = process.argv.slice(2).join(" ") || "Hello World!"; // use a single dot(.) for 1 second delay simulation and increase the dot for extra 1 second delay

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true }); // durable:true recreated the queue in restart
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true }); // persistent:true persists the queue message
  console.log("sent:", msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();
