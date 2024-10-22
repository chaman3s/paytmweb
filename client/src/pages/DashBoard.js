import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"

export  default  function Dashboard ()  {
    const backendHost= process.env.REACT_APP_BackendHost;
    return (<div>
        <Appbar />
        <div className="m-8">
            <Balance value={"10,000"} />
            <Users />
        </div>
    </div>)
}