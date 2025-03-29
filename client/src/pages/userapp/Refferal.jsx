import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ReferralSystem = () => {
    const [searchParams] = useSearchParams();
    const backendHost = process.env.REACT_APP_BACKENDHOST;

    useEffect(() => {
        const referralCode = searchParams.get("ref");
        if (referralCode) {
            console.log("Referral Code:", referralCode);
            sendReferralCode(referralCode);
        }
    }, [searchParams]);

    const sendReferralCode = async (code) => {
        try {
            let response= await axios.get(`${backendHost}api/invite/?ref=${code}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                timeout: 5000
            });
            console.log("Referral response:", response);
        } catch (error) {
            console.error("Failed to apply referral code");
        }
    };

    return <div>Processing referral...</div>;
};

export default ReferralSystem;
