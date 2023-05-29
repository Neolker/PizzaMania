const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));

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
      const recipeId = body.id;
      const recipe = await dao.getRecipe(recipeId);
      if (!recipe) {
        res.status(400).send({ "error": "Recipe with id " + recipeId + " does not exist." });
      }
      // simulate delay in production build
      setTimeout(function() {
        res.json(recipe);
      },1000);

    } else {
      res.status(400).send({ "error": "Validation of the input failed: id is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = GetAbl;
