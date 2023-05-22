const path = require("path");
const Ajv = require("ajv").default;
const GradeDao = require("../../dao/grade-dao");
let dao = new GradeDao(
  path.join(__dirname, "..", "..", "storage", "grades.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    dateTs: { type: "string" },
    grade: { type: "number" },
    weight: { type: "number" },
    description: { type: "string" },
  },
  required: ["id"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let grade = req.body;
    const valid = ajv.validate(schema, grade);
    if (valid) {
      grade = await dao.updateGrade(grade);
      res.json(grade);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: grade,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("grade with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
