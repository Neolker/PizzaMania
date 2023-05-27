const path = require("path");
const Ajv = require("ajv").default;
const SubjectDao = require("../../dao/subject-dao");
let dao = new SubjectDao(
  path.join(__dirname, "..", "..", "storage", "subjects.json")
);

let schema = {
  type: "object",
  properties: {},
  required: [],
};

async function ListAbl(req, res) {
  try {
    const subjects = await dao.listSubjects();
    res.json(subjects);
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = ListAbl;
