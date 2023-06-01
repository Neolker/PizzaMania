const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    procedure: { type: "string" },
  },
  required: ["id", "name", "description", "procedure"],
};

async function SuperUpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let recipe = req.body;
    const valid = ajv.validate(schema, recipe);
    if (valid) {
      let recipeUpdated = await dao.superUpdateRecipe(recipe);
      res.json(recipeUpdated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id, name, description and procedure are required, minimal lenght: 2 characters in all variables." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = SuperUpdateAbl;
