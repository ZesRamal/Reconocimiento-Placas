import { FiDatabase, FiHome, FiUserPlus, FiTable, FiLogOut } from "react-icons/fi";
import style from './navbar.module.css'
import { Link, useLocation } from "react-router-dom";

const listaURLs = [
    { path: '/', pathName: 'home', icon: FiHome },
    { path: '/register', pathName: 'register', icon: FiUserPlus },
    { path: '/registry', pathName: 'registry', icon: FiTable },
    // { path: '/graphs', pathName: 'graphs', icon: FiBarChart },
]

const Navbar = () => {
    const location = useLocation();
    const getActiveClassName = (path) => {
        return location.pathname === path ? style.activeNavItem : '';
    };
    return (
        <>
            {
                location.pathname != "/login" ?
                    <div className={style.navbarBase}>
                        <div className={style.navIcon}><FiDatabase size={"5rem"} color='#fdf384' /></div>
                        <nav style={{ marginTop: "1rem" }}>
                            <ul style={{ paddingLeft: "0.5rem", listStyleType: "none" }}>
                                {
                                    listaURLs.map((ruta, index) => (
                                        <Link to={ruta.path} key={index} style={{ textDecoration: 'none' }}>
                                            <div className={`${style.navLi} ${getActiveClassName(ruta.path)}`}>
                                                <div style={{ marginRight: "0.5rem" }}><ruta.icon size={28} /></div>
                                                <li style={{ fontFamily: "sans-serif" }}>{ruta.pathName}</li>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </ul>
                            <ul style={{ paddingLeft: "0.5rem", listStyleType: "none", position: "absolute", bottom: "0", right: "0", left: "0", paddingRight: "auto" }}>
                                <Link to={'/login'} className={style.navLogout}>
                                    <div className={style.navLiLogout}>
                                        <div style={{ marginRight: "0.5rem" }}><FiLogOut size={28} /></div>
                                        <li style={{ fontFamily: "sans-serif" }}>Logout</li>
                                    </div>
                                </Link>
                            </ul>
                        </nav>
                    </div>
                    : <div></div>
            }
        </>
    )
}

export default Navbar