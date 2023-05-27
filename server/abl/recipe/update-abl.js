const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
  path.join(__dirname, "..", "..", "storage", "recipes.json")
);

const IngredientDao = require("../../dao/ingredient-dao");
let ingredientDao = new IngredientDao(
  path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    imgUri: { type: "string" },
    ingredients: {
      type: "array",
      minItems: 0,
      items: [
        {
          type: "object",
          properties: {
            id: { type: "string" },
            amount: { type: "number" },
            unit: { type: "string" },
          },
          required: ["id", "amount", "unit"],
        }
      ]
    }
  },
  required: ["id"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let recipe = req.body;
    const valid = ajv.validate(schema, recipe);
    if (valid) {
      for(let ingredient of recipe.ingredients) {
        const exists = await ingredientDao.getIngredient(ingredient.id);

        if (!exists) {
          res.status(400).send({
            errorMessage: "ingredient with id " + ingredient.id + " does not exist",
            params: req.body,
          });
          return; 
        }
      }

      recipe = await dao.updateRecipe(recipe);
      res.json(recipe);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: recipe,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("recipe with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
