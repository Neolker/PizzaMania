const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"));

let schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    unit: { type: "string" },
  },
  required: ["name", "unit"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let ingredient = req.body;
      let ingredientCreated = await dao.createIngredient(ingredient);
      res.json(ingredientCreated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: name and unit are required, minimal lenght: 1 character in the name and 1 character in the unit." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = CreateAbl;
