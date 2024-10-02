import style from "./table.module.css"
import { useState, useEffect } from "react";

const Table = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            setUsers([])
        };

        fetchUsers();
    }, []);
    return (
        <div style={{ width: "100%" }}>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Crimen</th>
                        <th scope="col">Fecha Registro</th>
                        <th scope="col">Visto ultima vez</th>
                        <th scope="col">Foto</th>
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
                        <th scope="row">Juan</th>
                        <td>Robo</td>
                        <td>22 de septiembre de 2024, 4:04:28 p.m. UTC-7</td>
                        <td>22 de septiembre de 2024, 4:04:28 p.m. UTC-7</td>
                        <td><img src={localStorage.getItem("image")} height="100px" /></td>
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

export default Table