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
        name: { type: "string", minLength: 5 },
        description: { type: "string" },
        procedure: { type: "string", minLength: 15 },
        ingredients: [
            {
                type: "object",
                id: "string",
                amount: "number"
            }
        ],
    },
    required: ["name", "procedure", "ingredients"],
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