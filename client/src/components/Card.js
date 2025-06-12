import React from "react";

export function Card({ title, children, style = {} }) {
  return (
    <div className={`border bg-[#RRGGBBAA] rounded-[20px] border-black/10 p-4 overflow-hidden ${style.con || ""}`}>
      <h1 className={`text-xl border-b pb-2 ${style.h1 || ""}`}>{title}</h1>
      <div className={style.div || ""}>{children}</div>
    </div>
  );
}
