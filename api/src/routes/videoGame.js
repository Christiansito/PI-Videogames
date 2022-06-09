const express = require('express');
const router = express.Router();
const axios = require("axios");
const { Videogame, Genre,} = require("../db.js");
const { API_KEY } = process.env;

const apiId = async (id) => {
        
  const idApi = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
  const Data = await idApi.data; 
  return {
  id: Data.id,
  background_image: Data.background_image ? Data.background_image : null,
  name: Data.name,
  description: Data.description,
  released: Data.released,
  rating: Data.rating,
  platforms: Data.platforms.map((f) => f.platform.name),
  genres: Data.genres.map((f) => f.name),
  };
}

const dbId = async (id) => {
  const dbData = await Videogame.findByPk(id, { include: Genre });
  return {
  id: dbData.id,
  background_image: dbData.background_image,
  name: dbData.name,
  description: dbData.description,
  released: dbData.released,
  rating: dbData.rating,
  platforms: dbData.platforms,
  genres: dbData.genres.map(f => f),
  };
};
/*Concat */
const AllGamesById = async (id) => {

  const uuId = id.includes("-"); 
  if (uuId) {
    const dbIdInfo = await dbId(id);
    return dbIdInfo; 
  } else {
    const apiIdInfo = await apiId(id);
    return apiIdInfo;
  }
};

router.get('/videogame/:id', async (req,res) =>{
    const {id} = req.params
    try{
       const allGamesId = await AllGamesById(id);
       return res.send(allGamesId) 
    } catch(error) {
         res.status(404).json({error:error})
    }
});

router.post("/videogame", async (req, res) => {
    let { name, description, releaseDate, rating, genres, platforms } = req.body;
    try {
      const gameCreated = await Videogame.findOrCreate({
        where: {
          name,
          description,
          releaseDate,
          rating,
          platforms,
        },
      });
      await gameCreated[0].setGenres(genres); 
    } catch (err) {
      console.log(err);
    }
    res.send("Created succesfully");
});

module.exports = router;