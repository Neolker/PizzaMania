const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));

let schema = {
  type: "object",
  properties: {
    id_recipe: { type: "string" },
    id_ingredient: { type: "string" },
    amount: { type: "number" },
  },
  required: ["id_recipe", "id_ingredient", "amount"],
};

async function AddIngredientIntoRecipeAbl(req, res) {
  try {
    const ajv = new Ajv();
    let ingredient = req.body;
    const valid = ajv.validate(schema, ingredient);
    if (valid) {
      recipe = await dao.addIngredientIntoRecipe(ingredient);
      res.json(recipe);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id_recipe, id_ingredient and amount are required. Minimal amount is 1." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = AddIngredientIntoRecipeAbl;
