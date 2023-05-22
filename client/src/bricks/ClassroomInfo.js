import React from "react"; 
import styles from "../css/classroom.module.css";

function ClassroomInfo(props) {
  return (
    <h1 data-testid="classroom-title">
      Classroom{" "}
      <span data-testid="classroom-name" className={styles.classroomNameHeader}>
        {props.classroom.name}
      </span>
    </h1>
  );
}

export default ClassroomInfo;
