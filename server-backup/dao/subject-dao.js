"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "subjects.json");

class SubjectsDao {
  constructor(storagePath) {
    this.subjectStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createSubject(subject) {
    let subjectlist = await this._loadAllSubjects();
    let currentSubject = subjectlist.find(
      (item) => item.shortName === subject.shortName
    );
    if (currentSubject) {
      throw `subject with shortName ${subject.shortName} already exists in db`;
    }
    subject.id = crypto.randomBytes(8).toString("hex");
    subjectlist.push(subject);
    await wf(this._getStorageLocation(), JSON.stringify(subjectlist, null, 2));
    return subject;
  }

  async getSubject(id) {
    let subjectlist = await this._loadAllSubjects();
    const result = subjectlist.find((b) => b.id === id);
    return result;
  }

  async updateSubject(subject) {
    let subjectlist = await this._loadAllSubjects();
    const subjectIndex = subjectlist.findIndex((b) => b.id === subject.id);
    if (subjectIndex < 0) {
      throw new Error(`subject with given id ${subject.id} does not exists`);
    } else {
      subjectlist[subjectIndex] = {
        ...subjectlist[subjectIndex],
        ...subject,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(subjectlist, null, 2));
    return subjectlist[subjectIndex];
  }

  async deleteSubject(id) {
    let subjectlist = await this._loadAllSubjects();
    const subjectIndex = subjectlist.findIndex((b) => b.id === id);
    if (subjectIndex >= 0) {
      subjectlist.splice(subjectIndex, 1);
    }
    await wf(this._getStorageLocation(), JSON.stringify(subjectlist, null, 2));
    return {};
  }

  async listSubjects() {
    let subjectlist = await this._loadAllSubjects();
    return subjectlist;
  }

  async _loadAllSubjects() {
    let subjectlist;
    try {
      subjectlist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        subjectlist = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return subjectlist;
  }

  _getStorageLocation() {
    return this.subjectStoragePath;
  }
}

module.exports = SubjectsDao;
