const axios = require("axios");
const redis = require("redis");
const baseUrl = "https://pokeapi.co/api/v2/pokemon/";
const client = redis.createClient();
client.connect();

client.on("error", function (err) {
  console.log("Error " + err);
});

const constructorMethod = (app) => {
  app.use("/pokemon/page/:pagenum", async (req, res) => {
    let pageNum = req.params.pagenum;
    let page = undefined;
    if (!pageNum) throw "Must enter valid page number";
    const cachedPage = await client.get(`pageNum${pageNum}`);
    if (cachedPage) {
      res.status(200).json(JSON.parse(cachedPage));
      return;
    }
    let url = baseUrl + "?offset=" + pageNum * 20;

    try {
      page = await axios.get(url);
    } catch (e) {
      res.status(404).json({ error: "Could not get page" });
      return;
    }

    if (page.data.results.length != 0) {
      client.set(`pageNum${pageNum}`, JSON.stringify(page.data));
      res.status(200).json(page.data);
    } else {
      res.status(404).json({ error: "Could not get page" });
    }
    return;
  });

  app.use("/pokemon/:id", async (req, res) => {
    let id = req.params.id;
    let pokemon = null;
    if (!id) throw "Must enter valid id";
    const cachedMon = await client.get(`id${id}`);
    if (cachedMon) {
      res.status(200).json(JSON.parse(cachedMon));
      return;
    }
    let url = baseUrl + id;

    try {
      pokemon = await axios.get(url);
    } catch (e) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }
    if (pokemon.data) {
      client.set(`id${id}`, JSON.stringify(pokemon.data));
      res.status(200).json(pokemon.data);
    } else {
      res.status(404).json({ error: "Could not get pokemon" });
    }
    return;
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
