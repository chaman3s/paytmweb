import { TableCard } from "../../components/userapp/TableCard";

export default function Transaction(){
    let addstyle = "w-full rounded-[20px] border border-black/10 p-4";
    let data = [{
        "Value Date" :{hstyle: "w-[89px]",value:"21-01-2025"},
       "Post Date":{hstyle: "w-[89px]",value:"21-01-2025"},
       "Payment Method": {style: "",value:Date.now()+"upi"},
        "Description":{style: "",value:"tarnfer to user1"},
        "Bank name":{hstyle: "w-[97px]",value:" dummy bank"},
       "Amount": {vstyle: "text-red-500",value:"-1000 Dr"},
        "Status":{vstyle: "text-green-700 ",value:"success"},
        "Currency":  {style: "",value:"INR"},
        "Balance":{style: "",value:"2000"}},
        {
            "Value Date" :{hstyle: "w-[75px]",value:"21-01-2025"},
           "Post Date":{hstyle: "w-[75px]",value:"21-01-2025"},
           "Payment Method": {style: "",value:Date.now()+"upi"},
            "Description":{style: "",value:"tarnfer to user1"},
            "Bank name":{style: "",value:" dummy bank"},
           "Amount": {vstyle: "text-green-500",value:"+1000 Cr"},
            "Status":{vstyle: "text-green-700",value:"success"},
            "Currency":  {style: "",value:"INR"},
            "Balance":{style: "",value:"2000"}}]
    
    return (
        <div>
            <div className="m-8">
                <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold mt-[-20px]">
                    Transactions
                </div>
                <div>
                <TableCard style={addstyle} title={"Last 30 days transactions"} opt={data} addoptions={{"logo":false,"button":false}}/>
                </div>
            </div>
        </div>
    );
}