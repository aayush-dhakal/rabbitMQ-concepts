const amqplib = require("amqplib");

const queueName = "task";

const consumeTask = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  channel.prefetch(1); // Prefetching in RabbitMQ simply allows you to set a limit of the number of unacked (not handled) messages. prefetch simply controls how many messsages the broker allows to be outstanding at the consumer at a time. When set to 1, this means the broker will send 1 message, wait for the ack, then send the next. This tells queue to only assign new task from the queue list when the item is finished and acknowledgment is sent to remove the item. This will be helpful to faily distribute the tasks of different time length.

  console.log(`Waiting for messages in queue: ${queueName}`);
  channel.consume(
    queueName,
    (msg) => {
      const secs = msg.content.toString().split(".").length - 1; // stores the number of dots where each dot amounts to 1 second
      console.log("[X] Received:", msg.content.toString());
      setTimeout(() => {
        console.log("Done resizing image");
        channel.ack(msg); // acknowledge(basically remove the item from queue) only after completing the task so that if the machine gets faulty the item will not be lost
      }, secs * 1000);
    },
    { noAck: false } // this when set to true first removes the item from queue without completing the task and during the processing of task if there is fault in machine then the item will be lost from the queue
  );
};

consumeTask();
