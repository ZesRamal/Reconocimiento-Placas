import { FiHome, FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoLog } from "react-icons/go";
import { PiSecurityCameraFill } from "react-icons/pi";
import "../Navbar/navBar.css";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../utils/authProvider";

const listaURLs = [
    { path: '/', pathName: 'inicio', icon: FiHome },
    { path: '/registro', pathName: 'registro', icon: GoLog },
];

const Navbar = () => {
    const { logout } = useAuth();
    const navRef = useRef(null);
    const [showNav, setShowNav] = useState(false);
    const location = useLocation();

    const getActiveClassName = (path) => location.pathname === path ? "activeNavItem" : '';

    const handleOpenNav = () => {
        setShowNav(!showNav);
    };

    const handleLogOut = () => {
        logout(); // Llama al método logout desde el contexto
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target) && window.innerWidth <= 820) {
                setShowNav(false);
            }
        };

        const handleResize = () => {
            setShowNav(window.innerWidth > 820);
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
        transition: 'transform 300ms ease-in-out',
    };

    const burgerMenuActivationCSS = {
        transform: !showNav && window.innerWidth <= 820 ? 'translateX(0)' : 'translateX(-110%)',
        transition: 'transform 300ms ease-in-out',
    };

    const barCSS = {
        height: "12vh", width: "15vw", backgroundColor: "rgb(17 24 39)", position: "absolute", top: 0, left: 0,
    };

    return (
        <>
            {
                location.pathname !== "/login" && location.pathname !== "/register" &&
                <>
                    <div style={barCSS}></div>
                    <div className="burgerIcon" style={burgerMenuActivationCSS}>
                        <GiHamburgerMenu size={"4rem"} color='#fdf384' onClick={handleOpenNav} />
                    </div>
                    <div style={navBarActivationCSS} className="navbarBase" ref={navRef}>
                        <div className="navIcon">
                            <PiSecurityCameraFill size={"75%"} color='#fdf384' style={{ transform: "scaleX(-1)" }} />
                        </div>
                        <nav style={{ marginTop: "1rem" }}>
                            <ul style={{ paddingLeft: "0", listStyleType: "none" }}>
                                {listaURLs.map((ruta, index) => (
                                    <Link to={ruta.path} key={index} style={{ textDecoration: 'none' }} onClick={() => setShowNav(false)}>
                                        <div className={`navLi ${getActiveClassName(ruta.path)}`}>
                                            <div style={{ marginRight: "0.5rem" }}><ruta.icon size={28} /></div>
                                            <li style={{ fontFamily: "sans-serif" }}>{ruta.pathName}</li>
                                        </div>
                                    </Link>
                                ))}
                            </ul>
                            <ul style={{
                                paddingLeft: "0",
                                listStyleType: "none",
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                left: "0",
                                paddingRight: "auto",
                            }}>
                                <div className="navLogout" onClick={handleLogOut}>
                                    <div className="navLi">
                                        <div style={{ marginRight: "0.5rem" }}><FiLogOut size={28} /></div>
                                        <li style={{ fontFamily: "sans-serif" }}>Cerrar Sesión</li>
                                    </div>
                                </div>
                            </ul>
                        </nav>
                    </div>
                </>
            }
        </>
    );
};

export default Navbar;
