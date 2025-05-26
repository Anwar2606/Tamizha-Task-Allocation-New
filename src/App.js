// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login-Page/LoginPage.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import ProtectedRoute from "./Login-Page/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AddEmployee from "./Add Employee/Add-Employee.jsx";
import EmployeeList from "./Employee List/EmployeeList.jsx";
import Clickup from "./Clickup/Clickup.jsx";
import Trackabi from "./Trackabi/Trackabi.jsx";
import Workdone from "./Workdone/Workdone.jsx";
import Attendance from "./Attendance/Attendance.jsx";
import DailyAttendance from "./Daily Attendance/DailyAttendance.jsx";
import EditEmployee from "./Edit Employee/EditEmployee.jsx";
import EmployeeProfile from "./Employee Profile/EmployeeProfile.jsx";
import AttendanceReport from "./Attedance Report/AttendanceReport.jsx";


function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Routes>
        <Route path="/add-employee" element={<AddEmployee />} />
      </Routes>
      <Routes>
        <Route path="/employeelist" element={<EmployeeList />} />
      </Routes>
      <Routes>
        <Route path="/clickup" element={<Clickup />} />
      </Routes>
      <Routes>
        <Route path="/trackabi" element={<Trackabi />} />
      </Routes>
      <Routes>
        <Route path="/workdone" element={<Workdone />} />
      </Routes>
      <Routes>
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
      <Routes>
        <Route path="/employee-profile/:id" element={<EmployeeProfile />} />
      </Routes>
      <Routes>
        <Route path="/dailyattendance" element={<DailyAttendance />} />
      </Routes>
       <Routes>
        <Route path="/attendancereport" element={<AttendanceReport />} />
      </Routes>
      <Routes>
          <Route path="/edit-employee/:id" element={<EditEmployee />} />

      </Routes>
      
    </Router>
  );
}

export default App;
