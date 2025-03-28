import { useEffect, useState } from "react"
import Button  from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const Users = () => {
    // Replace with backend call
   

    // useEffect(() => {
    //     axios.get("https://paytmweb.vercel.app/api/v1/auth/bulk?filter=" + filter)
    //         .then(response => {
    //             setUsers(response.data.user)
    //         })
    // }, [filter])

    return (
        <div>
                    </div>
    )
      
}

function User({user}) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.username}
                </div>
            </div>
            
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={(e) => {
                navigate("/send?id=" + user._id + "&name=" + user.username);
            }} label={"Send Money"} />
        </div>
    </div>
}