import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where, writeBatch, } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyD1kTtpN-vAwkkMBTaCejxQOqAafM-EQuw",
  authDomain: "todolist-25.firebaseapp.com",
  databaseURL: "https://todolist-25-default-rtdb.firebaseio.com",
  projectId: "todolist-25",
  storageBucket: "todolist-25.appspot.com",
  messagingSenderId: "431034328595",
  appId: "1:431034328595:web:9b16c6fda1fc35458d01e6"
};

const FirebaseApp = initializeApp(firebaseConfig);
const Auth = getAuth(FirebaseApp);
const DbStore = getFirestore(FirebaseApp)

const FirebaseContext = createContext(null);

export const useFirebase = () => {
    return useContext(FirebaseContext);
}

export const FirebaseProvider = (props) => {

    const [user, setUser] = useState(null);
    const [dragTask, setDragTask] = useState("");

    useEffect(() => {
        const Authentication = onAuthStateChanged(Auth, (authUser, user) => {
            if (authUser === user) {
                console.log(authUser)
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => Authentication();
    }, []);

    const handleSignUp = async (email, password) => {
        try {
            const userInfo = await createUserWithEmailAndPassword(Auth, email, password);
            if (userInfo) {
                UserInStore(userInfo.user);
                alert('User Signup Successful');
            }
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const userInfo = await signInWithEmailAndPassword(Auth, email, password);
            if (userInfo) {
                setUser(userInfo.user)
                // alert('User Logged-in Successful')
            }
        } catch (error) {
            alert(error)
            console.error(error.message);
        }
    }
    const loggedInUser = () => {
        return user;
    }


    const handleSignOut = async () => {
        try {
            await signOut(Auth);
            setUser(null);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    async function getClientIP() {
        try {
          const response = await fetch("https://api.ipify.org?format=json");
          const data = await response.json();
          const ip = data.ip;
          return ip;
        } catch (error) {
          console.error("Error fetching client IP:", error.message);
          return null;
        }
      }

    const UserInStore = async (authUser) => {
        try {
            if (authUser && authUser.email && authUser.uid) {

                const ip = await getClientIP();
                const userRef = collection(DbStore, "users");
                await addDoc(userRef, {
                    email: authUser.email,
                    password: authUser.reloadUserInfo.passwordHash,
                    uid: authUser.uid,
                    ip: ip,
                    createdAt: serverTimestamp(),
                })
                console.log(authUser)
                console.log('user Store in FireStore')
                window.location.href = "/login"
                }
        } catch (error) {
            console.error(error.message);
        }
    }

    const addTodoInStore = async (authUser, todoTitle) => {
        if (!authUser || todoTitle === undefined) {
            return;
        }
        try {
            const userTodo = collection(DbStore, "TodoLists")
            const querySnapshot = await getDocs(
                query(userTodo, where("userId", "==", authUser))
            );
            const titles = querySnapshot.docs.map(doc => doc.data().title);
    
            if (titles.includes(todoTitle)) {
                alert("Todo title already exists.");
            }else{
                await addDoc(userTodo, {
                    userId: authUser,
                    userEmail : user.email,
                    title: todoTitle,
                    createdAt: serverTimestamp(),
                    updateAt : serverTimestamp(),
                })
                console.log("ToDo created in DbStore")
            }
           
        }
        catch (error) {
            console.error("todo not created", error.message);
        }
    }

    const getTodoInStore = async (authUser) => {
        if (!authUser) {
            console.log("No user to get todo")
            return;
        }
        try {
            const dataBase = collection(DbStore, "/TodoLists")
            const q = query(dataBase, where("userId", "==", authUser))
            const querySnapshot = await getDocs(q)
            const lists = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
            }))
            return lists;
        }
        catch (error) {
            console.error("todo not Found", error.message);
        }
    }

    const addTasksInTodo = async (
        authUser,
        taskTitle,
        taskDescription,
        taskDueDate,
        taskPriority,
        todoTitle,
        TodoId,
    ) => {
        try {
            const userTasks = collection(DbStore, "Tasks");
            await addDoc(userTasks, {
                userId: authUser,
                userEmail: user.email,
                title: taskTitle,
                description: taskDescription,
                dueDate: taskDueDate,
                priority: taskPriority,
                todoList: todoTitle,
                todoId : TodoId,
                createdAt: serverTimestamp(),
                updateAt : serverTimestamp(),
            })
            console.log("Task created in DbStore")
        } catch (error) {
            console.log(error.message)
        }
    }


    const getTasksFromStore = async (userId, todoList) => {
        if (!userId) {
            console.log("No user to get todo")
            return;
        }
        try {
            const dataBase = collection(DbStore, "Tasks")
            const q = query(dataBase, where("userId", "==", userId), where("todoList", "==", todoList))
            const querySnapshot = await getDocs(q)
            const lists = querySnapshot.docs.map((doc) => {
                const taskData = doc.data();
                return {
                    id: doc.id || "",
                    title: taskData.title || "",
                    description: taskData.description || "",
                    dueDate: taskData.dueDate || "",
                    priority: taskData.priority || "",
                    todoList: taskData.todoList || "",
                };
            }
            )
            return lists;
        }
        catch (error) {
            console.error("todo not Found", error.message);
        }
    }
    
    const updateAfterDragAndDrop = async (newTodoList) => {
        if (!dragTask) {
            console.error("data is not there");
            return;
          }
        try {
            const q = query(collection(DbStore, 'Tasks'));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(DbStore);
                   
            querySnapshot.forEach((doc) => {
                if (doc.id === dragTask.id) {
                    console.log(doc.id)
                    console.log(dragTask.id)
                    batch.update(doc.ref, { todoList: newTodoList });
                }
            });    
            await batch.commit();
            console.log("Firebase update success");
            setDragTask("")
            } catch (error) {
            console.error("Failed to update FireStore", error.message);
            throw error;
        }
    };

    
    const updatePriorityAfterDrag = async (newPriority) => {
        if (!dragTask) {
            console.error("data is not there");
            return;
          }
        try {
            const q = query(collection(DbStore, 'Tasks'));
            const querySnapshot = await getDocs(q);
            const batch = writeBatch(DbStore);
                   
            querySnapshot.forEach((doc) => {
                if (doc.id === dragTask.id) {
                    console.log(doc.id)
                    console.log(dragTask.id)
                    batch.update(doc.ref, { priority: newPriority });
                }
            });    
            await batch.commit();
            console.log("Firebase update success");
            setDragTask("")
            } catch (error) {
            console.error("Failed to update FireStore", error.message);
            throw error;
        }
    };
    
    const handleDragStart = (e, task) => {
        setDragTask(task)
      }
    
    useEffect(() => {}, [dragTask]);


    return (
        <FirebaseContext.Provider
            value={{
                handleSignUp,
                handleLogin,
                handleSignOut,
                loggedInUser,
                addTodoInStore,
                getTodoInStore,
                addTasksInTodo,
                getTasksFromStore,
                updateAfterDragAndDrop,
                handleDragStart,
                updatePriorityAfterDrag,                
            }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}

