import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "../Layout/LayoutSideBar/LayoutSideBar";
import NotFound from "../pages/NotFound/NotFound";
import HomePage from "../pages/Home/HomePage";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
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
