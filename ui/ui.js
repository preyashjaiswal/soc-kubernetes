const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/alerts', async (req, res) => {
  try {
    const response = await fetch('http://analyzer:4000/api/alerts');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Cannot communicate with Analyzer Service." });
  }
});

app.listen(3000, () => console.log("UI Web Server up on port 3000"));
