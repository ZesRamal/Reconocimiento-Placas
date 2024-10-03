import "./listTable.css"
import { useState, useEffect } from "react";
import axios from "axios";

const ListingTable = () => {
    const [criminals, setCriminals] = useState([]);
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
        console.log(criminals);

    }, []);
    return (
        <div style={{ width: "100%" }}>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Crimen</th>
                        <th scope="col">Fecha Registro</th>
                        <th scope="col">Visto ultima vez</th>
                        <th scope="col">Foto</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        criminals.map((criminal, index) => (
                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <th>{criminal.name}</th>
                                <td>{criminal.crime}</td>
                                <td>{criminal.dateRegistered}</td>
                                <td>{criminal.lastSeen}</td>
                                <td><img src={criminal.imageUrl} height={"100rem"} width={"150rem"} /></td>
                            </tr>
                        ))
                    }

                    {/* <tr key={1}>
                        <th scope="row">01</th>
                        <th>Juan</th>
                        <td>Robo</td>
                        <td>22 de septiembre de 2024, 4:04:28 p.m. UTC-7</td>
                        <td>22 de septiembre de 2024, 4:04:28 p.m. UTC-7</td>
                        <td><img src={localStorage.getItem("image")} height="100px" /></td>
                    </tr> */}
                </tbody>
            </table>
        </div >
    )
}

export default ListingTable