const amqp = require("amqplib");
const logger = require("./logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "facebook_events";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

async function connectToRabbitMQ(retries = 5, delay = 1000) {
  while (retries > 0) {
    try {
      connection = await amqp.connect(`${RABBITMQ_URL}?heartbeat=30`);
      logger.info("Connected to RabbitMQ");

      connection.on("error", (err) => {
        logger.error("RabbitMQ connection error", err);
      });

      connection.on("close", () => {
        logger.warn("RabbitMQ connection closed. Reconnecting...");
        connection = null;
        channel = null;
        setTimeout(() => connectToRabbitMQ(), 1000);
      });

      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });

      channel.on("error", (err) => {
        logger.error("RabbitMQ channel error", err);
      });

      channel.on("close", () => {
        logger.warn("RabbitMQ channel closed");
        channel = null;
      });

      return channel;
    } catch (e) {
      logger.error(`RabbitMQ connection failed (${retries} left)`, e);
      retries--;
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // exponential backoff
    }
  }

  logger.error("RabbitMQ: Exhausted retry attempts.");
  return null;
}


async function getChannel() {
  if (!channel) {
    await connectToRabbitMQ();
  }
  return channel;
}

async function publishEvent(routingKey, message) {
  const ch = await getChannel();
  if (!ch) {
    logger.error("Cannot publish, channel is null");
    return;
  }

  ch.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`Event published: ${routingKey}`);
}

async function consumeEvent(routingKey, callback) {
  const ch = await getChannel();
  if (!ch) {
    logger.error("Cannot consume, channel is null");
    return;
  }

  const q = await ch.assertQueue("", { exclusive: true });
  await ch.bindQueue(q.queue, EXCHANGE_NAME, routingKey);

  ch.consume(q.queue, (msg) => {
    if (msg !== null) {
      try {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        ch.ack(msg);
      } catch (err) {
        logger.error("Failed to process message", err);
        ch.nack(msg, false, false); // discard on error
      }
    }
  });

  logger.info(`Subscribed to event: ${routingKey}`);
}

module.exports = {
  connectToRabbitMQ,
  publishEvent,
  consumeEvent,
};
