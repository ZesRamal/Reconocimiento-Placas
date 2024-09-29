import style from "./form.module.css"
import { useState } from "react";

const Form = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        notes: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
    }


    return (
        <div style={{ width: "100%", paddingTop: "5%" }}>
            <div className={style.box}>
                <form className={style.form} onSubmit={handleSubmit} id="register">
                    <label htmlFor="name">Name</label>
                    <input className={style.input} type="text" id="name" autoComplete="off" placeholder="John Smith"
                        onChange={e => setProfile({
                            ...profile,
                            name: e.target.value
                        })} />
                    <label htmlFor="email">Email</label>
                    <input className={style.input} type="email" id="email" autoComplete="off" placeholder="john@mail.com"
                        onChange={e => setProfile({
                            ...profile,
                            email: e.target.value
                        })} />
                    <label htmlFor="note">Notes</label>
                    <textarea className={`${style.input} ${style.textArea}`} type="text" id="password" autoComplete="off" rows={5} placeholder="Additional notes"
                        onChange={e => setProfile({
                            ...profile,
                            notes: e.target.value
                        })} />
                    <input className={style.formButton} type="submit" value="Register" />
                </form>
            </div>
        </div>
    )
}

export default Form