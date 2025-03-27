import { useEffect, useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import Button from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  useEffect(()=>{async function Checkusernameavailable(params) {
    
  
    if(username.length>2){
      setErrors({});
      try {
        const response = await axios.post("https://paytmweb.vercel.app/api/v1/auth/Checkusername", {
          username,
        });
        if(response.status==400){
          setErrors({ serverError: "username already exists"});
          
        }
       console.log("re:",response)
        
      }
      
        catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            setErrors({ server: error.response.data.message });
          } else {
            setErrors({ server: "Signup failed. Please try again." });
          }
        }}
    
  } Checkusernameavailable();},[username])

  const validateInputs = () => {
    let validationErrors = {};
    if (!firstname) validationErrors.firstname = "First name is required";
    if (!lastname) validationErrors.lastname = "Last name is required";
    if (!phone) validationErrors.phone = "phone is required";
    if (!username) validationErrors.username = "Username is required";
    if (!password) validationErrors.password = "Password is required";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
 
    
   

  const handleSignup = async () => {
    if(username.length>3){
    setErrors({});
    if (!validateInputs()) return;

    try {
      const response = await axios.post("https://paytmweb.vercel.app/api/v1/auth/signup", {
        username,
        firstname,
        lastname,
        password,
        phone,
       
      });

      if (response.status === 201) {
        navigate("/signin");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrors({ server: error.response.data.message });
      } else {
        setErrors({ server: "Signup failed. Please try again." });
      }
    }}
    else  setErrors({ server: "user must be more than 3 charector" })
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />

          {errors.server && <div className="text-red-500 text-sm mb-2">{errors.server}</div>}

          <InputBox onChange={(e) => setfirstname(e.target.value)} placeholder="John" label={"First Name"} />
          {errors.firstname && <div className="text-red-500 text-sm">{errors.firstname}</div>}

          <InputBox onChange={(e) => setlastname(e.target.value)} placeholder="Doe" label={"Last Name"} />
          {errors.lastname && <div className="text-red-500 text-sm">{errors.lastname}</div>}

          <InputBox onChange={(e) => setPhone(e.target.value)} placeholder="1112222333" label={"Moblie Number"} />
          {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}

          <InputBox onChange={(e) => {setUsername(e.target.value) ;}} placeholder="user1" label={"Username"} />
          {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}

          <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="password" label={"Password"} />
          {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}

          <div className="pt-4">
            <Button onClick={handleSignup} label={"Sign up"} />
          </div>

          <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
        </div>
      </div>
    </div>
  );
}
