//import useState hook to create menu collapse state
import React, { useState } from "react";
import {Link} from 'react-router-dom'


import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

//Icons
import { FaShoppingCart } from "react-icons/fa";
import { FiHome, FiLogOut, FiShoppingBag, FiMenu } from "react-icons/fi";

import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";


const Header = () => {

    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(true)

    //create a custom function that will change menucollapse state from false to true and true to false
    const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  function logout(){
    sessionStorage.clear();
  }


  return (
    <>
      <div id="header">
          {/* collapsed props to change menu size using menucollapse state */} 
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>

            <div className="closemenu" onClick={menuIconClick}>
                {/* changing menu collapse icon on click */}
              <p>
              {menuCollapse ? (<FiMenu/> ) : ( <FiMenu/> )}
              </p>
            </div>
             
            <div className="logotext"> 
              {/* small and big change using menucollapse state */}
            <p>{menuCollapse ? "" : "Sisve"}</p>  
           </div>  
             
          </SidebarHeader>

          <SidebarContent>
            <Menu >
              <MenuItem icon={<FiHome />}>  <Link to="/Store"> Loja </Link> </MenuItem>
              <MenuItem icon={<FiShoppingBag />}> <Link to="/Products"> Produtos </Link> </MenuItem>
              {<MenuItem icon={<FaShoppingCart />}>  <Link to="/Vendas"> Realizar <br /> Venda </Link> </MenuItem>}
            </Menu>
          </SidebarContent>

          <SidebarFooter>
            <Menu>
             <MenuItem icon={<FiLogOut />}>
              <div>
                <Link to="/" onClick={logout}> Logout </Link> 
              </div>
             </MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};
export default Header;