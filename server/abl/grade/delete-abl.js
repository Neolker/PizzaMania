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
  },
  required: ["id"],
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const gradeId = req.body.id;
      await dao.deleteGrade(gradeId);
      res.json({});
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = DeleteAbl;
