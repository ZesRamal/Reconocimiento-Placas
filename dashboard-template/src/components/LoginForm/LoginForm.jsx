import style from "./loginForm.module.css";
// import { useState } from "react";

const LoginForm = () => {
    // const [loginData, setLoginData] = useState({
    //     username: '',
    //     password: '',
    // });


    const handleSubmit = async (event) => {
        event.preventDefault();
    }
    return (
        <div style={{ width: "100%" }}>
            <div className={style.box}>
                <div className={style.title}>Login</div>
                <form className={style.form} onSubmit={handleSubmit} id="register">
                    <label htmlFor="username">Username</label>
                    <input className={style.input} type="text" id="username" autoComplete="off" placeholder="Admin"
                        onChange={e => handleSubmit(e)} />
                    <label htmlFor="password">Password</label>
                    <input className={style.input} type="password" id="password" autoComplete="off" placeholder="Secret"
                        onChange={e => handleSubmit(e)} />
                    <input className={style.formButton} type="submit" value="Login" />
                </form>
            </div>
        </div>
    )
}

export default LoginForm