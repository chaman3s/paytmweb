import { useEffect, useState } from "react";
import { BalanceCard } from "../components/userapp/Balancecard";
import { Users } from "../components/Users";
import { OnRampTransactions } from "../components/userapp/OnRampTransactions";
import axios from "axios";
import { BankCard } from "../components/userapp/BankCard";
import { TableCard } from "../components/userapp/TableCard";
import { useGeolocated } from "react-geolocated";

const Dashboard = () => {
    const backendHost = process.env.REACT_APP_BACKENDHOST;
    console.log("backendhost:",backendHost);
    const token = localStorage.getItem("token");

    const [balance, setBalance] = useState(0);
    const [fdBalence, setFdBalence] = useState(0);
    const [transctions, setTransactions] = useState([]);

    const [data,setData] = useState([]);

    useEffect(() => {
        let tk = token
        checkWalletBalance()
        if(tk==token) console.log("same token")
        else console.log("no taoken mathch")
        getTransactions()

         // Call the function to fetch balance
    }, []);
   
 async function checkWalletBalance() {
        
            await axios.get(`${backendHost}api/v1/account/balance`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }).then((result) => {
                console.log("res wallwts:",result);
                setBalance(result.data.balance*100);
                setFdBalence(result.data.lockbalance*100);
            }).catch((err) => {
                console.log("error:",err)
            });
            
            // Update the balance state with the value from the response
      
    }
     
async function getTransactions() {
        let token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U1ODYzOTg0MjVjNDY4MjMyNDIxZTEiLCJpYXQiOjE3NDMxNTM1NjAsImV4cCI6MTc0Mzc1ODM2MH0.6-bJN8KtsvdezQSjXu0mZdDisCiI8LfQhVvDOXDlhcA"
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }
    
            const response = await axios.get(
                "http://localhost:8080/api/v1/account/getTransactions",{
                // Empty body (if needed)
                headers: {
                    Authorization: "Bearer " + token,
                },}
            ).then((result) => {
                console.log("res transctions:",result);
                setTransactions(result.data.transactions);
                
            }).catch((err) => {
                console.log("error:",err)
            });
            
           
       
    }
    
    // Update the balance state with the value from the response



    let addstyle = "w-[298px] rounded-[20px] border border-black/10 p-4";
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
    return (
        <div>
            <div className="m-8">
                <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold mt-[-20px]">
                    Dashboard
                </div>
                <div className="flex gap-[52px] w-full">
                    <BalanceCard style={addstyle} amount={balance} locked={fdBalence} />
                    
                    <OnRampTransactions style={addstyle} title={"Recent Two Transactions"}  data={transctions}/>
                    {/* <OnRampTransactions style={"w-[298px]"} title={"Top Two Transactions"} /> */}
                    <BankCard style={addstyle} title={"Your Linked Bank"} />

                </div>
                <div className="mt-10 ">
                    <TableCard opt={data} style={"rounded-[20px] border border-black/10 p-4 h-[32vh]" } addoptions={{"logo":true,"button":true}} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
