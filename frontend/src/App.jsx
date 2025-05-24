import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddEmployee from './components/AddEmployee';
import AddHoliday from "./components/AddHoliday";
import DashBoardRight from './components/DashBoardRight';
import LeaveApproval from './components/LeaveApproval';
import MangerRequest from './components/MangerRequest';
import './index.css';


function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard/>} >
          <Route path="userdashboard" element={<DashBoardRight/>} />
          <Route path="leaverequest" element={<MangerRequest/>} />
          <Route path="leaveapproval" element={<LeaveApproval/>} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="add-holiday" element={<AddHoliday />} />
        </Route>

        {/* <Route path="/employees" element={<Admin />}>
          <Route path="admindashboard" element={<AdminDashboard />} />
        
        </Route> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
