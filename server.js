const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static("public"));

// GET all activities
app.get("/api/activities", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send({ error: "Error reading file" });
    res.send(JSON.parse(data));
  });
});

// POST new activity
app.post("/api/activities", (req, res) => {
  const { institute, water } = req.body;

  if (!institute || typeof water !== "number") {
    return res.status(400).send({ error: "Invalid input" });
  }

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send({ error: "Error reading file" });

    const json = JSON.parse(data);
    json.activities.push({ institute, water });

    fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), (err) => {
      if (err) return res.status(500).send({ error: "Error writing file" });
      res.send({ success: true });
    });
  });
});

// DELETE activity
app.delete("/api/activities/:index", (req, res) => {
  const index = parseInt(req.params.index);

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send({ error: "Error reading file" });

    const json = JSON.parse(data);
    if (index < 0 || index >= json.activities.length) {
      return res.status(400).send({ error: "Invalid index" });
    }

    json.activities.splice(index, 1);

    fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), (err) => {
      if (err) return res.status(500).send({ error: "Error writing file" });
      res.send({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
