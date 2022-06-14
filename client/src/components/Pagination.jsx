import React from 'react';
import './styles/Pagination.css';

function Pagination({ videogamesPerPage, allVideogames, pagination }) {
  const pageNumbers = [];

  for (let i = 1; i < Math.ceil(allVideogames/videogamesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className='pagination'>
      <ul>
        { pageNumbers && pageNumbers.map(num => (
          <span key={num}>
            <a onClick={() => pagination(num)}>{num}</a>
          </span>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination;