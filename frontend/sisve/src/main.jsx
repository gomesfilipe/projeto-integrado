import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import Header from './Components/Header';
import './styles/global.css';
import Rota from './rotas'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Home/>  */}
    <Products></Products>
    <Rota/> 
  </React.StrictMode>
)
 