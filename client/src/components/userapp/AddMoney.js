import { useState } from "react";
import axios from "axios";
import Button from "../Btn";
import { Card } from "../Card";
import { Select } from "../Select";
import { TextInput } from "../TextInput";

const SUPPORTED_BANKS = [
    { name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com" },
    { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" }
];

export const AddMoney = ({style}) => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState(0);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const token = "your_jwt_token"; // Replace with actual JWT token

    const handleTransaction = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/transaction/create",
                { amount: amount * 100, provider },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.location.href = redirectUrl || "";
        } catch (error) {
            console.error("Transaction failed", error);
        }
    };

    return (
        <Card title="Add Money" style={style}>
            <div className="w-full">
                <TextInput
                    label="Amount"
                    placeholder="Enter Amount"
                    onChange={(value) => setAmount(Number(value))}
                />
                <div className="py-4 text-left">Bank</div>
                <Select
                    onSelect={(value) => {
                        const bank = SUPPORTED_BANKS.find(x => x.name === value);
                        setRedirectUrl(bank?.redirectUrl || "");
                        setProvider(bank?.name || "");
                    }}
                    options={SUPPORTED_BANKS.map(x => ({ key: x.name, value: x.name }))}
                />
                <div className="flex justify-center pt-4">
                    <Button onClick={handleTransaction}>Add Money</Button>
                </div>
            </div>
        </Card>
    );
};
