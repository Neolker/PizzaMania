"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "ingredients.json");

class IngredientDao {
  constructor(storagePath) {
    this.ingredientStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createIngredient(ingredient) {
    let ingredientlist = await this._loadAllIngredients();
    let ingredientPrototype = {
      "id": "ING-" + crypto.randomBytes(4).toString("hex"),
      "name": "New ingredient",
      "unit": "A piece"
    };
    if (ingredient.name.length < 1 || ingredient.unit.length < 1) {
      throw new Error("Name and unit are required, ingredient (name: " + ingredient.name + ", unit: " + ingredient.unit + ") has not been created. Minimal lenght: 1 character in the name and 1 character in the unit.");
    }
    ingredientPrototype.name = ingredient.name;
    ingredientPrototype.unit = ingredient.unit;
    ingredientlist.push(ingredientPrototype);
    await wf(this._getStorageLocation(), JSON.stringify(ingredientlist, null, 2));
    return ingredientPrototype;
  }

  async getIngredient(id) {
    let ingredientlist = await this._loadAllIngredients();
    const result = ingredientlist.find((b) => b.id === id);
    return result;
  }

  async updateIngredient(ingredient) {
    let ingredientlist = await this._loadAllIngredients();
    const ingredientIndex = ingredientlist.findIndex((b) => b.id === ingredient.id);
    if (ingredientIndex < 0) {
      throw new Error("Ingredient with given id " + ingredient.id + " does not exists.");
    } else {
      if (ingredient.name.length < 1 || ingredient.unit.length < 1) {
        throw new Error("Name and unit are required, ingredient (name: " + ingredient.name + ", unit: " + ingredient.unit + ") has not been created. Minimal lenght: 1 character in the name and 1 character in the unit.");
      }
      let ingredientPrototype = {
        "id": ingredient.id,
        "name": ingredient.name,
        "unit": ingredient.unit
      };
      ingredientlist[ingredientIndex] = {
        ...ingredientlist[ingredientIndex],
        ...ingredientPrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(ingredientlist, null, 2));
    return ingredientlist[ingredientIndex];
  }

  async deleteIngredient(id) {
    let ingredientlist = await this._loadAllIngredients();
    const RecipeDao = require("../dao/recipe-dao");
    const ingredientIndex = ingredientlist.findIndex((b) => b.id === id);
    if (ingredientIndex >= 0) {

      let recipeD = await new RecipeDao(path.join("storage", "recipes.json"));
      let countOfUse = await recipeD.getCountOfRecipiesByIngredient(id);
      if (countOfUse > 0) {
        throw new Error("Ingredient id " + id + " is used in " + countOfUse + " recipient(s). Delete is not possible.");
      } else {
        ingredientlist.splice(ingredientIndex, 1);
        await wf(this._getStorageLocation(), JSON.stringify(ingredientlist, null, 2));
      }
    } else {
      throw new Error("Ingredient id " + id + " is not found.");
    }
    return {};
  }

  async listIngredients() {
    let ingredientlist = await this._loadAllIngredients();
    return ingredientlist;
  }

  async _loadAllIngredients() {
    let ingredientlist;
    try {
      ingredientlist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (typeof e.code === 'undefined') {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      } else if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one in " + this._getStorageLocation());
        ingredientlist = [];
      } else {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      }
    }
    return ingredientlist;
  }

  _getStorageLocation() {
    return this.ingredientStoragePath;
  }
}

module.exports = IngredientDao;