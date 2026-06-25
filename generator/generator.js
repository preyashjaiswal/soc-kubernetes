const redis = require('redis');
const REDIS_URL = process.env.REDIS_URL || 'redis://message-broker:6379';
const client = redis.createClient({ url: REDIS_URL });

const logTemplates = [
  { event: "User login successful", severity: "INFO", source: "AuthService" },
  { event: "File downloaded", severity: "INFO", source: "FileServer" },
  { event: "SSH Brute Force Attempt", severity: "CRITICAL", source: "Firewall" },
  { event: "Database query executed", severity: "INFO", source: "Database" },
  { event: "Malware Signature Detected", severity: "CRITICAL", source: "EndpointAV" }
];

async function run() {
  await client.connect();
  console.log(`Generator publishing streams to: ${REDIS_URL}`);

  setInterval(async () => {
    const rawLog = {
      ...logTemplates[Math.floor(Math.random() * logTemplates.length)],
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: `192.168.1.${Math.floor(Math.random() * 254)}`
    };
    
    await client.publish('raw-security-logs', JSON.stringify(rawLog));
    console.log(`[LOG EMITTED]: ${rawLog.event}`);
  }, 1500);
}

run().catch(console.error);
