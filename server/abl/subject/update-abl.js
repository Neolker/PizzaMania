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
    firstname: { type: "string" },
    surname: { type: "string" },
  },
  required: ["id"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let subject = req.body;
    const valid = ajv.validate(schema, subject);
    if (valid) {
      subject = await dao.updateSubject(subject);
      res.json(subject);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: subject,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("subject with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
