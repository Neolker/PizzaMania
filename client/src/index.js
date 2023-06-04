import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import RecipeDetail from "./routes/RecipeDetail";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import {UserProvider} from "./UserProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}>
                        <Route path="" element={<Home/>}/>
                        <Route path="RecipeDetail" element={<RecipeDetail/>}/>
                        <Route path="*" element={<NotFound/>} />
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
