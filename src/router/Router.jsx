import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "../Layout/LayoutSideBar/LayoutSideBar";
import { ProtectedRoute } from "../context/ProtectedRoute.context";
import NotFound from "../pages/NotFound/NotFound";
import HomePage from "../pages/Home/HomePage";
import HomeAdmin from "../pages/Admin/HomeAdmin";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
       <Route
          path="/admin"
          element=
          {
            <ProtectedRoute Component={HomeAdmin} role={"ADMIN"} />
          }
        />
        
        <Route path="*" element={<NotFound />} />
        <Route
          path="/" element={
            <Layout>
              <HomePage />
            </Layout>}
        />
       
     
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
