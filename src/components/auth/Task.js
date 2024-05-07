import React from "react";
import { useFirebase } from "./firebase";
const Task = (props) => {

    const Firebase = useFirebase();
    return (
        <div className="tasks"
           draggable
           onDragStart={(e)=>{Firebase.handleDragStart(e, props)  
           }}>
                <div className="task-head">
                    <p><b>Title:-</b>{props.TaskTitle}</p>
                    <p><b>Priority:- </b>{props.TaskPriority}</p>
                </div>
                <p><b>Description:-</b>{props.TaskDescription}</p>
                <p><b>Due Date:-</b>{props.TaskDueDate}</p>      
        </div>
    )
}
export default Task;