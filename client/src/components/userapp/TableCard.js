import { Card } from "../Card";
import Button from "../Button";

export const TableCard = ({ name, title, style, opt, addoptions}) => {
  if (!opt || opt.length === 0) {
    return (
      <Card style={style} title={name}>
        <div className="text-center pb-8 pt-8">No Recent Transactions</div>
      </Card>
    );
  }

  return (
    <Card style={style} title={title || "Your Network"}>
      <div className="pt-2 overflow-hidden">
        <table className="w-full border-collapse border border-gray-300 overflow-hidden">
          {/* Table Header */}
          
          <thead className="bg-gray-100">
            <tr>
            {Object.keys(opt[0]).map((key, index)=> (
                <th key={index} className={"w-16 p-2 border border-gray-300 " + (opt[0][key]["hstyle"] || "")}>{key}</th>
             ))}
         
      
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="overflow-hidden">
          
          {opt.map((group, groupIndex) =>(
          <tr className="border border-gray-300">
            {Object.keys(group).map((key, keyIndex) =>(
           
            (key=="Logo")?<td key={`${groupIndex}-${keyIndex}`} className="p-2 border border-gray-300">
                   <div className={"rounded-full h-8 w-8 bg-slate-200 flex justify-center items-center "+(group[key].vstyle||"")}>
                            {group[key].value}
                     </div> 
               </td>:(key=="Button")?<td className={"p-2 border border-gray-300 "}>
                   <Button label="Send Money" style={"text-[9px] p-[3px] mt-[6px] "+(group[key].vstyle||"")} />
                   </td>:<td key={`${groupIndex}-${keyIndex}`} className={"p-2 border border-gray-300 "+(group[key].vstyle||"")}>{group[key].value}</td>
                 
             
          ))}</tr>))}
          
    
      
        {/* // addoptions?.logo && (
          
        //     <td key={`${groupIndex}-${itemIndex}`} className="p-2 border border-gray-300">
        //        <div className="rounded-full h-8 w-8 bg-slate-200 flex justify-center items-center">
        //                 {addoptions.logo}
        //         </div> 
        //     </td>
            
        // )
        
        // addoptions.button && (
        //             <td className="p-2 border border-gray-300">
        //              <Button label="Send Money" style="text-[9px] p-[3px] mt-[6px]" />
        //            </td>
        //            ) */}
        


                 
            
            
         
          </tbody>
        </table>
      </div>
    </Card>
  );
};
