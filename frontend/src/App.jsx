import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Home from './pages/Home'
import Problem from './pages/Problems'
import Admin from './pages/Admin'
import ProblemEditor from './pages/ProblemCreation/ProblemCreationPage'

import LoginRegister from "./pages/LoginRegister";

function App() {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/problem/:id' element={<Problem />} />
                <Route path='/admin' element={<Admin />} />
                <Route path="/admin/edit/:problemId" element={<ProblemEditor />} />
                <Route path='/LoginRegister' element={<LoginRegister />} />
            </Routes>
        </>
    )
}

export default App