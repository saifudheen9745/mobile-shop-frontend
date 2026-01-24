import Image from "next/image";
import LoginPage from "./login/page";
import Dashboardpage from "./dashboard/page";
import { redirect } from "next/navigation";

export default function Home() {

  const login = true;

  if(!login){
    redirect("/dashboard");
  }
  return (
    <div className="flex  min-h-screen items-center justify-center  font-sans">
      <LoginPage /> 
    </div>
  );
}
