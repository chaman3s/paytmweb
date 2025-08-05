import { TableCard } from "../../components/userapp/TableCard";
import { SendCard } from "../../components/userapp/SendCard";
import { useDispatch, useSelector } from "react-redux";
import { setNumber } from "../../store/reducers/userSlice";
import { useEffect, useState } from "react";

export default function P2PTransfer() {
  const dispatch = useDispatch();
  const friendsdata = useSelector((state) => state.friend.friendsDetail);
  const [addStyle, setAddStyle] = useState({
    con: "w-[96%] h-[300px] rounded-[20px] border border-black/10 p-4 ",
    div: "h-[200px] mx-[10px]",
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    const dt = friendsdata.map((ele) => ({
      Logo: {
        value: ele.logo,
        vstyle: "bg-red ml-[13px] mr-[10px]",
      },
      Username: { hstyle: "w-[8px]", value: ele.username },
      "Full name": { vstyle: "w-[161px]", value: ele.fullname },
      "Phone no": { vstyle: "w-[160px]", value: ele.mobileNo },
    }));

    setData(dt);

    if (friendsdata.length > 4) {
      setAddStyle({
        con: "w-[96%] h-[300px] rounded-[20px] border border-black/10 p-4 ",
        div: "overflow-y-scroll h-[200px] mx-[10px]",
      });
    }
  }, [friendsdata]);

  function handleClick(row) {
    console.log("row is S:",row["Phone no"].value)
    const number = row["Phone no"]?.value;
    console.log("n:",number)
    if (number) dispatch(setNumber(number));
  }

  return (
    <div className="mt-8 ml-12">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 ml-16 font-bold">
        P2P Transfer
      </div>

      <div className="flex gap-3 ml-[65px]">
        <div>
          <SendCard />
        </div>

        <div className="mt-8 overflow-hidden">
          <TableCard
            style={addStyle}
            opt={data}
            addoptions={{ logo: true, button: true }}
            thlist={data[0]}
            isTableIteamClickAble={{ bool: true, fun: handleClick }}
          />
        </div>
      </div>
    </div>
  );
}
