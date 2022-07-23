import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'

/* Importa as páginas*/
import Home from './pages/Home/Home'
import Cadastro from './pages/Cadastro/Cadastro'

function Rota() {  
  return (  
    <BrowserRouter>
    <Routes>
    <Route exact path='/' element={<Home/>} />
    <Route exact path='/Cadastro' element={<Cadastro/>} />
    </Routes>
    </BrowserRouter>
  )
}
export default Rota
  