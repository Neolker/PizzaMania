const express = require("express");
const router = express.Router();

const SuperCreateAbl = require("../abl/recipe/super-create-abl");
const SuperUpdateAbl = require("../abl/recipe/super-update-abl");

const CreateAbl = require("../abl/recipe/create-abl");
const GetAbl = require("../abl/recipe/get-abl");
const UpdateAbl = require("../abl/recipe/update-abl");
const DeleteAbl = require("../abl/recipe/delete-abl");
const ListAbl = require("../abl/recipe/list-abl");

const AddIngredientIntoRecipeAbl = require("../abl/recipe/add-ingredient-into-recipe-abl");
const UpdateIngredientInRecipeAbl = require("../abl/recipe/update-ingredient-in-recipe-abl");
const DeleteIngredientFromRecipeAbl = require("../abl/recipe/delete-ingredient-from-recipe-abl");

router.post("/super-create", async (req, res) => {
  await SuperCreateAbl(req, res);
});

router.post("/super-update", async (req, res) => {
  await SuperUpdateAbl(req, res);
});

router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res);
});

router.post("/add-ingredient", async (req, res) => {
  await AddIngredientIntoRecipeAbl(req, res);
});

router.post("/update-ingredient", async (req, res) => {
  await UpdateIngredientInRecipeAbl(req, res);
});

router.post("/delete-ingredient", async (req, res) => {
  await DeleteIngredientFromRecipeAbl(req, res);
});


module.exports = router;
