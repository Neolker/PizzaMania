"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipes.json");

class RecipeDao {
  constructor(storagePath) {
    this.recipeStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createRecipe(recipe) {
    let recipeList = await this._loadAllRecipes();
    recipe.id = crypto.randomBytes(8).toString("hex");
    recipeList.push(recipe);
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeList, null, 2)
    );
    return recipe;
  }

  async getRecipe(id) {
    let recipe = await this._loadAllRecipes();
    const result = recipe.find((b) => b.id === id);
    return result;
  }

  async updateRecipe(recipe) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex(
      (b) => b.id === recipe.id
    );
    if (recipeIndex < 0) {
      throw new Error(
        `recipe with given id ${recipe.id} does not exists`
      );
    } else {
      recipeList[recipeIndex] = {
        ...recipeList[recipeIndex],
        ...recipe,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeList, null, 2)
    );
    return recipeList[recipeIndex];
  }

  async deleteRecipe(id) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === id);
    if (recipeIndex >= 0) {
      recipeList.splice(recipeIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(recipeList, null, 2)
    );
    return {};
  }

  async listRecipes() {
    let recipeList = await this._loadAllRecipes();
    return recipeList;
  }

  async _loadAllRecipes() {
    let recipeList;
    try {
      recipeList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        recipeList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return recipeList;
  }

  _getStorageLocation() {
    return this.recipeStoragePath;
  }
}

module.exports = RecipeDao;
