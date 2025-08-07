import { useState } from "react";
import { Card } from "../Card";
import Button from "../Button";
import cp from "../../assets/image/copy.png";
import tk from "../../assets/image/Tick.png";
import { useNavigate } from "react-router-dom";

export const TableCard = ({
  name,
  title,
  style,
  opt,
  addoptions = {head: false},
  errmessge,
  nvite,
  isTableIteamClickAble,
  btnFun = () => {},
}) => {
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(null);
  const navigate = useNavigate();

  const { bool: isClickable = false, fun: rowClickFun = () => {} } = isTableIteamClickAble || {};

  const handleCopy = (value) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
  };

  const handleTempTick = (indexKey) => {
    setTick(indexKey);
    setTimeout(() => setTick(null), 5000);
  };

  const handleInviteCopy = () => {
    setCopied(true);
    handleCopy(nvite);
    setTimeout(() => setCopied(false), 5000);
  };

  if (!opt || opt.length === 0) {
    return (
      <Card style={style} title={name}>
        <div className="text-center pb-8 pt-8">{errmessge}</div>

        {nvite && (
          <div className="items-center ml-[46%]">
            <button
              onClick={handleInviteCopy}
              disabled={copied}
              className="w-[20%] px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
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
      <div className="pt-2 relative overflow-hidden">
        <table className="w-full border-collapse border border-gray-300">
          {addoptions.head && (
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(opt[0]).map((key, index) => (
                  <th
                    key={index}
                    className={`w-16 p-2 border border-gray-300 ${opt[0][key].hstyle || ""}`}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {opt.map((group, groupIndex) => (
              <tr
                key={groupIndex}
                onClick={isClickable ? () => rowClickFun(group) : undefined}
                className={`border border-gray-300 hover:bg-sky-700 hover:border-sky-700 ${
                  isClickable ? "cursor-pointer" : ""
                }`}
              >
                {Object.keys(group).map((key, keyIndex) => {
                  const cellKey = `${groupIndex}-${keyIndex}`;
                  const cellData = group[key];

                  if (key === "Logo") {
                    return (
                      <td key={cellKey} className="pl-[20px] border border-gray-300">
                        <div
                          className={`rounded-full h-8 w-8 bg-slate-200 flex justify-center items-center ${
                            cellData.vstyle || ""
                          }`}
                        >
                          {cellData.value}
                        </div>
                      </td>
                    );
                  }

                  if (key === "Button") {
                    return (
                      <td key={cellKey} className="p-2 border border-gray-300">
                        <Button
                          label={cellData.vLabel}
                          style={`text-[9px] p-[3px] mt-[6px] ${cellData.vstyle || ""}`}
                          clk={() => btnFun(cellData.vFunPra)}
                        />
                      </td>
                    );
                  }

                  if (key === "Upi ID") {
                    return (
                      <td
                        key={cellKey}
                        className={`p-2 border border-gray-300 text-center ${
                          cellData.vstyle || ""
                        } ${isClickable ? "cursor-pointer" : ""}`}
                      >
                        {cellData.value}
                        <img
                          src={tick === cellKey ? tk : cp}
                          alt="copy"
                          className="inline w-[15px] h-[15px] ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(cellData.value);
                            handleTempTick(cellKey);
                          }}
                        />
                      </td>
                    );
                  }

                  return (
                    <td
                      key={cellKey}
                      className={`p-2 border border-gray-300 text-center ${
                        cellData.vstyle || ""
                      }`}
                    >
                      {cellData.value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {nvite && (
          <button
            onClick={handleInviteCopy}
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
