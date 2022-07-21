import React from "react";
import './Sidebar.css'

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter
} from "react-pro-sidebar";

import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import LocalMallIcon from '@material-ui/icons/LocalMall';


function Sidebar() {

    return (

        <div id="Menu">
            <ProSidebar>
                <SidebarHeader>
                <div className="title">
                <p>SISVE</p>
                </div>
                
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="square">
                        <MenuItem icon= {<StoreMallDirectoryIcon />} >
                            Loja
                            {/* <a href="http://localhost:5173/loja"></a> */}
                        </MenuItem>


                        <MenuItem icon= {<LocalMallIcon />} >Produtos</MenuItem>
                        <MenuItem icon= {<LocalGroceryStoreIcon />}>Venda</MenuItem>
                    </Menu>

                </SidebarContent>
                {/* <SidebarFooter>
                <Menu iconShape="square">
                <MenuItem >Logout</MenuItem>
                </Menu>
                </SidebarFooter> */}
            </ProSidebar>
        </div>

    );
  }
  
  export default Sidebar

