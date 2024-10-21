import "./log.css"
import LogTable from "../../components/LogTable/LogTable"

const index = () => {
    return (
        <div className="registry">
            <center className="headerTitle">Registro de Vigilancia</center>
            <div className="tableDiv">
                <LogTable />
            </div>
        </div>
    )
}

export default index