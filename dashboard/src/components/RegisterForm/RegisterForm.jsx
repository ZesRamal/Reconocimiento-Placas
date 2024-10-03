import "./loginForm.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    async function registerCriminal() {
        try {
            await axios.post("http://localhost:1100/api/register", {
                username: registerData.username,
                password: registerData.password,
            });
            document.getElementById("register").reset();
            setRegisterData({
                username: '',
                password: '',
                confirmPassword: '',
            })
            navigate("/login")
        } catch (error) {
            console.error('Registration error:', error);
            window.alert("Error al conectar con el servidor")
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (registerData.username && registerData.password && registerData.confirmPassword) {
            if (registerData.password == registerData.confirmPassword) {
                await registerCriminal()
            } else {
                window.alert("Ambas contraseñas son diferentes.")
            }
        } else {
            window.alert("Por favor llena todos los espacios.")
        }
    }
    return (
        <div style={{ width: "100%" }}>
            <div className="box">
                <div className="loginTitle">Crear Cuenta</div>
                <form className="form" onSubmit={handleSubmit} id="register">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input className="input" type="text" id="username" autoComplete="off" placeholder="Usuario"
                        onChange={e => setRegisterData({
                            ...registerData,
                            username: e.target.value
                        })} />
                    <label htmlFor="password">Contraseña</label>
                    <input className="input" type="password" id="password" autoComplete="off" placeholder="Contraseña"
                        onChange={e => setRegisterData({
                            ...registerData,
                            password: e.target.value
                        })} />
                    <label htmlFor="confirmPassword">Contraseña</label>
                    <input className="input" type="password" id="confirmPassword" autoComplete="off" placeholder="Confirmar Contraseña"
                        onChange={e => setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value
                        })} />
                    <input className="formButton" type="submit" value="Registrarse" />
                    <p>¿Ya tienes cuenta? <Link to="/login" style={{ textDecoration: "underline", color: "white" }}>Inicia sesión</Link></p>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm