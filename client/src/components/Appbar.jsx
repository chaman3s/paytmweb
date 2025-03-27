import { useSelector } from "react-redux";
import Button from "./Button";

 export const Appbar = ({btn}) => {
    // Get the username from the Redux store
    const username = useSelector((state) => state.user.username);
    const initial = username ? username.charAt(0).toUpperCase() : 'U';
    console.log(btn)
    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4 text-[#6a51a6]  font-semibold">
                PayTM App
            </div>
            {btn && (
  <div className="mr-2.5 mt-2">
    <Button label="LogOut" />
  </div>
)}
        </div>
    );
};
