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
    let recipePrototype={
      "id":"REC-" + crypto.randomBytes(4).toString("hex"),
      "name":"New recipe",
      "description":"The best recipe ever.",
      "procedure":"Make it great.",
      "ingredients":[]
      };
    if(recipe.name.length<2||recipe.description.length<2||recipe.procedure.length<2){
      throw new Error("Name, description and procedure are required, recipe (name: "+recipe.name+", description: "+recipe.description+", procedure: "+recipe.procedure+") has not been created. Minimal lenght: 2 characters in every variable.");
      }  
    recipePrototype.name=recipe.name;
    recipePrototype.description=recipe.description;
    recipePrototype.procedure=recipe.procedure;
    recipeList.push(recipePrototype);
    await wf(this._getStorageLocation(),JSON.stringify(recipeList, null, 2));
    return recipePrototype;
  }

  async getRecipe(id) {
    let recipe = await this._loadAllRecipes();
    const result = recipe.find((b) => b.id === id);
    return result;
  }

  async updateRecipe(recipe) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex( (b) => b.id === recipe.id );
    if (recipeIndex < 0) {
      throw new Error("Recipe with given id "+recipe.id+" does not exists.");
    } else {
      if(recipe.name.length<2||recipe.description.length<2||recipe.procedure.length<2){
        throw new Error("Name, description and procedure are required, recipe (name: "+recipe.name+", description: "+recipe.description+", procedure: "+recipe.procedure+") has not been updated. Minimal lenght: 2 characters in every variable.");
        } 
      let recipePrototype=recipeList[recipeIndex];
      recipePrototype.name=recipe.name;
      recipePrototype.description=recipe.description;
      recipePrototype.procedure=recipe.procedure;
      recipeList[recipeIndex] = {
        ...recipeList[recipeIndex],
        ...recipePrototype,
      };
    }
    await wf(this._getStorageLocation(),JSON.stringify(recipeList, null, 2));
    return recipeList[recipeIndex];
  }

  async deleteRecipe(id) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === id);
    if (recipeIndex >= 0) {
      recipeList.splice(recipeIndex, 1);
    } else {
      throw new Error("Recipe id "+id+" is not found.");
    }
    await wf(this._getStorageLocation(),JSON.stringify(recipeList, null, 2));
    return {};
  }

  async listRecipes() {
    let recipeList = await this._loadAllRecipes();
    return recipeList;
  }
  
  async getCountOfRecipiesByIngredient(ingredientId){
    let recipeList = await this._loadAllRecipes();
    let cnt=0;
    recipeList.forEach(function(recipe){
      recipe.ingredients.forEach(function(ingredient){
        if(ingredient.id==ingredientId){
          cnt++;
          }
        })
      });
    /* console.log("cnt: "+cnt); // for debug */
    return cnt;
    }
    
  async _loadAllRecipes() {
    let recipeList;
    try {
      recipeList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (typeof e.code === 'undefined') {
        throw new Error("Unable to read from storage - wrong data format in "+this._getStorageLocation());
      } else if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        recipeList = [];
      } else {
        throw new Error("Unable to read from storage - Wrong data format in " + this._getStorageLocation());
      }
    }
    return recipeList;
  }

  _getStorageLocation() {
    return this.recipeStoragePath;
  }
}

module.exports = RecipeDao;
