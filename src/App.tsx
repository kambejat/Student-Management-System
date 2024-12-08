import React, { useState } from 'react'
import './App.css'
import useAuth from './context/useAuth'
import { Route, Routes, useNavigate } from 'react-router-dom';
import PrivateRoute from './context/PrivateRoute';

const App: React.FC = () => {
  const [ user ] = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<number>(1)
  const navigate = useNavigate();

  const handleTabChange = (tabNumber: number) => {
    if (activeTab !== tabNumber) {
      setActiveTab(tabNumber);
      navigate(`/dashboard/${tabNumber}/1`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <>
    <Routes>
      <Route path='/' element={<>Login</>} />
      <Route path='/dashboard/:tabNumber/:pageNumber' element={
        <PrivateRoute>
          {user ? (
            <>
            
            </>
          ): <>Not Found Page</>}
        </PrivateRoute>
      } />
      </Routes>    
    </>
  )
}

export default App
