const express = require('express');
const redis = require('redis');

const app = express();
const REDIS_URL = process.env.REDIS_URL || 'redis://message-broker:6379';
const subscriber = redis.createClient({ url: REDIS_URL });
let triggeredAlerts = [];

app.get('/api/alerts', (req, res) => {
  res.json(triggeredAlerts.slice(-10).reverse());
});

async function startEngine() {
  await subscriber.connect();
  console.log("Analyzer Engine listening to Redis logs...");

  await subscriber.subscribe('raw-security-logs', (message) => {
    const log = JSON.parse(message);
    if (log.severity === 'CRITICAL') {
      triggeredAlerts.push({
        id: Math.floor(Math.random() * 90000) + 10000,
        ...log
      });
    }
  });

  app.listen(4000, () => console.log("Analyzer API online on port 4000"));
}

startEngine().catch(console.error);
