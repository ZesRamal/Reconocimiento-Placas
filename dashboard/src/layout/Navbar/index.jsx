import { FiHome, FiUserPlus, FiTable, FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoLog } from "react-icons/go";
import { PiSecurityCameraFill } from "react-icons/pi";
import "../Navbar/navBar.css"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const listaURLs = [
    { path: '/', pathName: 'inicio', icon: FiHome },
    { path: '/registrar', pathName: 'Registrar', icon: FiUserPlus },
    { path: '/listado', pathName: 'listado', icon: FiTable },
    // { path: '/registro', pathName: 'registro', icon: GoLog },
]

const Navbar = () => {
    const navigate = useNavigate();
    const navRef = useRef(null);
    const [showNav, setShowNav] = useState(false)
    const location = useLocation();
    const getActiveClassName = (path) => {
        return location.pathname === path ? "activeNavItem" : '';
    };

    const handleOpenNav = () => {
        setShowNav(!showNav);
    }

    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate("/login", { replace: true })
        window.location.reload();
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target) && window.innerWidth <= 820) {
                setShowNav(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 820) {
                setShowNav(true);
            } if (window.innerWidth <= 820) {
                setShowNav(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const navBarActivationCSS = {
        transform: window.innerWidth <= 820 && !showNav ? 'translateX(-110%)' : 'translateX(0)',
        transition: window.innerWidth <= 820 && !showNav ? 'transform 300ms ease-out' : 'transform 300ms ease-in',
    }

    const burgerMenuActivationCSS = {
        transform: !showNav && window.innerWidth <= 820 ? 'translateX(0)' : 'translateX(-110%)',
        transition: !showNav && window.innerWidth <= 820 ? 'transform 300ms ease-in' : 'transform 300ms ease-out'
    }

    const barCSS = {
        height: "12vh", width: "15vw", backgroundColor: "rgb(17 24 39)", position: "absolute", top: 0, left: 0,
    }

    return (
        <>
            {
                location.pathname != "/login" && location.pathname != "/register" ?
                    <>
                        <div style={barCSS}></div>
                        <div className="burgerIcon" style={burgerMenuActivationCSS}>
                            <GiHamburgerMenu size={"4rem"} color='#fdf384' onClick={handleOpenNav} />
                        </div>
                        <div style={navBarActivationCSS} className="navbarBase" ref={navRef}>
                            <div className="navIcon"><PiSecurityCameraFill size={"75%"} color='#fdf384' style={{ transform: "scaleX(-1)" }} /></div>
                            <nav style={{ marginTop: "1rem" }}>
                                <ul style={{ paddingLeft: "0", listStyleType: "none" }}>
                                    {
                                        listaURLs.map((ruta, index) => (
                                            <Link to={ruta.path} key={index} style={{ textDecoration: 'none' }} onClick={() => { setShowNav(false) }}>
                                                <div className={`navLi ${getActiveClassName(ruta.path)}`}>
                                                    <div style={{ marginRight: "0.5rem" }}><ruta.icon size={28} /></div>
                                                    <li style={{ fontFamily: "sans-serif" }}>{ruta.pathName}</li>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </ul>
                                <ul style={{ paddingLeft: "0", listStyleType: "none", position: "absolute", bottom: "0", right: "0", left: "0", paddingRight: "auto" }}>
                                    <Link to={'/login'} className="navLogout" onClick={handleLogOut}>
                                        <div className="navLi">
                                            <div style={{ marginRight: "0.5rem" }}><FiLogOut size={28} /></div>
                                            <li style={{ fontFamily: "sans-serif" }}>Cerrar Sesión</li>
                                        </div>
                                    </Link>
                                </ul>
                            </nav>
                        </div>
                    </>
                    : <div></div>
            }
        </>
    )
}

export default Navbar