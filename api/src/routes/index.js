const { Router } = require('express');
 
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videoGames = require("./videoGames");
const videoGame = require("./videoGame");
const genres = require("./genres");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use(videoGame);
router.use(videoGames);
router.use(genres);
module.exports = router;
