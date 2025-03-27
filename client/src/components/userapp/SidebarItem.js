import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

const SidebarItem = ({ href, title, icon }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const selected = location.pathname === href;

    return (
        <div
            className={`flex items-center p-2 pl-8 cursor-pointer transition-colors duration-200 
                ${selected ? "text-[#6a51a6] font-bold" : "text-slate-500 hover:text-[#6a51a6]"}`}
            onClick={() => navigate(href)}
        >
            <div className="pr-2">{icon}</div>
            <span>{title}</span>
        </div>
    );
};

export default SidebarItem;
