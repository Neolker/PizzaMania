import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ClassroomInfo from "../bricks/ClassroomInfo";
import StudentList from "../bricks/StudentList";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import styles from "../css/classroom.module.css";

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function RecipeDetail() {
    const [recipeLoadCall, setRecipeLoadCall] = useState({
        state: "pending",
    });
    let [searchParams] = useSearchParams();

    const recipeId = searchParams.get("id");

    useEffect(() => {
        setRecipeLoadCall({
            state: "pending",
        });
        fetch(`http://localhost:3000/recipe/get?id=${recipeId}`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setRecipeLoadCall({ state: "error", error: responseJson });
            } else {
                setRecipeLoadCall({ state: "success", data: responseJson });
            }
        });
    }, [recipeId]);

    function getChild() {
        switch (recipeLoadCall.state) {
            case "pending":
                return (
                    <div className={styles.loading}>
                        <Icon size={2} path={mdiLoading} spin={true} />
                    </div>
                );
            case "success":
                return (
                    <>
                        <div>
                            <h1>{recipeLoadCall.data.name}</h1>
                            <p>{recipeLoadCall.data.description}</p>
                            <p>{recipeLoadCall.data.procedure}</p>
                            <p><label>Počet porcí: </label>
                                <input
                                    className="col-sm-1"
                                    type="number"
                                    placeholder="1"
                                    style={{ marginLeft: "1em" }}
                                ></input>
                            </p>
                            <p>TODO Ingredience seznam</p>
                        </div >
                    </>
                );
            case "error":
                return (
                    <div className={styles.error}>
                        <div>Nepodařilo se načíst data receptu.</div>
                        <br />
                        <pre>{JSON.stringify(recipeLoadCall.error, null, 2)}</pre>
                    </div>
                );
            default:
                return null;
        }
    }

    return getChild();
}

export default RecipeDetail;
