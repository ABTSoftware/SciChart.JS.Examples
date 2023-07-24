import * as express from "express";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";

app.use(express.static("build"));

app.listen(port, () => {
    console.log(`Example app listening at http://${host}:${port}`);
});
