const express = require('express');
const router = express.Router();
const axios = require("axios");
const { Videogame, Genre} = require("../db.js");
const { API_KEY } = process.env;


const getApiGames = async () => {
    let url = `https://api.rawg.io/api/games?key=${API_KEY}`;
    let apiGames = [];

        while (apiGames.length < 100){
            let aux = await axios.get(url);
            url = aux.data.next;
            
            for (let i = 0; i < aux.data.results.length; i++){
                apiGames.push(aux.data.results[i]);
            }
        }
    
        apiGames = apiGames.map(f => { 
            return { id: f.id,
                     name: f.name,
                     released: f.released, 
                     rating: f.rating,
                     platforms: f.platforms.map( f => f),
                     background_image: f.background_image ? f.background_image : null,
                     genres: f.genres.map(f => f) 
                    };
        })

        return apiGames;
         
}

// games on VideogameDB
 const getDbGames = async () => {
    return await Videogame.findAll({
        include: {
            model: Genre,
            attributes: ['name'],
            through: {attributes: [],}
        }
    })
};
//apigames -- dbgames concatenation
 const getAllVideogames = async () => {

    const apiGames = await getApiGames();
    const dbGames = await getDbGames();
    const allGames = dbGames.concat(apiGames);

    return allGames;
};

/*Query by name */

 const getSearchNameApi = async (name) => {

    let resultApi = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`);

    resultApi = await resultApi.data.results.map(f => {

        return { id: f.id, 
                name: f.name, 
                released: f.released, 
                rating: f.rating, 
                platforms: f.platforms.map( f => f), 
                background_image: f.background_image ? f.background_image : null, 
                genres: f.genres.map( f => f), 
            };
    })

    return resultApi;
};

 const getSearchNameDb = async (name) => {

    let allDb = await Videogame.findAll({
        where: { name: name},
        include: {
            model: Genre,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    })

    let result = await allDb.filter(f => f.name.toLowerCase().includes(n.toLowerCase()));

    return result;
};

 const getAllSearchName = async (n) => {

    const apiSearch = await getSearchNameApi(n);
    const dbSearch = await getSearchNameDb(n);
    const searchTotal = dbSearch.concat(apiSearch);

    return searchTotal;
};

router.get('/videogames', async (req, res) => {

  const { name } = req.query;
  let result;

  if(!name) {

      result = await getAllVideogames();

  }else {

      result = await getAllSearchName(name);

      if(result.length > 15) result = result.slice(0, 15)
  }

  if(result.length > 0) {

      res.status(200).send(result);

  }else { res.status(404).send("Videogame not found") }
})

module.exports = router;