const express = require('express');
const router = express.Router();
const axios = require('axios');
const {API_KEY} = process.env;
const {Genre} = require('../db');


const allGenres = async () => {
    const genrDb = await Genre.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  
    if (!genrDb.length) {
      try {
        const genresApi = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
        const genreData = await genresApi.data.results;
         console.log(genreData);
        const genreLimpio = genreData.map((e) => e.name);
        // console.log(genreLimpio);
        genreLimpio.map(
          async (e) =>
            await Genre.findOrCreate({
              //si lo encuentra no lo crea
              where: {
                name: e,
              },
            })
        );
        return genreLimpio;
      } catch (error) {
        console.log(error);
      }
    } else {
      return genrDb.map((e) => e.name); //que solo me devuelva el nombre
    }
  };

router.get("/genres", async (req, res) => {
    const todosGenr = await allGenres();
    res.send(todosGenr);
  });

  module.exports = router;