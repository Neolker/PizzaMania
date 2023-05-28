const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
const RecipeDao = require("../../dao/recipe-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"));

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const ingredientId = req.body.id;
      await dao.deleteIngredient(ingredientId);
      res.json({});
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = DeleteAbl;
