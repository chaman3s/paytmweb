import { Appbar } from "./components/Appbar";
import { Outlet } from "react-router-dom";


export default function AuthLayout({ children }) {

  

  return (
    <>
    <Appbar btn={false} />
    <div className="flex">
      <main className="flex-grow"> <Outlet/> </main>
    </div>
  </>
  );

}