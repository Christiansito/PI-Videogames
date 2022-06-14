import React from "react";
import {Link} from "react-router-dom";
import './styles/LandingPage.css'


export default function LandingPage(){
    return(
        <div className="fondo">
            <h1 className="frase">Bienvenidos a la paginaza</h1>
            <Link to ='/home'>
                <button className="boton">Ingresari</button>
            </Link>
        </div>
    )
}