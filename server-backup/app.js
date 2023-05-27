//načtení modulu express
const express = require("express");
const cors = require("cors");

const studentRouter = require("./controller/student-controller");
const classroomRouter = require("./controller/classroom-controller");
const subjectRouter = require("./controller/subject-controller");
const gradeRouter = require("./controller/grade-controller");

//inicializace nového Express.js serveru
const app = express();
//definování portu, na kterém má aplikace běžet na localhostu
const port = process.env.PORT || 8000;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

// Enable Cross Origin Resource Sharing
app.use(cors())

//jednoduchá definice routy s HTTP metodou GET, která pouze navrací text
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/recipe", studentRouter);
app.use("/ingredients", classroomRouter);

app.get("/*", (req, res) => {
  res.send("Unknown path!");
});

//nastavení portu, na kterém má běžet HTTP server-backup
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
