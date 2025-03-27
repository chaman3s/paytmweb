import { useState } from "react";
import Button from "../Btn";
import { Card } from "../Card";
import { Center } from "../Center";
import { TextInput } from "../TextInput";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    let addstyle = "rounded-[20px] border border-black/10 p-4";
    const handleTransfer = async () => {
        if (!number || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setMessage("Please enter a valid number and amount.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("https://data.mongodb-api.com/app/<your-app-id>/endpoint/data/v1/action/updateOne", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": "<your-api-key>",
                },
                body: JSON.stringify({
                    dataSource: "Cluster0",
                    database: "yourDatabase",
                    collection: "users",
                    filter: { number },
                    update: {
                        $inc: { balance: -Number(amount) * 100 },
                    },
                }),
            });

            const result = await response.json();

            if (result.modifiedCount > 0) {
                setMessage("Transfer successful!");
            } else {
                setMessage("Transfer failed. User not found or insufficient balance.");
            }
        } catch (error) {
            setMessage("Transfer failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[58vh]">
            <Center>
                <Card  style={addstyle} title="Send">
                    <div className="min-w-72 pt-2">
                        <TextInput 
                            placeholder="Number" 
                            label="Number" 
                            onChange={(e) => setNumber(e.target.value)} 
                        />
                        <TextInput 
                            placeholder="Amount" 
                            label="Amount" 
                            onChange={(e) => setAmount(e.target.value)} 
                        />
                        {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
                        <div className="pt-4 flex justify-center">
                            <Button onClick={handleTransfer} disabled={loading}>
                                {loading ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </Center>
        </div>
    );
}

export default SendCard;
