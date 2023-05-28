const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(path.join(__dirname, "..", "..", "storage", "ingredients.json"));

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    unit: { type: "string" },
  },
  required: ["id", "name", "unit"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let ingredient = req.body;
    const valid = ajv.validate(schema, ingredient);
    if (valid) {
      ingredient = await dao.updateIngredient(ingredient);
      res.json(ingredient);
    } else {
     res.status(400).send({"error":"Validation of input failed: id, name and unit are required, minimal lenght: 2 characters in name and 2 characters in unit."});
    }
  } catch (e) {
    res.status(400).send({"error":e.message});
  }
}

module.exports = UpdateAbl;
