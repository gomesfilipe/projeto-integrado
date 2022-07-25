import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'

/* Importa as páginas*/
import Home from './pages/Home/Home'
import Cadastro from './pages/Cadastro/Cadastro'
import Products from './pages/Products/Products'
import Store from './pages/Store/Store'

function Rota() {  
  return (  
    <BrowserRouter>
    <Routes>
    <Route exact path='/' element={<Home/>} />
    <Route path='/Cadastro' element={<Cadastro/>} />
    <Route path='/Products' element={<Products/>} />
    <Route path='/Cadastro/Store' element={<Store/>} />
    </Routes>
    </BrowserRouter>
  )
}
export default Rota
  