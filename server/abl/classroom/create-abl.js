const path = require("path");
const Ajv = require("ajv").default;
const ClassroomDao = require("../../dao/classroom-dao");
let dao = new ClassroomDao(
  path.join(__dirname, "..", "..", "storage", "classrooms.json")
);

let schema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let classroom = req.body;
      classroom = await dao.createClassroom(classroom);
      res.json(classroom);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

module.exports = CreateAbl;
