import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export const Dashboard = () => {
    const backendHost = process.env.REACT_APP_BackendHost;
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        async function checkBalance() {
            try {
                let response = await axios.get(`${backendHost}account/balance`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                console.log("res:", response.data.message);

                // Update the balance state with the value from the response
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        }

        checkBalance(); // Call the function to fetch balance
    }, [backendHost]);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
};
