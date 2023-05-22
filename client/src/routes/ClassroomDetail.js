import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ClassroomInfo from "../bricks/ClassroomInfo";
import StudentList from "../bricks/StudentList";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import styles from "../css/classroom.module.css";

function ClassroomDetail() {
  const [classroomLoadCall, setClassroomLoadCall] = useState({
    state: "pending",
  });
  let [searchParams] = useSearchParams();

  const classroomId = searchParams.get("id");

  useEffect(() => {
    setClassroomLoadCall({
      state: "pending",
    });
    fetch(`http://localhost:3000/classroom/load?id=${classroomId}`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setClassroomLoadCall({ state: "error", error: responseJson });
      } else {
        setClassroomLoadCall({ state: "success", data: responseJson });
      }
    });
  }, [classroomId]);

  function getChild() {
    switch (classroomLoadCall.state) {
      case "pending":
        return (
          <div className={styles.loading}>
            <Icon size={2} path={mdiLoading} spin={true} />
          </div>
        );
      case "success":
        return (
          <>
            <ClassroomInfo classroom={classroomLoadCall.data} />
            <StudentList classroom={classroomLoadCall.data} />
          </>
        );
      case "error":
        return (
          <div className={styles.error}>
            <div>Nepodařilo se načíst data o třídě.</div>
            <br />
            <pre>{JSON.stringify(classroomLoadCall.error, null, 2)}</pre>
          </div>
        );
      default:
        return null;
    }
  }

  return getChild();
}

export default ClassroomDetail;
