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
  },
  required: ["id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;

    const valid = ajv.validate(schema, body);
    if (valid) {
      const classroomId = body.id;
      const classroom = await dao.getClassroom(classroomId);
      if (!classroom) {
        res
          .status(400)
          .send({ error: `classroom with id '${classroomId}' doesn't exist` });
      }
      res.json(classroom);
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
