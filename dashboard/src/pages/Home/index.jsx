import "../Home/home.css"
import { RiPoliceBadgeFill } from "react-icons/ri";

const index = () => {
    return (
        <div className="home">
            <center className="headerTitle">Sistema de Control de Automóviles</center>
            <div>
                <div className="text">
                    <div className="flexRow">
                        <div>
                            <h3>Bienvenido al Centro de Control Vehicular.</h3>
                            <p>Este dashboard proporciona una visión general en tiempo real de todas las actividades vehiculares en nuestras instalaciones.</p>
                            <p>En la pestaña de registro podrás observar la tabla correspondiente a las entradas y salidas según la placa recopilada con la fecha y hora del evento.</p>
                            <div style={{ display: "flex", justifyContent: "center" }}><RiPoliceBadgeFill size={"10rem"} color="" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default index