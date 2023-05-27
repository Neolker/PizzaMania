const path = require("path");
const Ajv = require("ajv").default;
const GradeDao = require("../../dao/grade-dao");
let dao = new GradeDao(
  path.join(__dirname, "..", "..", "storage", "grades.json")
);
const StudentDao = require("../../dao/student-dao");
let studentDao = new StudentDao(
  path.join(__dirname, "..", "..", "storage", "students.json")
);
const SubjectDao = require("../../dao/subject-dao");
let subjectDao = new SubjectDao(
  path.join(__dirname, "..", "..", "storage", "subjects.json")
);

let schema = {
  type: "object",
  properties: {
    subjectId: { type: "string", minLength: 1 },
    studentId: { type: "string", minLength: 1 },
    dateTs: { type: "string", minLength: 1 },
    grade: { type: "number" },
    weight: { type: "number" },
    description: { type: "string" },
  },
  required: ["subjectId", "studentId", "dateTs", "grade"],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let grade = req.body;
    const valid = ajv.validate(schema, grade);
    if (valid) {
      let student = await studentDao.getStudent(grade.studentId);
      if (!student) {
        res.status(400).send({
          errorMessage: `student with id ${grade.studentId} does not exist`,
          params: req.body,
        });
        return;
      }
      console.log(student);
      if (!student.classroomId) {
        res.status(400).send({
          errorMessage: `student is not in any classroom`,
          params: req.body,
        });
        return;
      }
      grade.classroomId = student.classroomId;
      let subject = await subjectDao.getSubject(grade.subjectId);
      if (!subject) {
        res.status(400).send({
          errorMessage: `subject with id ${grade.subjectId} does not exist`,
          params: req.body,
        });
        return;
      }
      if (!grade.weight) grade.weight = 1;
      grade = await dao.createGrade(grade);
      res.json(grade);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.includes("with id")) {
      res.status(400).send({ errorMessage: e, params: req.body });
    } else {
      res.status(500).send(e);
    }
  }
}

module.exports = CreateAbl;
