const path = require("path");
const Ajv = require("ajv").default;
const ClassroomDao = require("../../dao/classroom-dao");
let dao = new ClassroomDao(
  path.join(__dirname, "..", "..", "storage", "classrooms.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
  required: ["id"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let classroom = req.body;
    const valid = ajv.validate(schema, classroom);
    if (valid) {
      classroom = await dao.updateClassroom(classroom);
      res.json(classroom);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: classroom,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("classroom with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
