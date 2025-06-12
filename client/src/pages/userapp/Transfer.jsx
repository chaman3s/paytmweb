import React, { useEffect, useState } from "react";
import axios from "axios";
import { AddMoney } from "../../components/userapp/AddMoney";
import { BalanceCard } from "../../components/userapp/Balancecard";
import { OnRampTransactions } from "../../components/userapp/OnRampTransactions";

const token = "your_jwt_token"; // Replace with actual token

function Transfer() {
    
    const [balance, setBalance] = useState({ amount: 0, locked: 0 });
    const [transactions, setTransactions] = useState([]);
    let addstyle ={com:"rounded-[20px] border border-black/10 p-4" ,div:"overflow-y-scroll h-[200px]"}

    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/balance`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setBalance(res.data))
            .catch(err => console.error(err));

        axios.get(`http://localhost:5000/api/user/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setTransactions(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="w-[78vw] m-8">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transfer
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div>
                    <AddMoney style={addstyle } />
                </div>
                <div>
                    <BalanceCard style={addstyle +" w-[298px] "} amount={balance.amount} locked={balance.locked} />
                    <div className="pt-4">
                        <OnRampTransactions style={addstyle+" w-[298px]"}transactions={transactions} title={"Recent Transactions"}  />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transfer;
