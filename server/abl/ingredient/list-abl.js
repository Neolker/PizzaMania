const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"));

async function ListAbl(req, res) {
  try {
    const ingredients = await dao.listIngredients();
    res.json(ingredients);
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ListAbl;
