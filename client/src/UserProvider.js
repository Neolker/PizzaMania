import { createContext, useState } from "react";

const UserContext = createContext();

const roles = [
    {
        id: 0,
        name: 'Nepřihlášený'
    },
    {
        id: 1,
        name: 'Student'
    },
    {
        id: 2,
        name: 'Rodič'
    },
    {
        id: 3,
        name: 'Učitel'
    },
    {
        id: 4,
        name: 'Ředitel'
    }
];

const users = [
    {
        id: 0,
        role: roles[4],
        fullName: 'Bohuslav Růžička',
    },
    {
        id: 1,
        role: roles[3],
        fullName: 'Václav Schuster',
        classrooms: ['84d4e4261f30a2e5', 'f780b198cf290778'],
        subjects: ['495a2f53e28edd18', 'e3c7b689a47e76b0']
    },
    {
        id: 2,
        role: roles[3],
        fullName: 'Alena Kluhová',
        classrooms: ['84d4e4261f30a2e5', '1e838cb06cfeb01c'],
        subjects: ['dc3fd3109eb041ff', '3f9e05bc4aaa380b']
    },
    {
        id: 3,
        role: roles[3],
        fullName: 'Nigel Foster',
        classrooms: ['1e838cb06cfeb01c', 'f780b198cf290778', '3aa1b99e902f5175'],
        subjects: ['0258b9979e055af1', 'fe9919c1c95564cc']
    },
    {
        id: 4,
        role: roles[2],
        fullName: 'Josef Novák',
        students: [{
            "firstname": "Hermína",
            "surname": "Bukovská",
            "nationalId": "6354103206",
            "id": "573aaf0225b01132",
            "classroomId": "84d4e4261f30a2e5"
        },
        {
            "firstname": "Milena",
            "surname": "Janderová",
            "nationalId": "8260083447",
            "id": "d9422ca2ec991a1d",
            "classroomId": "1e838cb06cfeb01c"
        }]
    },
    {
        id: 5,
        role: roles[2],
        fullName: 'František Svoboda',
        students: [{
            "firstname": "Naděžda",
            "surname": "Skalická",
            "nationalId": "8159146402",
            "id": "476a8ce2c0803af5",
            "classroomId": "f780b198cf290778"
        },
        {
            "firstname": "Hedvika",
            "surname": "Hrabáková",
            "nationalId": "7552101359",
            "id": "b02c0a9c6494b3da",
            "classroomId": "3aa1b99e902f5175"
        }]
    },
    {
        id: 6,
        role: roles[2],
        fullName: 'Ivan Novotný',
        students: [{
            "firstname": "Lýdie",
            "surname": "Mahdalová",
            "nationalId": "7660188668",
            "id": "9c939e35da27a672",
            "classroomId": "84d4e4261f30a2e5"
        },
        {
            "firstname": "Naděžda",
            "surname": "Matoušová",
            "nationalId": "6062118425",
            "id": "89a02d268b67cf7d",
            "classroomId": "1e838cb06cfeb01c"
        }]
    },
    {
        id: 7,
        role: roles[1],
        fullName: 'Agáta Dittrichová',
        student: {
            "firstname": "Agáta",
            "surname": "Dittrichová",
            "nationalId": "7060084086",
            "id": "d6518140a5d6e2d0",
            "classroomId": "1e838cb06cfeb01c"
        }
    },
    {
        id: 8,
        role: roles[1],
        fullName: 'Ludmila Plašilová',
        student: {
            "firstname": "Ludmila",
            "surname": "Plašilová",
            "nationalId": "9155177614",
            "id": "6797c49e1a286d52",
            "classroomId": "f780b198cf290778"
        }
    },
    {
        id: 9,
        role: roles[1],
        fullName: 'Saskie Mertová',
        student: {
            "firstname": "Saskie",
            "surname": "Mertová",
            "nationalId": "7651117815",
            "id": "2862a7b1abf33eed",
            "classroomId": "3aa1b99e902f5175"
        },
    }
];

export function UserProvider({ children }) {
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

    const isStudent = () => {
        return user.role.id === 1;
    }

    const isParent = () => {
        return user.role.id === 2;
    }

    const isTeacher = () => {
        return user.role.id === 3;
    }

    const isDirector = () => {
        return user.role.id === 4;
    }

    const canShowDetail = (classroomId, subjectId) => {
        if (isDirector())
            return true;

        if (isTeacher()) {
            if (user.classrooms.includes(classroomId) && user.subjects.includes(subjectId)) {
                return true;
            }

            return false;
        }

        if (isStudent() || isParent())
            return true;

        return null;
    }

    const canEdit = () => {
        if (user.role.id > 2)
            return true;
        
        return false;
    }

    const getClassroomsToShow = (classrooms) => {
        if (!isLoggedIn())
            return [];

        if (isStudent()) {
            const student = user.student;
            return [student.classroomId];
        }

        if (isParent()) {
            const students = user.students;
            return students.map(student => student.classroomId);
        }

        return classrooms.map(classroom => classroom.id);
    }

    const value = {
        user,
        users,
        changeUser,
        isLoggedIn,
        isStudent,
        isParent,
        isTeacher,
        isDirector,
        canShowDetail,
        canEdit,
        getClassroomsToShow
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