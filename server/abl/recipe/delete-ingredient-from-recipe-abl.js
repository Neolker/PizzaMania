const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));

let schema = {
  type: "object",
  properties: {
    id_recipe: { type: "string" },
    id_ingredient: { type: "string" },
  },
  required: ["id_recipe", "id_ingredient"],
};

async function DeleteIngredientFromRecipeAbl(req, res) {
  try {
    const ajv = new Ajv();
    let ingredient = req.body;
    const valid = ajv.validate(schema, ingredient);
    if (valid) {
      recipe = await dao.deleteIngredientFromRecipe(ingredient);
      res.json(recipe);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id_recipe and id_ingredient are required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = DeleteIngredientFromRecipeAbl;
