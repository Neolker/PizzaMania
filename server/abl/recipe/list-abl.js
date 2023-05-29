const path = require("path");
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(path.join(__dirname, "..", "..", "storage", "recipes.json"));

async function ListAbl(req, res) {
  try {
    const recipeList = await dao.listRecipes();
    // simulate delay in production build
    setTimeout(function() {
      res.json(recipeList);
    },1000);
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ListAbl;
