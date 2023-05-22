const path = require("path");
const Ajv = require("ajv").default;
const StudentDao = require("../../dao/student-dao");
let dao = new StudentDao(
  path.join(__dirname, "..", "..", "storage", "students.json")
);
const ClassroomDao = require("../../dao/classroom-dao");
let classroomDao = new ClassroomDao(
  path.join(__dirname, "..", "..", "storage", "classrooms.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstname: { type: "string" },
    surname: { type: "string" },
    classroomId: { type: "string" },
  },
  required: ["id"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let student = req.body;
    const valid = ajv.validate(schema, student);
    if (valid) {
      if (student.classroomId) {
        let classroom = await classroomDao.getClassroom(student.classroomId);
        if (!classroom) {
          res.status(400).send({
            errorMessage: `classroom with given id ${student.classroomId} does not exist`,
            params: req.body,
            reason: ajv.errors,
          });
          return;
        }
      }
      student = await dao.updateStudent(student);
      res.json(student);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: student,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("Student with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
