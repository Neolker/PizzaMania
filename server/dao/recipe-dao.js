"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const IngredientDao = require("../dao/ingredient-dao");

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
    let recipePrototype = {
      "id": "REC-" + crypto.randomBytes(4).toString("hex"),
      "name": "New recipe",
      "description": "The best recipe ever.",
      "procedure": "Make it great.",
      "ingredients": []
    };
    if (recipe.name.length < 2 || recipe.description.length < 2 || recipe.procedure.length < 2) {
      throw new Error("Name, description and procedure are required, recipe (name: " + recipe.name + ", description: " + recipe.description + ", procedure: " + recipe.procedure + ") has not been created. Minimal lenght: 2 characters in every variable.");
    }
    recipePrototype.name = recipe.name;
    recipePrototype.description = recipe.description;
    recipePrototype.procedure = recipe.procedure;
    recipeList.push(recipePrototype);
    await wf(this._getStorageLocation(), JSON.stringify(recipeList, null, 2));
    return recipePrototype;
  }

  async getRecipe(id) {
    let recipe = await this._loadAllRecipes();
    const result = recipe.find((b) => b.id === id);
    return result;
  }

  async updateRecipe(recipe) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === recipe.id);
    if (recipeIndex < 0) {
      throw new Error("Recipe with given id " + recipe.id + " does not exists.");
    } else {
      if (recipe.name.length < 2 || recipe.description.length < 2 || recipe.procedure.length < 2) {
        throw new Error("Name, description and procedure are required, recipe (name: " + recipe.name + ", description: " + recipe.description + ", procedure: " + recipe.procedure + ") has not been updated. Minimal lenght: 2 characters in every variable.");
      }
      let recipePrototype = recipeList[recipeIndex];
      recipePrototype.name = recipe.name;
      recipePrototype.description = recipe.description;
      recipePrototype.procedure = recipe.procedure;
      recipeList[recipeIndex] = {
        ...recipeList[recipeIndex],
        ...recipePrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipeList, null, 2));
    return recipeList[recipeIndex];
  }

  async deleteRecipe(id) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === id);
    if (recipeIndex >= 0) {
      recipeList.splice(recipeIndex, 1);
    } else {
      throw new Error("Recipe id " + id + " was not found.");
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipeList, null, 2));
    return {};
  }

  async listRecipes() {
    let recipeList = await this._loadAllRecipes();
    return recipeList;
  }

  async getCountOfRecipiesByIngredient(ingredientId) {
    let recipeList = await this._loadAllRecipes();
    let cnt = 0;
    recipeList.forEach(function (recipe) {
      recipe.ingredients.forEach(function (ingredient) {
        if (ingredient.id == ingredientId) {
          cnt++;
        }
      })
    });
    /* console.log("cnt: "+cnt); // for debug */
    return cnt;
  }

  async addIngredientIntoRecipe(ingredient) {
    ingredient.amount = parseInt(ingredient.amount);
    if (ingredient.amount < 1) {
      throw new Error("Amount can not be less than 1. Ingredient has not been added.");
    }
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === ingredient.id_recipe);
    if (recipeIndex < 0) {
      throw new Error("Recipe with given id " + ingredient.id_recipe + " does not exists. Ingredient has not been added.");
    }
    let recipe = recipeList[recipeIndex];
    recipe.ingredients.forEach(function (ing) {
      if (ing.id == ingredient.id_ingredient) {
        throw new Error("Recipe with given id " + ingredient.id_recipe + " have ingredient id " + ingredient.id_ingredient + ". Ingredient has not been added.");
      }
    });
    let ingredientD = await new IngredientDao(path.join("storage", "ingredients.json"));
    let ingredientExist = await ingredientD.getIngredient(ingredient.id_ingredient);
    if (!ingredientExist) {
      throw new Error("Ingredient with given id " + ingredient.id_ingredient + " does not exists. Ingredient has not been added.");
    }
    recipe.ingredients.push({
      "id": ingredient.id_ingredient,
      "amount": ingredient.amount
    });
    recipeList[recipeIndex] = {
      ...recipeList[recipeIndex],
      ...recipe,
    };
    await wf(this._getStorageLocation(), JSON.stringify(recipeList, null, 2));
    return recipeList[recipeIndex];
  }
  async updateIngredientInRecipe(ingredient) {
    ingredient.amount = parseInt(ingredient.amount);
    if (ingredient.amount < 1) {
      throw new Error("Amount can not be less than 1. Nothig has been edited.");
    }
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === ingredient.id_recipe);
    if (recipeIndex < 0) {
      throw new Error("Recipe with given id " + ingredient.id_recipe + " does not exists. Nothing has been edited.");
    }
    let recipe = recipeList[recipeIndex];
    let updated = 0;
    recipe.ingredients.forEach(function (ing, ind) {
      if (ing.id == ingredient.id_ingredient) {
        recipe.ingredients[ind].amount = ingredient.amount;
        updated = 1;
      }
    });
    if (updated == 0) {
      throw new Error("Recipe with given id " + ingredient.id_recipe + " does not have ingredient id " + ingredient.id_ingredient + ". Nothing has been edited.");
    }
    recipeList[recipeIndex] = {
      ...recipeList[recipeIndex],
      ...recipe,
    };
    await wf(this._getStorageLocation(), JSON.stringify(recipeList, null, 2));
    return recipeList[recipeIndex];
  }
  async deleteIngredientFromRecipe(ingredient) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === ingredient.id_recipe);
    if (recipeIndex < 0) {
      throw new Error("Recipe with given id " + ingredient.id_recipe + " does not exists. Nothing has been removed.");
    }
    let recipe = recipeList[recipeIndex];
    let updated = 0;
    let newIngs = []
    recipe.ingredients.forEach(function (ing, ind) {
      if (ing.id == ingredient.id_ingredient) {
        updated = 1;
      } else {
        newIngs[ind] = ing;
      }
    });
    if (updated == 0) {
      throw new Error("Recipe with given id " + ingredient.id_recipe + " does not have ingredient id " + ingredient.id_ingredient + ". Nothing has been removed.");
    } else {
      recipe.ingredients = newIngs;
      recipeList[recipeIndex] = {
        ...recipeList[recipeIndex],
        ...recipe,
      };
      await wf(this._getStorageLocation(), JSON.stringify(recipeList, null, 2));
    }
    return recipeList[recipeIndex];
  }

  async superCreateRecipe(recipe){
    let createdRecipe = await this.createRecipe(recipe);
    let finalRecipe;
    if(createdRecipe){
      if(recipe.ingredients && Array.isArray(recipe.ingredients) ){
        try{
          for (let i = 0, len = recipe.ingredients.length; i < len; i++) {
            let recipeWithIngredience = await this.addIngredientIntoRecipe({
              "id_recipe":createdRecipe.id,
              "id_ingredient":recipe.ingredients[i].id,
              "amount":recipe.ingredients[i].amount
              });
            }
        } catch (e) {
          let rollback = await this.deleteRecipe(createdRecipe.id);
          throw new Error("Some of ingredient(s) cannot be added into the Recipe. Check your data for validation or check if ingredient already exists. Recipe has not been created.");
        }
        finalRecipe = await this.getRecipe(createdRecipe.id); // Re-load recipe for ingredients   
      }else{
        finalRecipe = createdRecipe; // No ingrediens, no re-load recipe, take recipe as it is 
      }    
    }else{
      throw new Error("Validation of the input failed: name, description and procedure of the recipe are required, minimal lenght: 2 characters in all variables. Recipe has not been created.");
    }
    return finalRecipe;
  }
  
  async superUpdateRecipe(recipe){
    let updatedRecipe = await this.getRecipe(recipe.id);
    if(updatedRecipe){
      let update = await this.updateRecipe(recipe);
      if(update){
        let erase = await this._deleteAllIngredientsFromRecipe(updatedRecipe.id);   
        if(recipe.ingredients && Array.isArray(recipe.ingredients) ){
          for (let j = 0, lem = recipe.ingredients.length; j < lem; j++) {
            if(recipe.ingredients[j] !== null){
              let newIngredience = await this.addIngredientIntoRecipe({
                "id_recipe":update.id,
                "id_ingredient":recipe.ingredients[j].id,
                "amount":recipe.ingredients[j].amount
                });
              }
            }
          }
      }else{
        throw new Error("Recipe with id "+recipe.id+" has has not been updated.");
      }
    }else{
      throw new Error("Recipe with id "+recipe.id+" not found. Update has not been successfull.");
    }
    let finalRecipe = await this.getRecipe(recipe.id);
    return finalRecipe;
  }
  
  async _deleteAllIngredientsFromRecipe(id) {
    let recipeList = await this._loadAllRecipes();
    const recipeIndex = recipeList.findIndex((b) => b.id === id);
    if (recipeIndex < 0) {
      throw new Error("Recipe with given id " + id + " does not exists. No ingredients has been removed.");
    }
    let recipe = recipeList[recipeIndex];
    let newIngs = [];
    recipe.ingredients = newIngs;
    recipeList[recipeIndex] = {
      ...recipeList[recipeIndex],
      ...recipe,
    };
    await wf(this._getStorageLocation(), JSON.stringify(recipeList, null, 2));
    return recipeList[recipeIndex];
  }
  
  async _loadAllRecipes() {
    let recipeList;
    try {
      recipeList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (typeof e.code === 'undefined') {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
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
