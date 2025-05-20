import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import AddEmployee from './components/AddEmployee';
import  AddHoliday  from "./components/AddHoliday";
import ProtectedLayout from './ProtectedLayout';
import './index.css';
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      
        <Route element={<ProtectedLayout />}>
          <Route path='/employees' element={<Admin />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path='/add-holiday' element={<AddHoliday/>}/>
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
