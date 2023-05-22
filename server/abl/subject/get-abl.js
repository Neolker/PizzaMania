const path = require("path");
const Ajv = require("ajv").default;
const SubjectDao = require("../../dao/subject-dao");
let dao = new SubjectDao(
  path.join(__dirname, "..", "..", "storage", "subjects.json")
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
      const subjectId = body.id;
      const subject = await dao.getSubject(subjectId);
      if (!subject) {
        res
          .status(400)
          .send({ error: `Subject with id '${subjectId}' doesn't exist.` });
      }
      res.json(subject);
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
