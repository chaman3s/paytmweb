import { useSelector } from "react-redux";

export const Appbar = () => {
    // Get the username from the Redux store
    const username = useSelector((state) => state.user.username);
    const initial = username ? username.charAt(0).toUpperCase() : 'U';

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                PayTM App
            </div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    {/* Display a greeting with the username */}
                    {username ? ` ${username}` : 'Hello'}
                </div>
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {initial}
                    </div>
                </div>
            </div>
        </div>
    );
};