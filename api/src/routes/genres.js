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
        const mappedGenre = genreData.map((f) => f.name);

        mappedGenre.map(
          async (f) =>
            await Genre.findOrCreate({
              where: {
                name: f,
              },
            })
        );
        return mappedGenre;
      } catch (error) {
        console.log(error);
      }
    } else {
      return genrDb.map((e) => e.name); 
    }
  };

router.get("/genres", async (req, res) => {
    const allGenr = await allGenres();
    res.status(200).send(allGenr);
  });

  module.exports = router;