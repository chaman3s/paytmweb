import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function SuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const amount = searchParams.get("amount");
    const recipientName = searchParams.get("recipientName");
    const initial = recipientName ? recipientName.charAt(0).toUpperCase() : '?';

    useEffect(() => {
        // Redirect to the dashboard after 5 seconds
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 5000);

        // Clear the timer if the component is unmounted
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white text-3xl font-bold mb-6">
                {initial}
            </div>
            <h1 className="text-3xl font-semibold mb-2">Transfer Successful</h1>
            <p className="text-lg text-center max-w-md">
                You have successfully transferred <span className="font-bold">Rs{amount}</span> to {recipientName}.
            </p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard in 5 seconds...</p>
        </div>
    );
}

export default SuccessPage;
