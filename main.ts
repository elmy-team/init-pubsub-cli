#! /usr/bin/env node
import { readFile, access, constants } from 'fs/promises';

import { PubSub, Topic } from '@google-cloud/pubsub';
import dotenv from 'dotenv';

async function createOrGetSubscription(topic: Topic, subscriptionName: string) {
  const subscription = topic.subscription(subscriptionName);
  const [subscriptionExists] = await subscription.exists();

  if (!subscriptionExists) {
    await subscription.create();
    console.log(`Subscription ${subscription.name} created`);
  } else {
    console.log(`Subscription ${subscription.name} exists`);
  }
  return subscription;
}

async function createTopicsAndSubscriptions(pubsub: PubSub, mappings: Record<string, string[]>) {
  // Iterate over topics
  for (const [topicName, subscriptionNames] of Object.entries(mappings)) {
    const topic = pubsub.topic(topicName);
    const [topicExists] = await topic.exists();

    // If not, create topic
    if (!topicExists) {
      await topic.create();
      console.log(`Topic ${topic.name} created`);
    } else {
      console.log(`Topic ${topic.name} exists`);
    }

    if (!Array.isArray(subscriptionNames)) continue;

    // Iterate over subscriptions
    for (const subscriptionName of [...subscriptionNames]) {
      await createOrGetSubscription(topic, subscriptionName);
    }
  }
}

async function possiblyReadFromDotEnv(dotenvPath: string) {
  await access(dotenvPath, constants.F_OK)
    .then(() => {
      const config = dotenv.config({ path: dotenvPath });
      if (config.error) {
        throw config.error;
      }
    })
    .catch(() => {
      console.log(`Warning: no ${dotenvPath} found. Continuing ...`);
    });
}

async function main() {
  await possiblyReadFromDotEnv('./.env');

  // Check if PUBSUB_EMULATOR_HOST environment variable is set
  if (!process.env.PUBSUB_EMULATOR_HOST) {
    console.error('PUBSUB_EMULATOR_HOST environment variable is not set');
    process.exit(1);
  }
  // Check if PUBSUB_PROJECT_ID environment variable is set
  if (!process.env.PUBSUB_PROJECT_ID) {
    console.error('PUBSUB_PROJECT_ID environment variable is not set');
    process.exit(1);
  }
  const { PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST } = process.env;
  console.dir({ PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST });
  // Read JSON configuration file
  const data = await readFile('./config.json', 'utf8');
  const mappings = JSON.parse(data);

  const pubsubClient = new PubSub({ projectId: process.env.PUBSUB_PROJECT_ID });
  createTopicsAndSubscriptions(pubsubClient, mappings);
}

main().catch(({ message }) => {
  console.error(message);
  process.exitCode = 1;
});
