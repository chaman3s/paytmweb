import { useEffect, useState } from "react";
import { TableCard } from "../../components/userapp/TableCard";
import { useGetDataHook } from "../../hooks/useGetData";

export default function Transaction() {
    const fun = (res, data, setData) => {
        if (!res?.transactions) return;

        const dt = res.transactions.slice().reverse().map((ele, index) => {
            const isDebit = ele.transactionType === "Debit";

            return {
                "Value Date": {
                    hstyle: "w-[89px]",
                    value: new Date(ele.valueDate).toLocaleDateString("en-GB")
                },
                "Post Date": {
                    hstyle: "w-[89px]",
                    value: new Date(ele.postDate).toLocaleDateString("en-GB") // <-- check if key is postDate
                },
                "Payment Method": {
                    style: "",
                    value: ele.paymentMode
                },
                "Description": {
                    style: "",
                    value: ele.description
                },
                "Bank name": {
                    hstyle: "w-[97px]",
                    value: "dummy bank"
                },
                "Amount": {
                    vstyle: "text-red-500",
                    value: `${isDebit ? "-" : "+"}${ele.amount} ${isDebit ? "Dr" : "Cr"}`
                },
                "Status": {
                    vstyle: "text-green-700",
                    value: ele.status
                },
                "Currency": {
                    style: "",
                    value: "INR"
                },
                "Balance": {
                    style: "",
                    value: ele.currentBalance
                }
            };
        });

        setData(dt);
    };

    const re = useGetDataHook({
        url: "api/v1/account/getTransactions",
        defaultValue: [],
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        callback: fun
    });

    const addstyle = {
        con: "w-full rounded-[20px] border border-black/10 p-4"
    };

    return (
        <div>
            <div className="m-8">
                <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold mt-[-20px]">
                    Transactions
                </div>
                <div>
                    <TableCard
                        style={addstyle}
                        title={"transactions"}
                        opt={re.data}
                        addoptions={{ logo: false, button: false, head: true }}
                    />
                </div>
            </div>
        </div>
    );
}
