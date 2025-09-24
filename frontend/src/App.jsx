import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Home from './pages/Home/Home'
import Problem from './pages/Problems'
import Admin from './pages/Admin'
import ProblemEditor from './pages/ProblemCreation/ProblemCreationPage'

import AuthPage from './pages/Auth/AuthPage';
import ForgotPasswordPage from './pages/Auth/ForgotPassword';
import ResetPasswordPage from './pages/Auth/ResetPassword';

import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';


function App() {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/problem/:id' element={<Problem />} />
                <Route path='/admin' element={<Admin />} />
                <Route path="/admin/edit/:problemId" element={<ProblemEditor />} />

                <Route path="/auth" element={<AuthPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                <Route path="/super-admin" element={<SuperAdminDashboard />} />
            </Routes>
        </>
    )
}

export default App