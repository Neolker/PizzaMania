"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "students.json");

class StudentsDao {
  constructor(storagePath) {
    this.studentStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createStudent(student) {
    let studentlist = await this._loadAllStudents();
    let currentStudent = studentlist.find(
      (item) => item.nationalId === student.nationalId
    );
    if (currentStudent) {
      throw `student with nationalId ${student.nationalId} already exists in db`;
    }
    student.id = crypto.randomBytes(8).toString("hex");
    studentlist.push(student);
    await wf(this._getStorageLocation(), JSON.stringify(studentlist, null, 2));
    return student;
  }

  async getStudent(id) {
    let studentlist = await this._loadAllStudents();
    const result = studentlist.find((b) => b.id === id);
    return result;
  }

  async updateStudent(student) {
    let studentlist = await this._loadAllStudents();
    const studentIndex = studentlist.findIndex((b) => b.id === student.id);
    if (studentIndex < 0) {
      throw new Error(`Student with given id ${student.id} does not exists.`);
    } else {
      studentlist[studentIndex] = {
        ...studentlist[studentIndex],
        ...student,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(studentlist, null, 2));
    return studentlist[studentIndex];
  }

  async deleteStudent(id) {
    let studentlist = await this._loadAllStudents();
    const studentIndex = studentlist.findIndex((b) => b.id === id);
    if (studentIndex >= 0) {
      studentlist.splice(studentIndex, 1);
    }
    await wf(this._getStorageLocation(), JSON.stringify(studentlist, null, 2));
    return {};
  }

  async listStudents() {
    let studentlist = await this._loadAllStudents();
    return studentlist;
  }

  async _loadAllStudents() {
    let studentlist;
    try {
      studentlist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        studentlist = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return studentlist;
  }

  _getStorageLocation() {
    return this.studentStoragePath;
  }
}

module.exports = StudentsDao;
