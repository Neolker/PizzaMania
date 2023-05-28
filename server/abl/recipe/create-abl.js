const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));

/*
const IngredientDao = require("../../dao/ingredient-dao");
let ingredientDao = new IngredientDao(
  path.join(__dirname, "..", "..", "storage", "ingredients.json")
);
*/

let schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    procedure: { type: "string" },
  },
  required: ["name", "description", "procedure"],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let recipe = req.body;
      recipeCreated = await dao.createRecipe(recipe);
      res.json(recipeCreated);
    } else {
      res.status(500).send({"error":"Validation of input failed: name, description and procedure are required, minimal lenght: 2 characters in every variable."});
    }
  } catch (e) {
    res.status(500).send({"error":e.message});
  }
}

module.exports = CreateAbl;
