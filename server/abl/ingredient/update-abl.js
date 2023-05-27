const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(
  path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    amount: { type: "number" },
    unit: { type: "string" },
  },
  required: ["id"],
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
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: ingredient,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("Ingredient with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
