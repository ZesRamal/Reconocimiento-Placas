import "./loginForm.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

// Configuración de Axios para establecer un baseURL
const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // Cambia esto a tu URL base
});

const RegisterForm = () => {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar que las contraseñas coincidan
        if (registerData.password !== registerData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (registerData.username && registerData.password) {
            try {
                await apiClient.post("/register", { // Usa el cliente Axios configurado
                    username: registerData.username,
                    password: registerData.password,
                });
                document.getElementById("register").reset();
                setRegisterData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                });
                navigate("/login");
            } catch (error) {
                console.error("Error:", error.response?.data?.error || 'Error desconocido');
                setError(error.response?.data?.error || 'Error al registrar. Inténtalo de nuevo.');
            }
        } else {
            setError("Por favor llena todos los espacios.");
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <div className="box">
                <div className="loginTitle">Crear Cuenta</div>
                {error && <div className="error">{error}</div>}
                <form className="form" onSubmit={handleSubmit} id="register">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        className="input"
                        type="text"
                        id="username"
                        autoComplete="off"
                        placeholder="Usuario"
                        onChange={e => setRegisterData({
                            ...registerData,
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
                        onChange={e => setRegisterData({
                            ...registerData,
                            password: e.target.value
                        })}
                    />
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        className="input"
                        type="password"
                        id="confirmPassword"
                        autoComplete="off"
                        placeholder="Confirmar Contraseña"
                        onChange={e => setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value
                        })}
                    />
                    <input className="formButton" type="submit" value="Registrarse" />
                    <p>¿Ya tienes cuenta? <Link to="/login" style={{ textDecoration: "underline", color: "white" }}>Inicia sesión</Link></p>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
