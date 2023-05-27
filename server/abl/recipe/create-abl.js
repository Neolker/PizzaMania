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
  required: ["name", "description", "ingredients"],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let recipe = req.body;

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

      recipe = await dao.createRecipe(recipe);
      res.json(recipe);
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
