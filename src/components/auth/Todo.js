import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import Task from "./Task";
import { useFirebase } from "./firebase";
const ToDo = (props) => {

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const Firebase = useFirebase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getTasks = await Firebase.getTasksFromStore(
          Firebase.loggedInUser()?.uid,
          props.ListName);
        setTaskList(getTasks);
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchData();
  }, [Firebase, props.userId, props.ListName]);


  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
  };

  const updateCurrentTasks = async () => {
    try {
      const getTasks = await Firebase.getTasksFromStore(
        Firebase.loggedInUser()?.uid,
        props.ListName);
      setTaskList(getTasks);
    } catch (error) {
      console.log(error.message)
    }
  }

  const onDragOver = (e) => {
    e.preventDefault();
  }
  
  const onDrops = async (e, todoList) => {
    e.preventDefault();   
          try {
          Firebase.updateAfterDragAndDrop(todoList);
          updateCurrentTasks();    
          console.log("Success: Task list updated");             
          } catch (error) {
            console.error("Error updating task list:", error.message);
        }
    }
  
  return (
    <>
      <div className="main-todo" onDragOver={onDragOver} onDrop={(e)=>onDrops(e, props.ListName)}>
        <div className="heading">
          <h1>{props.ListName}</h1>
          <button onClick={toggleTaskForm}>Add Task</button>
          {
            showTaskForm &&
            <TodoForm
              ListName={props.ListName}
              todoId={props.id}
              toggleForm={toggleTaskForm}
              show={showTaskForm}
              updateTasks={updateCurrentTasks} />
          }
        </div>
        {taskList.map((task, keys) => (
          <Task
            TaskTitle={task.title}
            TaskDescription={task.description}
            TaskDueDate={task.dueDate}
            TaskPriority={task.priority}
            todoList ={task.todoList}
            key={keys}
            id={task.id}
            ></Task>
        ))}
      </div>
    </>

  )
}
export default ToDo;