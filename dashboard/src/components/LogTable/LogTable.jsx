import { useState, useEffect } from "react";
import "./logTable.css";
import { CiZoomIn } from "react-icons/ci";

const LogTable = () => {
    // const [plates, setPlates] = useState([]);

    // const fetchPlates = async () => {
    //     try {
    //         const response = await fetch('http://localhost:3000/api/plates');  // Cambia a la URL completa
    //         const data = await response.json();  // Convertimos a JSON los datos recibidos
    //         setPlates(data);  // Guardamos los datos en el estado
    //     } catch (error) {
    //         console.error("Error fetching plates:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchPlates(); // Llama a la función al cargar el componente

    //     // Configura el polling
    //     const intervalId = setInterval(fetchPlates, 5000); // Actualiza cada 5 segundos

    //     // Limpieza del efecto
    //     return () => clearInterval(intervalId);
    // }, []);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState("");

    const toggleFullscreen = (imageUrl) => {
        if (isFullscreen && fullscreenImage === imageUrl) {
            setIsFullscreen(false);
            setFullscreenImage("");
        } else {
            setIsFullscreen(true);
            setFullscreenImage(imageUrl);
        }
    };

    function getDate() {
        const now = new Date();
        return now;
    }

    return (
        <div style={{ width: "100%", height: "100vh" }} >
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Número de Placa</th>
                        <th scope="col">Fecha/Hora</th>
                        <th scope="col">Fotograma</th>
                    </tr>
                </thead>
                {/* <tbody>
                    {plates.map((plate) => (
                        <tr key={plate.id}>
                            <th scope="row">{plate.id}</th>
                            <td>{plate.plate}</td>
                            <td>{new Date(plate.timestamp).toLocaleString()}</td>
                            <td>
                                
                                <div className="container" onClick={() => toggleFullscreen(plate.imageUrl)}>
                                <img src={plate.imageUrl} alt="Fotograma de la placa" width="100rem" height="100rem"/>
                                <div className="overlay">
                                    <a href="#" className="icon" title="User Profile">
                                        <CiZoomIn />
                                    </a>
                                </div>
                            </div>
                            </td>
                        </tr>
                    ))}
                </tbody> */}
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>123456789</td>
                        <td>{getDate().toUTCString()}</td>
                        <td>
                            <div className="container" onClick={() => toggleFullscreen("./src/assets/images/camara.png")}>
                                <img src="./src/assets/images/camara.png" alt="Fotograma de la placa" width="100rem" height="100rem" />
                                <div className="overlay">
                                    <a href="#" className="icon" title="User Profile">
                                        <CiZoomIn />
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">1</th>
                        <td>123456789</td>
                        <td>{getDate().toUTCString()}</td>
                        <td>
                            <div className="container" onClick={() => toggleFullscreen("./src/assets/images/firebaseIcon.png")}>
                                <img src="./src/assets/images/firebaseIcon.png" alt="Fotograma de la placa" width="100rem" height="100rem" />
                                <div className="overlay">
                                    <a href="#" className="icon" title="User Profile">
                                        <CiZoomIn />
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {isFullscreen && (
                <div className="fullscreen-overlay" onClick={() => toggleFullscreen(fullscreenImage)}>
                    <img src={fullscreenImage} alt="Fullscreen" className="fullscreen-image" />
                </div>
            )}
        </div>
    );
};

export default LogTable;
