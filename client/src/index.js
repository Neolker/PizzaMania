import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ClassroomDetail from "./routes/ClassroomDetail";
import Home from "./routes/Home";
import SubjectList from "./routes/SubjectList";
import StudentList from "./routes/StudentList";
import { UserProvider } from "./UserProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="" element={<Home />} />
            <Route path="classroomDetail" element={<ClassroomDetail />} />
            <Route path="studentList" element={<StudentList />} />
            <Route path="subjectList" element={<SubjectList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
