import { useEffect, useRef, useState } from "react";
import { BalanceCard } from "../components/userapp/Balancecard";
import { Users } from "../components/Users";
import { OnRampTransactions } from "../components/userapp/OnRampTransactions";
import axios from "axios";
import { BankCard } from "../components/userapp/BankCard";
import { TableCard } from "../components/userapp/TableCard";
import { useGeolocated } from "react-geolocated";
import { update } from "../store/reducers/friendSlice";
import { useDispatch } from "react-redux";
const Dashboard = () => {
    const backendHost = process.env.REACT_APP_BACKENDHOST;
    console.log("backendhost:",backendHost);
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    const [balance, setBalance] = useState(0);
    const [bankBalance, setBankBalance] = useState(undefined);
    const [fdBalence, setFdBalence] = useState(0);
    const [transctions, setTransactions] = useState([]);
    const [accountsNumber, setAccountsNumber] = useState(0);
    const Link = useRef(null);
    const [data,setData] = useState([]);
    const [friendData,setFriendData] = useState([])

    useEffect(() => {
     
        let tk = token
        // checkWalletBalance()
        // if(tk==token) console.log("same token")
        // else console.log("no taoken mathch")
        // getTransactions()
        // getBankAccountNumber()
        // getNviteLink()
        getConnection()
         // Call the function to fetch balance
    }, []);
    
async function  getBankAccountNumber(){
        await axios.post(`${backendHost}api/v1/account/getBankAccountNumber`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        }).then((result) => {
            console.log("res bank accountNumber:",result);
            setAccountsNumber(result.data.accountNumber);
        }).catch((err) => {
            console.log("error:",err)
        });
        // Update the balance state with the value from the response
    }

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
        // let token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U1ODYzOTg0MjVjNDY4MjMyNDIxZTEiLCJpYXQiOjE3NDMxNTM1NjAsImV4cCI6MTc0Mzc1ODM2MH0.6-bJN8KtsvdezQSjXu0mZdDisCiI8LfQhVvDOXDlhcA"
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }
    
            await axios.post(
                backendHost+"api/v1/account/get",{
                // Empty body (if needed)
                headers: {
                    Authorization: "Bearer " + token,
                },}
            ).then(function(response) {
                
                console.log("res transctions:",response);
                setTransactions(response.data.transactions);
            })
            .catch(function(err) {
                console.log("error:",err)
            })
            
            // ).then((result) => {
            //     console.log("res transctions:",result);
            //     setTransactions(result.data.transactions);
                
            // }).catch((err) => {
            //     console.log("error:",err)
            // });
            
           
       
    }
    function getBankbalance(){
        console.log("getBankbalance")
        if (!localStorage.getItem("bankBalance")) {
            localStorage.setItem("bankBalance",10000)
            setBankBalance(10000)
            
        } else {
            setBankBalance(localStorage.getItem("bankBalance"))
        }
    }
  async function getNviteLink() {
    if (!token) {
        console.error("No token found in localStorage");
        return;
    }
    console.log("link: " +backendHost+"api/v1/network/getRefferlink");
    const response = await axios.get(
        backendHost+"api/v1/network/getRefferlink",{
        // Empty body (if needed)
        headers: {
            Authorization: "Bearer " + token,
        },}
    ).then((result) => {
        console.log("res link:",result.data.link);
        Link.current = result.data.link;
        console.log("ref link:",Link.current)
        
    }).catch((err) => {
        console.log("error:",err)
    });
    
  }
  async function getConnection() {
    if (!token) {
        console.error("No token found in localStorage");
        return;
    }
    const response = await axios.post(backendHost + "api/v1/network/getConnection",
        {
        // Empty body (if needed)
        headers: {
            Authorization: "Bearer " + token,
        },}
    )
    .catch((err) => {
        console.log("error:",err)
    });
     // Update the balance state with the value from the response
    let data = response.data
    let dat1 = []
     data.forEach((user) => {
        dat1.push(
    {
        "Logo": {value:user.logo,vstyle:"bg-red ml-[15px]" },
        "Userame":{hstyle: "w-[8px]",value:user.username,vstyle:"pl-[20px]"},
        "Full name":{vstyle: "w-[143px]",value:user.fullname},
        "Upi ID":{style: "",value:user.upId},
        "Button": {vstyle:"text-[7px] p-[3px]"},
}
        )
  });
  setFriendData(dat1)
  dispatch(update(data))
    }


    let addstyle = "w-[298px] rounded-[20px] border border-black/10 p-4";
    return (
        <div>
            <div className="m-8">
                <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold mt-[-20px]">
                    Dashboard
                </div>
                <div className="flex gap-[52px] w-full">
                    <BalanceCard style={addstyle} amount={balance} locked={fdBalence} />
                    
                    <OnRampTransactions style={addstyle} title={"Recent Two Transactions"}  data={transctions} />
                        {console.log("bank---balence:",bankBalance)}
                    <BankCard style={addstyle} title={"Your Linked Bank"}  bal={bankBalance} clk={getBankbalance} acn={accountsNumber}/>

                </div>
                <div className="mt-10 ">
                    <TableCard opt={friendData} style={"rounded-[20px] border border-black/10 p-4 h-[32vh]" } addoptions={{"logo":true,"button":true}}  errmessge={"!oops you do not  have any friend. Send money to add friend"} nvite={Link.current}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
