import './App.css'
import {Routes , Route} from 'react-router-dom'
import Navbar from './component/Navbar'
import Home from './pages/Home' 
import Register from './pages/Register'
import Login from './pages/Login'
import Problem from './pages/Problems'
import Admin from './pages/Admin'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} /> 
        <Route path='/register' element={<Register/>} /> 
        <Route path='/login' element={<Login/>} /> 
        <Route path='/problem/:id' id={`100`} element={<Problem/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </>
  )

}

export default App
