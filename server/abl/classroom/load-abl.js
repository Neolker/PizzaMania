const path = require("path");
const Ajv = require("ajv").default;
const ClassroomDao = require("../../dao/classroom-dao");
let classroomDao = new ClassroomDao(
  path.join(__dirname, "..", "..", "storage", "classrooms.json")
);
const StudentDao = require("../../dao/student-dao");
let studentDao = new StudentDao(
  path.join(__dirname, "..", "..", "storage", "students.json")
);
const GradeDao = require("../../dao/grade-dao");
let gradeDao = new GradeDao(
  path.join(__dirname, "..", "..", "storage", "grades.json")
);
const SubjectDao = require("../../dao/subject-dao");
let subjectDao = new SubjectDao(
  path.join(__dirname, "..", "..", "storage", "subjects.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function LoadAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;

    const valid = ajv.validate(schema, body);
    if (valid) {
      // get classroom
      const classroomId = body.id;
      const classroom = await classroomDao.getClassroom(classroomId);
      if (!classroom) {
        res
          .status(400)
          .send({ error: `classroom with id '${classroomId}' doesn't exist` });
      }

      // get classroom students
      const studentList = await studentDao.listStudents();
      const classroomStudentList = studentList.filter(
        (student) => student.classroomId === classroomId
      );

      // get student grades
      const gradeList = await gradeDao.listGrades();

      // get subjects
      const subjectList = await subjectDao.listSubjects();

      // calculate average grades of each student
      classroomStudentList.forEach((student) => {
        student.subjectList = [];
        subjectList.forEach((subject) => {
          let averageGrade = null;
          let studentSubjectGradeList = gradeList.filter(
            (grade) =>
              grade.studentId === student.id && grade.subjectId === subject.id
          );
          let gradeSum = 0;
          let weightSum = 0;
          studentSubjectGradeList.forEach((grade) => {
            gradeSum += grade.grade * grade.weight;
            weightSum += grade.weight;
          });
          if (gradeSum) averageGrade = gradeSum / weightSum;
          console.log(averageGrade);
          student.subjectList.push({ ...subject, averageGrade });
        });
      });

      res.json({ ...classroom, studentList: classroomStudentList });
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

module.exports = LoadAbl;
