import style from "./form.module.css"
import { useState } from "react";

const Form = () => {
    const [profile, setProfile] = useState({
        name: '',
        crime: '',
        photo: '',
    });

    const [file, setFile] = useState({
        name: '',
        image: '',
        size: '',
    });
    function handleChange(e) {
        if (e.target.files[0].size <= 2000000) {
            e => setProfile({
                ...profile,
                photo: e.target.value
            })
            setFile({
                name: e.target.files[0].name,
                image: URL.createObjectURL(e.target.files[0]),
                size: returnFileSize(e.target.files[0].size),
            });
        } else {
            window.alert("Imagen muy pesada")
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        localStorage.setItem("image", file.image)
    }

    function returnFileSize(number) {
        if (number < 1e3) {
            return `${number} bytes`;
        } else if (number >= 1e3 && number < 1e6) {
            return `${(number / 1e3).toFixed(1)} KB`;
        } else {
            return `${(number / 1e6).toFixed(1)} MB`;
        }
    }

    return (
        <div style={{ width: "100%", paddingTop: "5%" }}>
            <div className={style.box}>
                <form className={style.form} onSubmit={handleSubmit} id="register">
                    <label htmlFor="name">Nombre</label>
                    <input className={style.input} type="text" id="name" autoComplete="off" placeholder="John Smith" required
                        onChange={e => setProfile({
                            ...profile,
                            name: e.target.value
                        })} />
                    <label htmlFor="crime">Crimen</label>
                    <input className={style.input} type="text" id="crime" autoComplete="off" placeholder="Descripción breve" required
                        onChange={e => setProfile({
                            ...profile,
                            crime: e.target.value
                        })} />
                    <label htmlFor="photo">Fotografía</label>
                    <label htmlFor="photo" type="button" className={style.uploadButton}>Subir Fotografía (.png, .jpg)</label>
                    <input style={{ visibility: "hidden", height: "0px" }} type="file" id="photo" accept="image/png, image/jpeg" onChange={handleChange} required />
                    <div style={{ border: "1px solid white", padding: "5% 3%" }}>
                        {
                            file.image ?
                                <div className={style.divImage}>
                                    <div style={{ fontWeight: "normal" }}>
                                        <div><b>File:</b> {file.name}</div>
                                        <div><b>Size:</b> {file.size}</div>
                                    </div>
                                    <img src={file.image} height={"100px"} />
                                </div>
                                :
                                <div>
                                    No se ha seleccionado una imagen
                                </div>
                        }
                    </div>
                    <input className={style.formButton} type="submit" value="Registrar" />
                </form>
            </div>
        </div>
    )
}

export default Form