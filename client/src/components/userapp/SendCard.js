import { useEffect, useState } from "react";
import Button from "../Btn";
import { Card } from "../Card";
import { Center } from "../Center";
import { TextInput } from "../TextInput";
import { useSelector } from "react-redux";
import axios from "axios";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | pending | success | fail
  const [message, setMessage] = useState("");
  const numberFromRedux = useSelector((state) => state.user.Number);
  const recipientFromRedux = useSelector((state) => state.user.recipient);
  const backendHost = process.env.REACT_APP_BACKENDHOST;
  const successImage = require("../../assets/image/Success.gif");
  const loader = require("../../assets/image/loader.gif")
  useEffect(() => {
    if (recipientFromRedux) {
      setNumber(recipientFromRedux);
    }
  }, [recipientFromRedux]);

  const handleTransfer = async () => {
    if (!number || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage("Please enter a valid number and amount.");
      return;
    }

    setLoading(true);
    setStatus("pending");
    setMessage("");

    try {
      const response = await axios.post(
        `${backendHost}api/v1/account/transfer`,
        {
          amount,
          to: number,
          SenderDescription: "Transfer Money to " + number,
          recipientDescription: "Receive Money From " + numberFromRedux,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      setStatus("success");
      setMessage("Transfer successful! Reference: " + data.referenceNo);
      setAmount("");
    } catch (error) {
      console.error("Transfer failed:", error.response?.data || error.message);
      setStatus("fail");
      setMessage("Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[58vh]">
      <Center>
        <Card style="rounded-[20px] border border-black/10 p-4 " title="Send">
          {status === "idle" || status === "fail" ? (
            <div className="min-w-72 pt-2">
              <TextInput
                placeholder="Number"
                label="Number"
                val={number}
                onCh={(v) => setNumber(v)}
              />
              <TextInput
                placeholder="Amount"
                label="Amount"
                val={amount}
                onCh={(v) => setAmount(v)}
              />
              {message && (
                <p className="text-red-500 text-sm mt-2">{message}</p>
              )}
              <div className="pt-4 flex justify-center">
                <Button onClick={handleTransfer} disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          ) : status === "pending" ? (
            <div className="flex flex-col items-center justify-center h-[234px]">
              <img
                src={loader}
                alt="Loading"
                className="w-10 h-10 mb-2 animate-spin"
              />
              <p className="text-gray-500">Transaction in progress...</p>
            </div>
          ) : status === "success" ? (
            <div className="flex flex-col items-center justify-center text-green-600 h-[234px]">
              <img src={successImage} alt="Success" className="w-10 h-10 mb-2" />
              <p>{message}</p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                  setNumber("");
                  setAmount("");
                }}
                className="mt-3 text-sm underline text-blue-600"
              >
                Send Another
              </button>
            </div>
          ) : null}
        </Card>
      </Center>
    </div>
  );
}

export default SendCard;
