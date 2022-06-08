const { Router } = require('express');
const axios = require('axios');
const { API_KEY } = process.env;
const { Videogame, Genre, } = require("../db");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//Api games fetch, max 100 and filter only by relevant keys/values
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
                     background_image: f.background_image,
                     genres: f.genres.map(f => f) 
                    };
        })

        return apiGames;
         
}

// games fetch on VideogameDB
const getDbGames = async () => {
    return await Videogame.findAll({
        include: {
            model: Genre,
            attributes: ['name'],
            through: {attributes: [],}
        }
    })
}
//apigames -- dbgames concatenation
const getAllVideogames = async () => {

    const apiGames = await getApiGames();
    const dbGames = await getDbGames();
    const allGames = dbGames.concat(apiGames);

    return allGames;
}

// [ ] GET /videogames?name="...":
// Obtener un listado de las primeros 15 videojuegos que contengan la palabra ingresada como query parameter
// Si no existe ningún videojuego mostrar un mensaje adecuado

const getSearchNameApi = async (n) => {

    let resultApi = await axios.get(`https://api.rawg.io/api/games?search=${n}&key=${API_KEY}`);

    resultApi = await resultApi.data.results.map(f => {

        return { id: f.id, 
                name: f.name, 
                released: f.released, 
                rating: f.rating, 
                platforms: f.platforms.map( f =>f), 
                background_image: f.background_image, 
                genres: f.genres.map( f => f), 
            };
    })

    return resultApi;
}

const getSearchNameDb = async (n) => {

    let allDb = await Videogame.findAll({
        where: { name: n},
        include: {
            model: Genre,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    })

    let result = await allDb.filter(e => e.name.toLowerCase().includes(n.toLowerCase()));

    return result;
}

const getAllSearchName = async (n) => {

    const apiSearch = await getSearchNameApi(n);
    const dbSearch = await getSearchNameDb(n);
    const searchTotal = dbSearch.concat(apiSearch);

    return searchTotal;
}



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
