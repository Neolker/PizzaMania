import React, { useState, useMemo, useContext } from "react";
import StudentGridList from "./StudentGridList";
import StudentTableList from "./StudentTableList";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import Icon from "@mdi/react";
import { mdiTable, mdiViewGridOutline, mdiMagnify } from "@mdi/js";
import styles from "../css/studentList.module.css";
import UserContext from "../UserProvider";

function StudentList(props) {
  const { user, isLoggedIn, isStudent, isParent } = useContext(UserContext);
  const [viewType, setViewType] = useState("grid");
  const isGrid = viewType === "grid";
  const [searchBy, setSearchBy] = useState("");

  const filteredStudentList = useMemo(() => {
    return props.classroom.studentList.filter((item) => {
      if (isStudent())
        return item.id === user.student.id;

      if (isParent())
        return user.students.some(student => student.id === item.id);

      return (
        item.firstname
          .toLocaleLowerCase()
          .includes(searchBy.toLocaleLowerCase()) ||
        item.surname.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
      );
    });
  }, [searchBy, props.classroom.studentList, user]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchBy(event.target["searchInput"].value);
  }

  function handleSearchDelete(event) {
    if (!event.target.value) setSearchBy("");
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="sm" bg="light">
        <div className="container-fluid">
          <Navbar.Brand>Seznam studentů</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse style={{ justifyContent: "right" }}>
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                id={"searchInput"}
                style={{ maxWidth: "150px" }}
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearchDelete}
              />
              <Button
                style={{ marginRight: "8px" }}
                variant="outline-success"
                type="submit"
              >
                <Icon size={1} path={mdiMagnify} />
              </Button>
            </Form>
            <Button
              className={"d-none d-md-block"}
              variant="outline-primary"
              onClick={() =>
                setViewType((currentState) => {
                  if (currentState === "grid") return "table";
                  else return "grid";
                })
              }
            >
              <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
              {isGrid ? "Tabulka" : "Grid"}
            </Button>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <div className={styles.studentList}>
        {filteredStudentList.length && isLoggedIn() ? (
          <div class="container">
            <div className={"d-block d-md-none"}>
              <StudentGridList studentList={filteredStudentList} classroom={props.classroom} />
            </div>
            <div className={"d-none d-md-block"}>
              {isGrid ? (
                <StudentGridList studentList={filteredStudentList} classroom={props.classroom} />
              ) : (
                <StudentTableList studentList={filteredStudentList} />
              )}
            </div>
          </div>
        ) : (
          <div style={{ margin: "16px auto", textAlign: "center" }}>
            Nejsou žádní studenti ke zobrazení
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentList;
