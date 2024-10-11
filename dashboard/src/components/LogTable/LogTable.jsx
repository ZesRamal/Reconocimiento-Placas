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
                        <th scope="col">Número de Placa</th>
                        <th scope="col">Evento</th>
                        <th scope="col">Fecha/Hora</th>
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
                </tbody>
            </table>
        </div >
    )
}

export default LogTable