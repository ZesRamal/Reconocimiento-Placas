import style from "./registry.module.css"
import Table from "../../components/Table/Table"

const index = () => {
    return (
        <div className={style.registry}>
            <center className={style.title}>Registry</center>
            <div className={style.tableDiv}>
                <Table />
            </div>
        </div>
    )
}

export default index