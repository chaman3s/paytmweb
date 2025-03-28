import { useEffect, useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import Button from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGeolocated } from "react-geolocated";

export default function Signup() {
 
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobileno, setMobileno] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();
  const backendHost = process.env.REACT_APP_BACKENDHOST;
  console.log("backendhost:",backendHost);

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (coords) {
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    }
  }, [coords]);

  useEffect(() => {
    async function CheckUsernameAvailability() {
      if (username.length > 2) {
        setErrors({});
        try {
          const response = await axios.post(`${backendHost}api/v1/auth/Checkusername`, {
            username,
          });

          if (response.status === 400) {
            setErrors({ serverError: "Username already exists" });
          }
        } catch (error) {
          setErrors({ server: "Signup failed. Please try again." });
        }
      }
    }
    CheckUsernameAvailability();
  }, [username]);

  const validateInputs = () => {
    let validationErrors = {};
    if (!firstname) validationErrors.firstname = "First name is required";
    if (!lastname) validationErrors.lastname = "Last name is required";
    if (!mobileno) validationErrors.mobileno = "Phone number is required";
    if (!username) validationErrors.username = "Username is required";
    if (!password) validationErrors.password = "Password is required";
    if (!location.latitude || !location.longitude)
      validationErrors.location = "Location permission is required";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSignup = async () => {
    setErrors({});
    console.log('Signup')
    if (!validateInputs()) return;
    

    try {
      const response = await axios.post(`${backendHost}api/v1/auth/signup`, {
        username,
        firstname,
        lastname,
        password,
        mobileno,
        location, // Send location to backend
      });

      if (response.status === 201) {
        navigate("/signin");
      }
    } catch (error) {
      setErrors({ server: "Signup failed. Please try again." });
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />

          {errors.server && <div className="text-red-500 text-sm mb-2">{errors.server}</div>}

          <InputBox onChange={(e) => setFirstname(e.target.value)} placeholder="John" label={"First Name"} />
          {errors.firstname && <div className="text-red-500 text-sm">{errors.firstname}</div>}

          <InputBox onChange={(e) => setLastname(e.target.value)} placeholder="Doe" label={"Last Name"} />
          {errors.lastname && <div className="text-red-500 text-sm">{errors.lastname}</div>}

          <InputBox onChange={(e) => setMobileno(e.target.value)} placeholder="1112222333" label={"Mobile Number"} />
          {errors.mobileno && <div className="text-red-500 text-sm">{errors.mobileno}</div>}

          <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="user1" label={"Username"} />
          {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}

          <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="password" label={"Password"} />
          {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}

          {errors.location && <div className="text-red-500 text-sm">{errors.location}</div>}

          <div className="pt-4">
            <Button onClick={handleSignup} label={"Sign up"} />
          </div>

          <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
        </div>
      </div>
    </div>
  );
}
