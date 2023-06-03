import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";
import App from "./App";
import RecipeDetail from "./routes/RecipeDetail";
import Home from "./routes/Home";
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
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    </React.StrictMode>
);
