import { useState, useEffect } from "react";
import "./logTable.css";

const LogTable = () => {
    const [plates, setPlates] = useState([]);

    const fetchPlates = async () => {
        try {
            const response = await fetch('http://localhost:5000/placas');  // Cambia a la URL correcta para obtener placas
            const data = await response.json();  // Convertimos a JSON los datos recibidos
            setPlates(data);  // Guardamos los datos en el estado
        } catch (error) {
            console.error("Error fetching plates:", error);
        }
    };

    useEffect(() => {
        fetchPlates(); // Llama a la función al cargar el componente

        // Configura el polling
        const intervalId = setInterval(fetchPlates, 5000); // Actualiza cada 5 segundos

        // Limpieza del efecto
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ width: "100%" }}>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID Imagen</th>
                        <th scope="col">Número de Placa</th>
                        <th scope="col">Fecha/Hora de Detección</th>
                        <th scope="col">Imagen</th>
                    </tr>
                </thead>
                <tbody>
                    {plates.map((plate) => (
                        <tr key={plate.id_imagen}>
                            <th scope="row">{plate.id_imagen}</th>
                            <td>{plate.placa}</td>
                            <td>{new Date(plate.fecha_hora_deteccion).toLocaleString()}</td>
                            <td>
                                <img src={plate.imagen} alt="Fotograma de la placa" width="100" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LogTable;
