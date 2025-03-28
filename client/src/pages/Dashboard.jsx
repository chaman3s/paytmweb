import { useEffect, useState } from "react";
import { BalanceCard } from "../components/userapp/Balancecard";
import { Users } from "../components/Users";
import { OnRampTransactions } from "../components/userapp/OnRampTransactions";
import axios from "axios";
import { BankCard } from "../components/userapp/BankCard";
import { TableCard } from "../components/userapp/TableCard";
import { useGeolocated } from "react-geolocated";

const Dashboard = () => {
//     const backendHost = process.env.REACT_APP_BACKENDHOST;
//     console.log("backendhost:",backendHost);

//     const [balance, setBalance] = useState(0);
//     const [data,setData] = useState([]);

//     useEffect(() => {
//         async function checkBalance() {
//             try {
//                 let response = await axios.get(`${backendHost}api/v1/account/balance`, {
//                     headers: {
//                         Authorization: "Bearer " + localStorage.getItem("token"),
//                     },
//                 });
//                 console.log("res:", response.data.message);

//                 // Update the balance state with the value from the response
//                 setBalance(response.data.balance);
//             } catch (error) {
//                 console.error("Error fetching balance:", error);
//             }
//         }

//     //     checkBalance(); // Call the function to fetch balance
//     // }, [backendHost]);

//     let addstyle = "w-[298px] rounded-[20px] border border-black/10 p-4";
    let data1 =[ {
        "Logo": {value:"U",vstyle:"bg-red ml-[13px]" },
        "Userame":{hstyle: "w-[8px]",value:"User1"},
        "Full name":{vstyle: "w-[143px]",value:"Chaman Aggarwal"},
        "Upi ID":{style: "",value:Date.now()+".upi"},
        "Bank name":{vstyle:  "w-[122px]",value:"Dummy bank"},
        "mobile no":{vstyle: "w-[122px]",value:"+91 9354862574"},
        "Locations":{style: "",value:"Delhi,India"},
        "Button": {vstyle:"text-[7px] p-[3px]"},
}]
//     return (
//         <div>
//             <div className="m-8">
//                 <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold mt-[-20px]">
//                     Dashboard
//                 </div>
//                 <div className="flex gap-[52px] w-full">
//                     <BalanceCard style={addstyle} amount={10000} locked={0} />
//                     <OnRampTransactions style={addstyle} title={"Recent Two Transactions"} />
//                     {/* <OnRampTransactions style={"w-[298px]"} title={"Top Two Transactions"} /> */}
//                     <BankCard style={addstyle} title={"Your Linked Bank"} />

//                 </div>
//                 <div className="mt-10 ">
//                     <TableCard opt={data} style={"rounded-[20px] border border-black/10 p-4 h-[32vh]" } addoptions={{"logo":true,"button":true}} />
//                 </div>
//             </div>
//         </div>
//     );
};

export default Dashboard;
