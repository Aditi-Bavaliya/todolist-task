import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useFirebase } from "./firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Firebase = useFirebase();
  return (

    <div >
      <form action="" className="signup-container">
        <h2>Login</h2>
        <input type="email" name="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" name="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          Firebase.handleLogin(email, password)
        }}>Login</button>
        <p>Don't have account? <NavLink className='navLink' to="/">SignUp</NavLink> </p>
      </form>
    </div>
  )
}
export default Login;