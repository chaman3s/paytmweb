import React from "react";

export function Card({ title, children  ,style}) {
  return (
    <div className={"border p-6 bg-white rounded-xl bg-[#ededed] rounded-[20px] border border-black/10 p-4 overflow-hidden"+(style)?style:""}>
      <h1 className="text-xl border-b pb-2">{title}</h1>
      <div>{children}</div> {/* Fix: Use div instead of p */}
    </div>
  );
}
