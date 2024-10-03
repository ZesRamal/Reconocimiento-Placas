import "./listTable.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineDeleteForever } from "react-icons/md";

const ListingTable = () => {
    const [criminals, setCriminals] = useState([]);
    // const [popUp, setPopUp] = useState(false)
    useEffect(() => {
        const fetchCriminals = async () => {
            const response = await axios.get("http://localhost:1100/api/criminals", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            setCriminals(response.data.criminals)
            // console.log(response.data.criminals);

        };
        fetchCriminals();

    }, []);

    const fetchCriminals = async () => {
        const response = await axios.get("http://localhost:1100/api/criminals", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        setCriminals(response.data.criminals)
        // console.log(response.data.criminals);

    };

    async function handleDelete(id) {
        try {
            const response = await axios.delete(`http://localhost:1100/api/criminals/${id}`);
            if (response.status === 204) {
                console.log('Criminal deleted successfully');
                fetchCriminals()
            }
        } catch (error) {
            console.error('Error deleting criminal:', error.response ? error.response.data : error.message);
        }
    }

    function handlePopUp(id) {
        const confirmed = window.confirm("¿Eliminar criminal?");
        if (confirmed) {
            handleDelete(id);
        }
    }
    return (
        <div style={{ width: "100%" }}>
            {
                criminals.length > 0 ?
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Crimen</th>
                                    <th scope="col">Fecha Registro</th>
                                    <th scope="col">Visto ultima vez</th>
                                    <th scope="col">Foto</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    criminals.map((criminal, index) => (
                                        <tr key={index}>
                                            <th scope="row">{criminal.id}</th>
                                            <th>{criminal.name}</th>
                                            <td>{criminal.crime}</td>
                                            <td>{criminal.dateRegistered}</td>
                                            <td>{criminal.lastSeen}</td>
                                            <td><img src={criminal.imageUrl} height={"100rem"} width={"150rem"} /></td>
                                            <td><MdOutlineDeleteForever size={"2rem"} onClick={() => handlePopUp(criminal.id)} className="delete" /></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                    : <div><center style={{ margin: "20%" }}>No hay registros</center></div>
            }
        </div >
    )
}

export default ListingTable