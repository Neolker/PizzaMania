import React from "react";
import Student from "./Student";

function StudentGridList(props) {
  return (
    <div class="row">
      {props.studentList.map((student) => {
        return (
          <div
            class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
            style={{ paddingBottom: "16px" }}
          >
            <Student key={student.id} student={student} classroom={props.classroom} />
          </div>
        );
      })}
    </div>
  );
}

export default StudentGridList;
