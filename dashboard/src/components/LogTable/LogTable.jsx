import "./logTable.css"
import { useState, useEffect } from "react";

const LogTable = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            setUsers([])
        };

        fetchUsers();
    }, []);
    return (
        <div style={{ width: "100%" }}>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre de criminal</th>
                        <th scope="col">Evento</th>
                        <th scope="col">Fecha/Hora</th>
                        <th scope="col">ID Cámara</th>
                        <th scope="col">Fotograma</th>
                    </tr>
                </thead>
                <tbody>
                    {/* users.map((user) => (
                        <tr key={user.id}>
                            <th scope="row">{user.name}</th>
                            <td>{user.email}</td>
                            <td>{user.notes}</td>
                            <td>{user.registerTime.toDate().toString()}</td>
                        </tr>
                        )) */}

                    <tr key={1}>
                        <th scope="row">01</th>
                        <th>Juan</th>
                        <td>Avistamiento Detectado</td>
                        <td>22 de septiembre de 2024, 4:04:28 p.m. UTC-7</td>
                        <td>0001</td>
                        <td><img src="" height="100px" /></td>
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

export default LogTable