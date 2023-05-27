const path = require("path");
const Ajv = require("ajv").default;
const SubjectDao = require("../../dao/subject-dao");
let dao = new SubjectDao(
  path.join(__dirname, "..", "..", "storage", "subjects.json")
);

let schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    shortName: { type: "string" },
    description: { type: "string" },
  },
  required: ["name", "shortName"],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let subject = req.body;
      subject = await dao.createSubject(subject);
      res.json(subject);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.includes("subject with shortName ")) {
      res.status(400).send({ errorMessage: e, params: req.body });
    } else {
      res.status(500).send(e);
    }
  }
}

module.exports = CreateAbl;
