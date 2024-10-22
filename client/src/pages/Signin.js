import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export  default  function Signin (){
  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const backendHost= process.env.REACT_APP_BackendHost
    async function handleclick() {
      const response = await axios.post(backendHost+"auth/signin", {
        username,
        password
      });
      
    
      localStorage.setItem("isLoggedIn", true); // Mark user as logged in
    navigate("/dashboard"); 
    }
    return(<div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="user" label={"username"} onChange={e => {
          setUsername(e.target.value);
        }}/>
        <InputBox placeholder="123456" label={"Password"} 
        onChange={e => {
          setPassword(e.target.value);
        }}/>
        <div className="pt-4">
          <Button label={"Sign in"}  onClick={handleclick}/>
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/"} />
      </div>
    </div>
  </div>);
}