const path = require("path");
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));

async function ListAbl(req, res) {
  try {
    const recipeList = await dao.listRecipes();
    res.json(recipeList);
  } catch (e) {
    res.status(400).send({ "error": e.message });
  }
}

module.exports = ListAbl;
