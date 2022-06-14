import React from "react";
import { useEffect,} from "react";
import { useDispatch, useSelector} from "react-redux";
import { getVideogames} from "../redux/actions";
import { Link } from "react-router-dom";
import GameCard from "./GameCard";

export default function Home() {
  const dispatch = useDispatch();
  const allGames = useSelector((state) => state.videogames); 


  useEffect(() => {
    dispatch(getVideogames());
  }, [dispatch]); 

  function handleClick(e) {
    e.preventDefault();
    dispatch(getVideogames());
  }
  return (
    <div>
      <Link to= '/videogames'>Crear Personaje</Link>
      <h1>Juegos</h1>
      <button onClick={e => {handleClick(e)}}>
          Volver a cargar todos los videojuegos
      </button>
      {allGames && allGames.map(f =>{
        return(<GameCard name={f.name} background_image = {f.background_image} genre = {f.genre} rating = {f.rating}/>)
        
      })}
    </div>
  )

}