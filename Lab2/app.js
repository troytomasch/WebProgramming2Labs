let people = require("./data/get.js");
const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient();
client.connect();

client.on("error", function (err) {
  console.log("Error " + err);
});

app.use(express.json());

app.use("/api/people/history", async (req, res) => {
  let history = await client.lRange("history", 0, 19);
  let result = [];
  for (let i of history) {
    result.push(JSON.parse(i));
  }
  res.status(200).json(result);
});

app.use("/api/people/:id", async (req, res) => {
  let id = req.params.id;
  try {
    if (typeof id != "string") throw "Must enter an id";
    if (isNaN(Number(id))) throw "Must enter a number";
    if (Number(id) < 0) throw "Id must be a positive integer";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let person = await client.get(id);
    if (person == null) {
      person = await people.getById(Number(id));
      await client.set(id, JSON.stringify(person));
    } else {
      person = JSON.parse(person);
    }
    await client.lPush("history", JSON.stringify(person));
    res.status(200).json(person);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
});

app.use("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
