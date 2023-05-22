const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const neatCsv = require("neat-csv");
const { mainModule } = require("process");
const axios = require("axios").default;

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

class Import {
  constructor() {
    this.classroomToImportList = [];
    this.classroomImportedList = [];
    this.classroomNotImportedList = [];
    this.classroomBeingImported = {};
    this.studentMap = null;
  }

  async getClassroomList() {
    const inputFile = await rf(path.join(__dirname, "classroom_import.csv"));
    this.classroomToImportList = await neatCsv(inputFile.toString());
  }

  getClassroomToImport(i) {
    this.classroomBeingImported = this.classroomToImportList[i];
  }

  async importClassroom() {
    try {
      await this._importStudents();
      await this._importClassroom();
      await this._importImage();
      // everything was OK, classroom is imported
      this.classroomImportedList.push(this.classroomBeingImported);
    } catch (e) {
      // classroom failed to import, classroom is imported
      this.classroomBeingImported.error = e;
      this.classroomNotImportedList.push(this.classroomBeingImported);
    }
  }

  async _importStudents() {
    // ověřit, jestli existuje StudentMap - přehled všech autorů
    if (!this.studentMap) {
      // při prvním spuštění, pokud neexistuje - stáhne seznam knih a vytvoří autorMap
      // autorMap je objekt { "Jméno Příjmení": "id" } se všemi autory
      this.studentMap = {};
      const studentListResponse = await axios.get(
        "http://localhost:3000/student/list"
      );
      studentListResponse.data.forEach((student) => {
        this.studentMap[`${student.firstname} ${student.lastname}`] = student;
      });
    }
    // převést seznam autorů na pole (u jedné knihy může být více autorů, například "Stephen Baxter, Arthur C. Clarke")
    const studentToImportList = this.classroomBeingImported.student.split(",");
    this.classroomBeingImported.studentList = [];
    // ověřit, jestli existuje autor importované knihy
    for (let j = 0; j < studentToImportList.length; j++) {
      // odebrat mezery na začátku / na konci autora - například z "Stephen Baxter, Arthur C. Clarke" vznikne ["Stephen Baxter", " Arthur C. Clarke"]
      const studentName = studentToImportList[j].trim();
      if (this.studentMap[studentName]) {
        this.classroomBeingImported.studentList.push(
          this.studentMap[studentName].id
        );
      } else {
        // poslední část jména je příjmení, vše před je křestní jméno, například "Arthur C.", "Clarke"
        const studentNameSplit = studentName.split(" ");
        const lastname = studentNameSplit.pop();
        const firstname = studentNameSplit.join(" ");
        // zavolat student/create server rozhraní
        const newStudentResponse = await axios.post(
          "http://localhost:3000/student/create",
          {
            firstname: firstname,
            lastname: lastname,
          }
        );
        // přidat nově vytvořené ID do seznamu ID k importu knihy
        this.classroomBeingImported.studentList.push(
          newStudentResponse.data.id
        );
        // přidat nového autora do this.studentMap
        this.studentMap[`${studentName}`] = newStudentResponse.data;
      }
    }
  }

  async _importClassroom() {
    // s pomocí vybraných informací z this.classroomBeingImported vytvořit novou knihu
    const newClassroomResponse = await axios.post(
      "http://localhost:3000/classroom/create",
      {
        id: this.classroomBeingImported.id,
        name: this.classroomBeingImported.name,
        studentList: this.classroomBeingImported.studentList,
      }
    );
  }

  async _importImage() {
    const formData = new FormData();
    formData.append("id", this.classroomBeingImported.id);
    formData.append(
      "data",
      await fs.createReadStream(
        path.join(__dirname, "images", this.classroomBeingImported.image)
      )
    );
    const newClassroomImageResponse = await axios.post(
      "http://localhost:3000/classroomImage/create",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  }

  // uložit výsledky importu do samostatných souborů
  async storeResult() {
    const timeTs = new Date().toISOString().replace(/[^0-9]/g, "");
    await wf(
      path.join(__dirname, `${timeTs}_success.json`),
      JSON.stringify(this.classroomImportedList, null, 2)
    );
    await wf(
      path.join(__dirname, `${timeTs}_failed.json`),
      JSON.stringify(this.classroomNotImportedList, null, 2)
    );
  }
}

async function main() {
  const myImport = new Import();
  await myImport.getClassroomList();
  for (let i = 0; i < myImport.classroomToImportList.length; i++) {
    myImport.getClassroomToImport(i);
    await myImport.importClassroom();
  }
  await myImport.storeResult();
}

main();
