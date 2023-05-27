const path = require("path")
const Ajv = require("ajv").default
const GradeDao = require("../../dao/grade-dao")
let dao = new GradeDao(
  path.join(__dirname, "..", "..", "storage", "grades.json")
)

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let schema = {
  type: "object",
  properties: {
    subjectId: { type: "string", minLength: 1 },
    studentId: { type: "string", minLength: 1 },
  },
  required: [],
}

async function ListAbl(req, res) {
  try {
    const ajv = new Ajv()
    let grades = await dao.listGrades()
    let body
    if (req.query.subjectId || req.query.subjectId) body = req.query
    else if (req.body.subjectId || req.body.subjectId) body = req.body
    else body = {}
    const valid = ajv.validate(schema, body)
    if (valid) {
      if (body.subjectId || body.studentId) {
        grades = grades.filter((grade) => {
          return (
            body.subjectId === grade.subjectId &&
            body.studentId === grade.studentId
          )
        })
      }
      await sleep(2000)
      return res.json(grades)
    } else {
      return res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      })
    }
  } catch (e) {
    return res.status(500).send(e)
  }
}

module.exports = ListAbl
