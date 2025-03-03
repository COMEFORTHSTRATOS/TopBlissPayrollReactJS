import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Payroll from './pages/Payroll';
import Employees from './pages/Employees';
import Home from './pages/Home';
import Attendance from './pages/Attendance';
import './styles.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Login from './Authentication/Login';
import PageTransition from './components/PageTransition';

function AppRoutes() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<PageTransition><Login /></PageTransition>} />
                    <Route path="/home" element={
                        <PageTransition>
                            <ResponsiveAppBar />
                            <Home />
                        </PageTransition>
                    } />
                    <Route path="/payroll" element={
                        <PageTransition>
                            <ResponsiveAppBar />
                            <Payroll />
                        </PageTransition>
                    } />
                    <Route path="/employees" element={
                        <PageTransition>
                            <ResponsiveAppBar />
                            <Employees />
                        </PageTransition>
                    } />
                    <Route path="/attendance" element={
                        <PageTransition>
                            <ResponsiveAppBar />
                            <Attendance />
                        </PageTransition>
                    } />
                </Routes>
                
            </div>
        </Router>
    );
}

export default AppRoutes;
