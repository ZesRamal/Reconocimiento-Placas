import "./loginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../utils/authProvider";
import axios from "axios";

// Configuración de Axios
const apiClient = axios.create({
    baseURL: 'http://localhost:5000', // Cambia a la URL de tu backend Flask
});

const LoginForm = () => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (loginData.username && loginData.password) {
            try {
                const response = await axios.post("http://localhost:5000/login", {
                    username: loginData.username,
                    password: loginData.password,
                });
                const { access_token, refresh_token } = response.data;
                login(access_token, refresh_token);
                navigate("/", { replace: true });
            } catch (error) {
                setError(error.response?.data?.message || "Error al iniciar sesión.");
            }
        } else {
            setError("Por favor llena ambos campos");
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <div className="box">
                <div className="loginTitle">Iniciar Sesión</div>
                {error && <div className="error">{error}</div>}
                <form className="form" onSubmit={handleSubmit} id="login">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        className="input"
                        type="text"
                        id="username"
                        autoComplete="off"
                        placeholder="Usuario"
                        onChange={e => setLoginData({
                            ...loginData,
                            username: e.target.value
                        })}
                    />
                    <label htmlFor="password">Contraseña</label>
                    <input
                        className="input"
                        type="password"
                        id="password"
                        autoComplete="off"
                        placeholder="Contraseña"
                        onChange={e => setLoginData({
                            ...loginData,
                            password: e.target.value
                        })}
                    />
                    <input className="formButton" type="submit" value="Iniciar Sesión" />
                    <p>¿No tienes cuenta? <Link to="/register" style={{ textDecoration: "underline", color: "white" }}>Regístrate aquí</Link></p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
