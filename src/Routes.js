import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Payroll from './pages/Payroll';
import Employees from './pages/Employees';
import Home from './pages/Home';
import Attendance from './pages/Attendance';
import './styles.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Login from './Authentication/Login';

function AppRoutes() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={
                        <>
                            <ResponsiveAppBar />
                            <Home />
                        </>
                    } />
                    <Route path="/payroll" element={
                        <>
                            <ResponsiveAppBar />
                            <Payroll />
                        </>
                    } />
                    <Route path="/employees" element={
                        <>
                            <ResponsiveAppBar />
                            <Employees />
                        </>
                    } />
                    <Route path="/attendance" element={
                        <>
                            <ResponsiveAppBar />aa
                            <Attendance />
                        </>
                    } />
                </Routes>
                
            </div>
        </Router>
    );
}

export default AppRoutes;
