const path = require("path");
const Ajv = require("ajv").default;
const StudentDao = require("../../dao/student-dao");
let dao = new StudentDao(
  path.join(__dirname, "..", "..", "storage", "students.json")
);

let schema = {
  type: "object",
  properties: {},
  required: [],
};

async function ListAbl(req, res) {
  try {
    const students = await dao.listStudents();
    res.json(students);
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = ListAbl;
