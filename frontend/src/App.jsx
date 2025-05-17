import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import './index.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/employees' element={<Admin/>}/>
        {/* <Route path='/employees' element={<Admin/>}/> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
