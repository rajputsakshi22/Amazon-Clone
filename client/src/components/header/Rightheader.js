import React,{useContext} from 'react'
import Avatar from '@mui/material/Avatar';
import { LoginContext } from '../context/ContextProvider';
import { NavLink } from 'react-router-dom';
import { Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';




const Rightheader = ({userlog,logclose}) => {
    const { account, setAccount } = useContext(LoginContext);

  return (
    <>
    <div className="rightheader">
        <div className="right_nav">
        {
            account ? <Avatar className='avtar2'>{account.fname[0].toUpperCase()}</Avatar> :
              <Avatar className='avtar'></Avatar>
          }
               {account ? <h3> {account.fname.toUpperCase()}</h3> : ""}
        </div>
        <div className="nav_btn" onClick={()=>logclose()}>
        <NavLink to="/">Home</NavLink>
                <NavLink to="/">Shop By Category</NavLink>
                <Divider style={{ width: "100%", marginLeft: "-20 "}} />
                <NavLink to="/" style={{ marginTop: 10 }}>Today's Deal</NavLink>
                {
                    account ? <NavLink to="/buynow">Your Order</NavLink> : <NavLink to="/login">Your Order</NavLink>
                }

<Divider style={{ width: "100%", marginLeft: "-20" }} />
                <div className="flag">
                    <NavLink to="" style={{ marginTop: 14 }}>Settings</NavLink>
                    <img src="" alt=''  style={{ width: 35, marginLeft: 10 }} />
                </div>

                {
                    account ?
                        <div className="flag">
                            <LogoutIcon style={{ fontSize: 18, marginRight: 4 }} />
                            <h3 onClick={() => userlog()} style={{ cursor: "pointer", fontWeight: 500 }}>LogOut</h3>
                        </div>
                        : <NavLink to="/login">SignIn</NavLink>
                }
        </div>
    </div>
    </>
  )
}

export default Rightheader
