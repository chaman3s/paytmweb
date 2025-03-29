import { useState } from "react";
import { Card } from "../Card";
import Button from "../Button";

export const TableCard = ({ name, title, style, opt, addoptions, errmessge ,nvite}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const inviteLink = nvite; // Replace with actual invite link
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    
    setTimeout(() => setCopied(false), 5000); // Reset after 5 seconds
  };

  if (!opt || opt.length === 0) {
    return (
      <Card style={style} title={name}>
        <div className="text-center pb-8 pt-8">{errmessge}</div>
        {nvite && (
          <button 
            onClick={handleCopy} 
            disabled={copied}
            className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {copied ? "Copied!" : "Invite"}
          </button>
        )}
      </Card>
    );
  }

  return (
    <Card style={style} title={title || "Your Network"}>
      <div className="pt-2 overflow-hidden relative">
        <table className="w-full border-collapse border border-gray-300 overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(opt[0]).map((key, index) => (
                <th key={index} className={"w-16 p-2 border border-gray-300 " + (opt[0][key]["hstyle"] || "")}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-hidden">
            {opt.map((group, groupIndex) => (
              <tr className="border border-gray-300" key={groupIndex}>
                {Object.keys(group).map((key, keyIndex) => (
                  key === "Logo" ? (
                    <td key={`${groupIndex}-${keyIndex}`} className="p-2 border border-gray-300">
                      <div className={"rounded-full h-8 w-8 bg-slate-200 flex justify-center items-center " + (group[key].vstyle || "")}>
                        {group[key].value}
                      </div> 
                    </td>
                  ) : key === "Button" ? (
                    <td key={`${groupIndex}-${keyIndex}`} className="p-2 border border-gray-300">
                      <Button label="Send Money" style={"text-[9px] p-[3px] mt-[6px] " + (group[key].vstyle || "")} />
                    </td>
                  ) : (
                    <td key={`${groupIndex}-${keyIndex}`} className={"p-2 border border-gray-300 " + (group[key].vstyle || "")}>
                      {group[key].value}
                    </td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Invite Button at Bottom Right */}
        {nvite && (
          <button 
            onClick={handleCopy} 
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
