import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import ToastStack from "../common/Toast";

const AppLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="app-body">
        <Sidebar role={user.role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
      <BottomNav role={user.role} />
      <ToastStack />
    </div>
  );
};

export default AppLayout;
