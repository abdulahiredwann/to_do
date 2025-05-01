import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";

function MainLayout() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
