import "../List/list.css"
import ListingTable from "../../components/ListingTable/ListingTable"

const index = () => {
    return (
        <div className="list">
            <center className="headerTitle">Listado de Criminales</center>
            <div className="tableDiv">
                <ListingTable />
            </div>
        </div>
    )
}

export default index