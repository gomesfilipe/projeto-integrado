import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./Home";
import Sobre from "./Sobre";
import Usuario from "./Usuario";

// import Produtos from "../Pages/Products/Products"

const Routes = () => {
   return(
       <BrowserRouter>
           {/* <Route component = { Loja }  path="/loja" /> */}
           {/* <Route component = { Produtos }  path="/produtos"/> */}
           {/* <Route component = { Venda }  path="/venda" /> */}
       </BrowserRouter>
   )
}

export default Routes;