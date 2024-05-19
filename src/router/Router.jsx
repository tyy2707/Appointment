import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "../Layout/LayoutSideBar/LayoutSideBar";
import { ProtectedRoute } from "../context/ProtectedRoute.context";
import NotFound from "../pages/NotFound/NotFound";
import HomePage from "../pages/Home/HomePage";
import Profile from "../pages/Profile/Proflie";
import UpdateProfilePatient from "../pages/UpdateProfile/UpdateProfile";
import QuestionPage from "../pages/QuestionPage/QuestionPage";
import BookingPage from "../pages/Booking/BookingPage";
import CreateQuestionPage from "../pages/QuestionPage/CreateQuestionPage";
import HomeAdmin from "../pages/Admin/HomeAdmin";
import CreateProfilePage from "../pages/CreateProfile/CreateProfile";
import PatientDetailPage from "../pages/PatientDetail/PatientDetailPage";


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
        <Route
          path="/home" element={
            <Layout>
              <HomePage />
            </Layout>}
        />
        <Route
          path="/user" element={
            <Layout>
              <Profile />
            </Layout>}
        />
        <Route
          path="/patient/:id" element={
            <Layout>
              <PatientDetailPage />
            </Layout>}
        />
        <Route
          path="/create-profile" element={
            <Layout>
              <CreateProfilePage />
            </Layout>}
        />
        <Route
          path="/update-profile/:id" element={
            <Layout>
              <UpdateProfilePatient />
            </Layout>}
        />
        <Route
          path="/question/:type" element={
            <Layout>
              <QuestionPage />
            </Layout>}
        />
        <Route
          path="/create-question" element={
            <Layout>
              <CreateQuestionPage />
            </Layout>}
        />
        <Route
          path="/booking" element={
            <Layout>
              <BookingPage />
            </Layout>}
        />
        <Route
          path="/admin"
          element=
          {
            <ProtectedRoute Component={HomeAdmin} role={"ADMIN"} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
