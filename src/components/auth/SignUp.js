import React, { useState } from "react";
import { NavLink } from 'react-router-dom'
import { useFirebase } from "./firebase";

const SignUp = () => {

  const Firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <form action="" className="signup-container">
        <h2>SignUp</h2>
        <input type="email" name="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" name="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          Firebase.handleSignUp(email, password)
        }}>SignUp</button>
        <p>Already have an account? <NavLink className='navLink' to="/login">Login</NavLink></p>
      </form>
    </div>
  )
}
export default SignUp;