// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require("express");

const app = express();

app.use(express.static("dist"));

app.listen(3000, () => {
  console.log("Serving at http://localhost:3000");
});
