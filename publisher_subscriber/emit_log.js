const amqplib = require("amqplib");

const exchangeName = "logs";
const msg = process.argv.slice(2).join(" ") || "Subscribe, Like, & Comment";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  channel.publish(exchangeName, "", Buffer.from(msg)); // the empty '' option means we don't define a specific queue to send the message so here the message will be sent to all the queues in a broadcasting manner
  console.log("Sent: ", msg);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMsg();
