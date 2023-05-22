import React from "react";
import { Table } from "react-bootstrap";
import { getColorByGrade } from "../helpers/common";

function StudentTableList(props) {
  const studentList = props.studentList;
  const subjectList = studentList[0].subjectList;

  return (
    <Table>
      <thead>
        <tr>
          <th>Jméno</th>
          <th>Příjmení</th>
          <th>Rodné číslo</th>
          {subjectList.map((subject) => {
            return <th key={subject.id}>{subject.name}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {studentList.map((student) => {
          return (
            <tr key={student.id}>
              <td>{student.firstname}</td>
              <td>{student.surname}</td>
              <td>{student.nationalId}</td>
              {student.subjectList.map((subject) => {
                let average = subject.averageGrade;
                if (average) average = average.toFixed(1);
                else average = "N";
                return (
                  <td key={subject.id} style={{ textAlign: "right" }}>
                    <b style={{ color: getColorByGrade(average) }}>{average}</b>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default StudentTableList;
