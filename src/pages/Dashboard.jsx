import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MADashSidebar from "../components/MADashSidebar";
import MADashProfile from "../components/MADashProfile";
import MADashPost from "../components/MADashPost";
import MADashUsers from "../components/MADashUsers";
import MADashboard from "../components/MADashboard";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div>
        <MADashSidebar />
      </div>
      {tab === "profile" && <MADashProfile />}
      {tab === "posts" && <MADashPost />}
      {tab === "users" && <MADashUsers />}
      {tab === "dash" && <MADashboard />}
    </div>
  );
}
