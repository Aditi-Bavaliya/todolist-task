import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import ToDoList from "./TodoList";
import { useFirebase } from "./firebase";

const Routers = () => {
    const Firebase = useFirebase();
    const [loggedInUser, setLoggedInUser] = useState(false);
    useEffect(() => {
        const userState = Firebase.loggedInUser();
        setLoggedInUser(userState);
    }, [Firebase])

    return (
        <>
            <Routes>
                <Route path="/" element={<SignUp />}></Route>
                <Route path="/login" element={loggedInUser ? (<Navigate to="/todo-list" />) : (<Login />)}></Route>
                <Route path="/todo-list" element={loggedInUser ? <ToDoList /> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    )

}
export default Routers