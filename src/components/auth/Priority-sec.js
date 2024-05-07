import React from "react";
import { useFirebase } from "./firebase";
const Priority = (props) => {

const Firebase = useFirebase();
    const ondragover = (e) => {
        e.preventDefault();
      }

    const onDrop =async (e, Priority)=>{
        e.preventDefault();   
        try {
        await Firebase.updatePriorityAfterDrag(Priority); 
        } catch (error) {
          console.error("Error updating task list:", error.message);
      }
    }

    return (
        <div className="main-priority" onDragOver={ondragover} onDrop={(e)=>{onDrop(e, props.Priority)}}>
         <h1>{props.title}</h1>
        </div>
    )

}

export default Priority;