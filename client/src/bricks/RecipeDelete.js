import Icon from '@mdi/react';
import Confirmation from './Confirmation';
import { mdiTrashCanOutline } from '@mdi/js';
import { useState } from 'react';

export default function RecipeDelete({ recipe, onDelete, onError }) {
    const [deleteRecipeCall, setDeleteRecipeCall] = useState({
        state: 'inactive'
    });

    const handleDelete = async () => {
        if (deleteRecipeCall.state === 'pending')
            return

        setDeleteRecipeCall({ state: 'pending' });

        const res = await fetch(`http://localhost:3000/recipe/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: recipe.id })
        });

        const data = await res.json();

        if (res.status >= 400) {
            setDeleteRecipeCall({ state: 'error', error: data });

            if (typeof onError === 'function')
                onError(data.errorMessage);

        } else {
            setDeleteRecipeCall({ state: 'success', data });

            if (typeof onDelete === 'function') {
                onDelete(recipe.id);
            }
        }
    }

    return (
        <Confirmation
            title="Smazat recept"
            message="Opravdu si přejete smazat recept?"
            confirmText="Smazat"
            onConfirm={handleDelete}
        >
            <div>
                <Icon
                    path={mdiTrashCanOutline}
                    style={{ cursor: 'pointer', color: 'red' }}
                    size={0.8}
                ></Icon>
            </div>
        </Confirmation>
    )
}