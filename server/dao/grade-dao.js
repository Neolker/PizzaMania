"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "grades.json");

class GradesDao {
  constructor(storagePath) {
    this.gradeStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createGrade(grade) {
    let gradelist = await this._loadAllGrades();
    grade.id = crypto.randomBytes(8).toString("hex");
    gradelist.push(grade);
    await wf(this._getStorageLocation(), JSON.stringify(gradelist, null, 2));
    return grade;
  }

  async getGrade(id) {
    let gradelist = await this._loadAllGrades();
    const result = gradelist.find((b) => b.id === id);
    return result;
  }

  async updateGrade(grade) {
    let gradelist = await this._loadAllGrades();
    const gradeIndex = gradelist.findIndex((b) => b.id === grade.id);
    if (gradeIndex < 0) {
      throw new Error(`grade with given id ${grade.id} does not exists`);
    } else {
      gradelist[gradeIndex] = {
        ...gradelist[gradeIndex],
        ...grade,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(gradelist, null, 2));
    return gradelist[gradeIndex];
  }

  async deleteGrade(id) {
    let gradelist = await this._loadAllGrades();
    const gradeIndex = gradelist.findIndex((b) => b.id === id);
    if (gradeIndex >= 0) {
      gradelist.splice(gradeIndex, 1);
    }
    await wf(this._getStorageLocation(), JSON.stringify(gradelist, null, 2));
    return {};
  }

  async listGrades() {
    let gradelist = await this._loadAllGrades();
    return gradelist;
  }

  async _loadAllGrades() {
    let gradelist;
    try {
      gradelist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        gradelist = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return gradelist;
  }

  _getStorageLocation() {
    return this.gradeStoragePath;
  }
}

module.exports = GradesDao;
