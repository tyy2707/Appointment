import { useContext, useState } from "react";
import { AuthContext } from "./auth.context";
import NotAdmin from "../pages/NotFound/NotAdmin";
import Login from "../pages/Login";
import HomePage from "../pages/Home/HomePage";

export function ProtectedRoute({ Component, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    window.location.href = '/';
  }
  else
    if (role === "ADMIN") {
      // 1 user thường 
      // 2 user doctor 
      // 3 admin 
      // 4 bs quản lý lịch khám  
      // 5 ke toán
      if (user.role_id === 3 || user.role_id === 4 || user.role_id === 5) {
        return <Component />;
      } else return <NotAdmin />;
    } else return <Component />;
}
