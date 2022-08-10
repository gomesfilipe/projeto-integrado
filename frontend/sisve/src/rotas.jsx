import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import AuthGuard from './Components/AuthGuard';

/* Importa as páginas*/
import Home from './pages/Home/Home'
import Cadastro from './pages/Cadastro/Cadastro'
import Products from './pages/Products/Products'
import Store from './pages/Store/Store'
import Vendas from './pages/Vendas/Vendas'
import Product_registration from './pages/Product_registration/Product_registration';
import Product_edit from './pages/Product_edit/Product_edit';

function Rota() {  
  return (  
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/Cadastro' element={<Cadastro/>} />
        <Route path='/Store' element={<AuthGuard component={<Store/>} />}  />
        <Route path="/Products" element={<AuthGuard component={<Products/>} />} />
        <Route path="/Vendas" element={<AuthGuard component={<Vendas/>} />} />   
        <Route path="/Product_registration" element={<AuthGuard component={<Product_registration/>} />} /> 
        <Route path="/Product_edit/:name" element={<AuthGuard component={<Product_edit/>} />} /> 
    </Routes>
    </BrowserRouter>
  )
}
export default Rota
  