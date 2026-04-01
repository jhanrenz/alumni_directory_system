import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import LoginForm from "../views/user/auth/loginForm";
import RegisterForm from "../views/user/auth/registerForm";
import MainPage from "../views/MainPage";

//admin
import AdminDashboard from "../views/admin/pages/UserManagement/adminDashboard";
import UserHeader from "../components/UserHeader";
import AdminHeader from "../components/AdminHeader";
import AdminLoginForm from "../views/admin/auth/loginAdmin";
import UserPageList from "../views/admin/pages/UserManagement/UserPageList";
import UserRejectedPageList from "../views/admin/pages/UserManagement/UserRejectedPageList";
import UserTrashedPageList from "../views/admin/pages/UserManagement/UserTrashedPageList";
import CoursePageList from "../views/admin/pages/CourseManagement/coursePageList";
import CourseEditPage from "../views/admin/pages/CourseManagement/courseEditPage";
import CourseTrashedPage from "../views/admin/pages/CourseManagement/courseTrashedPage";
import CourseCreatePage from "../views/admin/pages/CourseManagement/courseCreatePage";
import EventPageList from "../views/admin/pages/EventManagement/eventPageList";
import EventCreatePage from "../views/admin/pages/EventManagement/eventCreatePage";
import EventEditPage from "../views/admin/pages/EventManagement/eventEditPage";
import EventTrashedPage from "../views/admin/pages/EventManagement/eventTrashedPage";
import AlumniDirectoryPage from "../views/admin/pages/AlumniDirectory/alumniDirectoryPage";

//users
import EventPage from "../views/user/Pages/eventPage";
import AlumniPage from "../views/user/Pages/alumniPage";

const AppRouter = () => (
    <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
    
        <Route path="/admin/login" element={<AdminLoginForm/>}/>



    <Route element={<ProtectedRoute/>}>
    
    
    <Route element={<UserHeader/>}>
        <Route path="/events" element={<EventPage/>} />
        <Route path="/alumni" element={<AlumniPage/>} />
    </Route>
    </Route>


<Route element={<ProtectedRoute adminOnly />}>
  
  {/* ONE Admin Layout */}
  <Route element={<AdminHeader />}>

    <Route path="/admin/dashboard" element={<AdminDashboard />} />

    <Route path="/admin/users" element={<UserPageList />} />
    <Route path="/admin/users/rejected" element={<UserRejectedPageList />} />
    <Route path="/admin/users/trashed" element={<UserTrashedPageList />} />

    <Route path="/admin/courses" element={<CoursePageList />} />
    <Route path="/admin/courses/create" element={<CourseCreatePage />} />
    <Route path="/admin/courses/edit/:id?" element={<CourseEditPage />} />
    <Route path="/admin/courses/trashed" element={<CourseTrashedPage />} />

    <Route path="/admin/events" element={<EventPageList />} />
    <Route path="/admin/events/create" element={<EventCreatePage />} />
    <Route path="/admin/events/edit/:id?" element={<EventEditPage />} />
    <Route path="/admin/events/trashed" element={<EventTrashedPage />} />

    <Route path="/admin/alumni/users" element={<AlumniDirectoryPage />} />

  </Route>


    </Route>
    </Routes>
)
export default AppRouter;