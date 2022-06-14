import React from 'react';
import './styles/GameCard.css';


function GameCard({ background_image, name, genre, rating}) {
  return (
      <div className='gameCard'>
        <h2 className='rating'>{rating}</h2>
        <img style={{"height":"300px", "width":"500px"}} src={background_image} alt={name}/>
        <h2 className='name'>{name}</h2>
        <h3 className='genres'>{genre}</h3>
      </div>
  )
}

export default GameCard;