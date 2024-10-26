import { useState } from "react";
import { useDispatch } from "react-redux";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUsername } from "../store/reducers/userSlice"; // Import the action to set the username

export default function Signin() {
    const [username, setUsernameInput] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const backendHost = process.env.REACT_APP_BackendHost;

    async function handleClick() {
        try {
            const response = await axios.post(`${backendHost}auth/signin`, {
                username,
                password
            });

            if (response.status === 200) {
                console.log(response);
                localStorage.setItem("token", response.data.token);

                // Update username in Redux store
                dispatch(setUsername(username));

                // Navigate to dashboard
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox
                        placeholder="user"
                        label={"Username"}
                        onChange={(e) => setUsernameInput(e.target.value)}
                    />
                    <InputBox
                        placeholder="123456"
                        label={"Password"}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pt-4">
                        <Button label={"Sign in"} onClick={handleClick} />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/"} />
                </div>
            </div>
        </div>
    );
}
