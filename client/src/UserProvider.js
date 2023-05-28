import {createContext, useState} from "react";

const UserContext = createContext();

const roles = [
    {
        id: 0,
        name: 'Čitateľ'
    },
    {
        id: 1,
        name: 'Editor'
    },
    {
        id: 2,
        name: 'Správce'
    },
];

const users = [
    {
        id: 0,
        role: roles[2],
        fullName: 'Bohuslav Růžička Správce',
    },
    {
        id: 1,
        role: roles[1],
        fullName: 'Václav Schuster Editor',
    },
    {
        id: 2,
        role: roles[0],
        fullName: 'Alena Kluhová Citatel',
    },

];

export function UserProvider({children}) {

    // ak nie je prihlásený tak mu priradí rolu citatela
    const alreadyLogged = JSON.parse(sessionStorage.getItem('authUser'));
    const [user, setUser] = useState(alreadyLogged ?? {
        role: roles[0]
    });

    const changeUser = (id) => {
        const user = users.find(user => user.id === id);
        const result = user ?? {
            role: roles[0]
        };

        setUser(result);
        sessionStorage.setItem('authUser', JSON.stringify(result));
    }

    const isLoggedIn = () => {
        return user.role.id > 0;
    }

    const isEditor = () => {
        return user.role.id === 1;
    }

    const isAdmin = () => {
        return user.role.id === 2;
    }

    // const canShowDetail = (classroomId, subjectId) => {
    //     if (isDirector())
    //         return true;
    //
    //     if (isEditor()) {
    //         if (user.classrooms.includes(classroomId) && user.subjects.includes(subjectId)) {
    //             return true;
    //         }
    //
    //         return false;
    //     }
    //
    //     if (isEditor() || isAdmin())
    //         return true;
    //
    //     return null;
    // }


    const value = {
        user,
        users,
        changeUser,
        isLoggedIn,
        isEditor,
        isAdmin,
    }

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;