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

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const gradeId = body.id;
      const grade = await dao.getGrade(gradeId);
      if (!grade) {
        res
          .status(400)
          .send({ error: `Grade with id '${gradeId}' doesn't exist.` });
      }
      res.json(grade);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = GetAbl;
