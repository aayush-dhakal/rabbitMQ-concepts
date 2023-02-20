const amqplib = require("amqplib");

const exchangeName = "header_logs";

const recieveMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "headers", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, exchangeName, "", {
    account: "new",
    method: "facebook",
    "x-match": "any", // if there is a match in either account to new or method to facebook then this queue will receive the message
  });

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content)
        console.log(
          `Routing Key: ${JSON.stringify(
            msg.properties.headers
          )}, Message: ${msg.content.toString()}`
        );
    },
    { noAck: true }
  );
};

recieveMsg();
