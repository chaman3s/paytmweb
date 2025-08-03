import React, { useEffect } from "react";
import { useSearchParams ,useNavigate} from "react-router-dom";
import axios from "axios";

const ReferralSystem = () => {
    const [searchParams] = useSearchParams();
    const backendHost = process.env.REACT_APP_BACKENDHOST;
    const navigate = useNavigate();

    useEffect(() => {
        const referralCode = searchParams.get("ref");
        if (referralCode) {
            console.log("Referral Code:", referralCode);
            sendReferralCode(referralCode);
        }
    }, [searchParams]);

    const sendReferralCode = async (code) => {
      
            await axios.get(`http://localhost:8080/api/v1/network/invite/?ref=${code}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                timeout: 5000
            }).then(function (response) {
            console.log("satus",response.statusCode);
            console.log("Referral response:", response);}).catch((err)=>{
                console.log("err", err.status)
                if(err.status===304){
                    navigate(`/auth/signin`);
                    
                }
                else if(err.status===404){
                    navigate(`/auth/signin`);
                    
                }
                else if (err.status==200)navigate(`/dashboard`);
                else{
                    console.log("error ",err);
                }

            })
            
       
    };

    return <div>Processing referral...</div>;
};

export default ReferralSystem;
