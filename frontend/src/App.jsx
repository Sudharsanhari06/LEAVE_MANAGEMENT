import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddEmployee from './components/AddEmployee';
import AddHoliday from "./components/AddHoliday";
import DashBoardRight from './components/DashBoardRight';
import LeaveApproval from './components/LeaveApproval';
import LeaveCalendar from './components/LeaveCalender';
import ManagerRequest from './components/ManagerRequest';
import ChangePassword from './components/ChangePassword';
import './index.css';
import { AuthProvider } from './components/AuthContext';



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/employee/change-password' element={<ChangePassword />} />
          
          <Route path="/dashboard" element={<Dashboard />} >
            <Route path="userdashboard" element={<DashBoardRight />} />
            <Route path="leaverequest'" element={<ManagerRequest />} />
            <Route path="leaveapproval/:requestId" element={<LeaveApproval />} />
            <Route path="add-employee" element={<AddEmployee />} />
            <Route path="add-holiday" element={<AddHoliday />} />
            <Route path='calender' element={<LeaveCalendar />}></Route>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;