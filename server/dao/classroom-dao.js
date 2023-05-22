"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "classroom.json");

class ClassroomDao {
  constructor(storagePath) {
    this.classroomStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createClassroom(classroom) {
    let classroomList = await this._loadAllClassrooms();
    classroom.id = crypto.randomBytes(8).toString("hex");
    classroomList.push(classroom);
    await wf(
      this._getStorageLocation(),
      JSON.stringify(classroomList, null, 2)
    );
    return classroom;
  }

  async getClassroom(id) {
    let classroom = await this._loadAllClassrooms();
    const result = classroom.find((b) => b.id === id);
    return result;
  }

  async updateClassroom(classroom) {
    let classroomList = await this._loadAllClassrooms();
    const classroomIndex = classroomList.findIndex(
      (b) => b.id === classroom.id
    );
    if (classroomIndex < 0) {
      throw new Error(
        `classroom with given id ${classroom.id} does not exists`
      );
    } else {
      classroomList[classroomIndex] = {
        ...classroomList[classroomIndex],
        ...classroom,
      };
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(classroomList, null, 2)
    );
    return classroomList[classroomIndex];
  }

  async deleteClassroom(id) {
    let classroomList = await this._loadAllClassrooms();
    const classroomIndex = classroomList.findIndex((b) => b.id === id);
    if (classroomIndex >= 0) {
      classroomList.splice(classroomIndex, 1);
    }
    await wf(
      this._getStorageLocation(),
      JSON.stringify(classroomList, null, 2)
    );
    return {};
  }

  async listClassrooms() {
    let classroomList = await this._loadAllClassrooms();
    return classroomList;
  }

  async _loadAllClassrooms() {
    let classroomList;
    try {
      classroomList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        classroomList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return classroomList;
  }

  _getStorageLocation() {
    return this.classroomStoragePath;
  }
}

module.exports = ClassroomDao;
