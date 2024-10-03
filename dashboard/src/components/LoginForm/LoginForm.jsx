import "./loginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loginData.username && loginData.password) {
            await checkLogin()
            document.getElementById("login").reset();
            setLoginData({
                username: '',
                password: '',
            })
        } else {
            window.alert("Por favor llena ambos campos")
        }
    }

    async function checkLogin() {
        try {
            const response = await axios.post("http://localhost:1100/api/login", {
                username: loginData.username,
                password: loginData.password,
            });
            const data = await response.data;
            localStorage.setItem('token', data.token);
            navigate("/", { replace: true })
            window.location.reload();
        } catch (error) {
            console.error('Registration error:', error);
            window.alert("Usuario o contraseña incorrecto")
        }
    }
    return (
        <div style={{ width: "100%" }}>
            <div className="box">
                <div className="loginTitle">Iniciar Sesión</div>
                <form className="form" onSubmit={handleSubmit} id="register">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input className="input" type="text" id="username" autoComplete="off" placeholder="Usuario"
                        onChange={e => setLoginData({
                            ...loginData,
                            username: e.target.value
                        })} />
                    <label htmlFor="password">Contraseña</label>
                    <input className="input" type="password" id="password" autoComplete="off" placeholder="Contraseña"
                        onChange={e => setLoginData({
                            ...loginData,
                            password: e.target.value
                        })} />
                    <input className="formButton" type="submit" value="Iniciar Sesión" />
                    <p>¿No tienes cuenta? <Link to="/register" style={{ textDecoration: "underline", color: "white" }}>Regístrate aquí</Link></p>
                </form>
            </div>
        </div>
    )
}

export default LoginForm