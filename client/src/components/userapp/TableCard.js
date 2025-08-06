import { useState } from "react";
import { Card } from "../Card";
import Button from "../Button";
import cp from "../../assets/image/copy.png"
import tk from "../../assets/image/Tick.png"
import { useNavigate } from "react-router-dom";


export const TableCard = ({ name, title, style, opt, addoptions, errmessge ,nvite, isTableIteamClickAble= { bool: false, fun: () => {} } ,btnFun=() => {}}) => {
  const [copied, setCopied] = useState(false);
  const [tick,setTick]= useState(null);
  const navigate= useNavigate();

  const handleCopy = (value) => {
    
    const inviteLink = value; // Replace with actual invite link
    navigator.clipboard.writeText(inviteLink);
    // Reset after 5 seconds
  };

  if (!opt || opt.length === 0) {
    return (
      <Card style={style} title={name}>

        <div className="text-center pb-8 pt-8">{errmessge}</div>
       
        {nvite && (
          <div className="items-center ml-[46%]">
          <button 
            onClick={()=>{ setCopied(true);handleCopy() ;setTimeout(() => setCopied(false), 5000);} }
            disabled={copied}
            className=" w-[20%] bottom-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {copied ? "Copied!" : "Invite"}
          </button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card style={style} title={title || "Your Network"}>
      <div className="pt-2 overflow-hidden ">
        <div>
        <table className="w-full border-collapse border border-gray-300 overflow-hidden">
          {/* <thead className="bg-gray-100">
            <tr>
              {Object.keys(opt[0]).map((key, index) => (
                <th key={index} className={"w-16 p-2 border border-gray-300 " + (opt[0][key]["hstyle"] || "")}>
                  {key}
                </th>
              ))}
            </tr>
          </thead> */}
          <tbody className="overflow-hidden">
            {opt.map((group, groupIndex) => (
              <tr className={`border border-gray-300  hover:border-0 cursor-pointer hover:bg-sky-700  hover:border-sky-700 ${isTableIteamClickAble.bool ? "cursor-pointer " : ""} `} onClick={isTableIteamClickAble.bool ? () => isTableIteamClickAble.fun(group) : undefined} key={groupIndex}>
                {Object.keys(group).map((key, keyIndex) => (
                  key === "Logo" ? (
                    <td key={`${groupIndex}-${keyIndex}`} className="pl-[20px] border border-gray-300  hover:border-sky-700" >
                      <div className={"rounded-full h-8 w-8 bg-slate-200 flex justify-center items-center " + (group[key].vstyle || "")}>
                        {group[key].value}
                      </div> 
                    </td>
                  ) : key === "Button" ? (
                    <td key={`${groupIndex}-${keyIndex}`} className="p-2 border border-gray-300   hover:border-0 ">
                      <Button label={group[key].vLabel} style={"text-[9px] p-[3px] mt-[6px] " + (group[key].vstyle || "")}  clk={()=>btnFun(group[key].vFunPra)}/>
                    </td>
                  ) : key === "Upi ID"?  (
                    <td key={`${groupIndex}-${keyIndex}`} className={`p-2 border border-gray-300  text-center cursor-pointer  hover:border-0  ${group[key].vstyle || ""} ${isTableIteamClickAble.bool?" cursor-pointer":""}` }>
                      {group[key].value}
                      <img src={(tick!==null && tick==`${groupIndex}-${keyIndex}`)?tk:cp} className="inline w-[15px] h-[15px] ml-2" onClick={()=>{setTick(`${groupIndex}-${keyIndex}`); handleCopy(group[key].value); setTimeout(() => setTick(null), 5000); }} />
                    </td>
                  ):(
                    <td key={`${groupIndex}-${keyIndex}`} className={`p-2 border border-gray-300 text-center  hover:border-0   ${group[key].vstyle || ""}`}>
                      {group[key].value}
                    </td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* Invite Button at Bottom Right */}
        {nvite && (
          <button 
            onClick={()=>{ setCopied(true);handleCopy(nvite) ;setTimeout(() => setCopied(false), 5000);} }
            disabled={copied}
            className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {copied ? "Copied!" : "Invite"}
          </button>
        )}
      </div>
    </Card>
  );
};
