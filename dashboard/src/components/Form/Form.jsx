import "./form.css"
import { useState } from "react";
import axios from "axios";

const Form = () => {
    const [criminal, setCriminal] = useState({
        name: '',
        crime: '',
        photo: '',
    });

    async function registerCriminal() {
        try {
            const formData = new FormData();
            formData.append('name', criminal.name);
            formData.append('crime', criminal.crime);
            formData.append('image', criminal.photo);
            await axios.post("http://localhost:1100/api/register-criminal", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            document.getElementById("register").reset();
            setCriminal({
                username: '',
                password: '',
                confirmPassword: '',
            })
        } catch (error) {
            console.error('Registration error:', error);
            window.alert("Error al conectar con el servidor")
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (criminal.name && criminal.crime && criminal.photo) {
            await registerCriminal()
        } else {
            window.alert("Por favor llenar todos los campos.")
        }
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
        <div style={{ width: "100%", margin: "auto" }}>
            <div className="registerBox">
                <form className="registerForm" onSubmit={handleSubmit} id="register">
                    <label htmlFor="name">Nombre</label>
                    <input className="registerInput" type="text" id="name" autoComplete="off" placeholder="John Smith" required
                        onChange={e => setCriminal({
                            ...criminal,
                            name: e.target.value
                        })} />
                    <label htmlFor="crime">Crimen</label>
                    <input className="registerInput" type="text" id="crime" autoComplete="off" placeholder="Descripción breve" required
                        onChange={e => setCriminal({
                            ...criminal,
                            crime: e.target.value
                        })} />
                    <label htmlFor="photo">Fotografía</label>
                    <label htmlFor="photo" type="button" className="uploadButton">Subir Fotografía (.png, .jpg)</label>
                    <input style={{ visibility: "hidden", height: "0px" }} type="file" id="photo" accept="image/png, image/jpeg" required
                        onChange={e => setCriminal({
                            ...criminal,
                            photo: e.target.files[0]
                        })} />
                    <div style={{ border: "1px solid white", padding: "5% 3%" }}>
                        {
                            criminal.photo ?
                                <div className="divImage">
                                    <div style={{ fontWeight: "normal" }}>
                                        <div><b>File:</b> {criminal.photo.name}</div>
                                        <div><b>Size:</b> {returnFileSize(criminal.photo.size)}</div>
                                    </div>
                                    <img src={URL.createObjectURL(criminal.photo)} height={"100rem"} width={"150rem"} />
                                </div>
                                :
                                <div>
                                    No se ha seleccionado una imagen
                                </div>
                        }
                    </div>
                    <input className="registerFormButton" type="submit" value="Registrar" />
                </form>
            </div>
        </div>
    )
}

export default Form