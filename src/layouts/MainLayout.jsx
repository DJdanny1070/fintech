import { Outlet } from "react-router-dom";
// import Navbar from "../components/layout/Navbar/Navbar";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      {/* <Navbar /> */}
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;