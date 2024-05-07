import React, { useEffect, useState } from "react";
import { useFirebase } from "./firebase";
import ToDo from "./Todo";
import Priority from "./Priority-sec";

const ToDoList = () => {
    const [newListTitle, setNewListTitle] = useState('');
    const [lists, setLists] = useState([]);
    const Firebase = useFirebase();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const fetched = await Firebase.getTodoInStore(
                    Firebase.loggedInUser()?.uid)
                    if (Array.isArray(fetched)) {
                        setLists(fetched);
                      } else {
                        console.error("Fetched ToDo lists is not an array.");
                      }
            }
            catch (error) {
                console.log('Todo not found', error.message)
            }
        }
        fetchLists();
    }, [Firebase])

    const addLists = async () => {
        if (newListTitle.trim() !== '') {
            try {
                await Firebase.addTodoInStore(
                    Firebase.loggedInUser()?.uid,
                    newListTitle);
                setNewListTitle("");
                const updatedLists = await Firebase.getTodoInStore(Firebase.loggedInUser()?.uid);
                setLists(updatedLists || []);
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }
    return (
        <>
            <div className="main-page">
                <div className="add-list-sec">
                    <div className="add-list">
                        <input
                            type="text"
                            placeholder="Todo list"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                        />
                        <button onClick={addLists} >Add Todo List</button>
                    </div>
                    <button className="logout" onClick={(e) => {
                        e.preventDefault();
                        Firebase.handleSignOut();
                    }}>Logout</button>
                </div>
                <div className="Priority-section">
                    <Priority title="High Priority" Priority="high"/>  
                    <Priority title="Medium Priority" Priority="medium"/>
                    <Priority title="Low Priority" Priority="low"/>
                    
                </div>

                <div className="show-todo">
                    {lists.map((list, index) => (
                        <ToDo key={index} ListName={list.title} id={list.id}></ToDo>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ToDoList;