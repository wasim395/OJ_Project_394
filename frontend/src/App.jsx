import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Home from './pages/Home'
import Problem from './pages/Problems'
import Admin from './pages/Admin'
import Create from './pages/AdminFuntion/create'
import Edit from './pages/AdminFuntion/edit'

import LoginRegister from "./pages/LoginRegister";

function App() {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/problem/:id' element={<Problem />} />
                <Route path='/admin' element={<Admin />} />
                <Route path='/admin/create' element={<Create />} />
                <Route path='/admin/edit/:id' element={<Edit />} />
                <Route path='/LoginRegister' element={<LoginRegister />} />
            </Routes>
        </>
    )

}

export default App
