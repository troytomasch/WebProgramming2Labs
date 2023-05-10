const express = require("express");
const app = express();
const configRoutes = require("./routes");
const port = 3001;
var cors = require("cors");

app.use(cors());

app.use(express.json());

configRoutes(app);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
