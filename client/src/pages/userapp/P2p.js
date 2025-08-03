import { TableCard } from "../../components/userapp/TableCard";
import { SendCard } from "../../components/userapp/SendCard";
import { useDispatch } from 'react-redux'
import { setNumber } from "../../store/reducers/userSlice";

export default function() {
    const dispatch = useDispatch ()

    
  
    let addstyle = {con:"w-[96%] h-[300px] rounded-[20px] border border-black/10 p-4 ",div:"overflow-y-scroll h-[200px] mx-[10px]"};
    let data=[{
       "Logo": {value:"U",vstyle:"bg-red ml-[13px] mr-[10px]" },
       "Userame":{hstyle: "w-[8px]",value:"User1"},
       "Full name":{vstyle: "w-[161px]",value:"Chaman Aggarwal"},
       "Phone no":{vstyle: "w-[160px]",value:"+91 9354862574"},

}]
function handleclick(number){
    console.log(number["Phone no"].value.split(" ")[1])

  dispatch(setNumber(number["Phone no"].value.split(" ")[1]))

}
    return <div className="mt-8 ml-12">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 ml-16  font-bold">
                P2P Transfer
        </div>
        <div className="flex gap-3 ml-[65px]">
            <div><SendCard /></div>
            <div className="mt-8 overflow-hidden"><TableCard style={addstyle} opt={data} addoptions={{"logo":true,"button":true}} thlist={data[0]} isTableIteamClickAble={{bool:true,fun: handleclick}}/></div>
            
        </div>
         </div>
}