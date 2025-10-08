const chalk = require('chalk');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());



const MONGO_URL = 'mongodb+srv://nazareyesbaccaro_db_user:Tg8guiEMisOD7Ahd@clusterjc.bdj8tfe.mongodb.net/?retryWrites=true&w=majority&appName=ClusterJC'
mongoose.connect(MONGO_URL)
    .then(() => console.log(chalk.green('MongoDB connected')))
    .catch(err => console.log(chalk.red(`Error de conexión a MongoDB: ${err}`)));

    // Iniciar el servidor solo después de conectar a la base de datos
    app.listen(port, () => {
        console.log(chalk.blue(`Servidor escuchando en http://localhost:${port}`));
    });

    
    //modelo games
    const Game = mongoose.model("Game", {
        name: {type: String, required: true},
        level: {type: String, default: "beginner"},
    })
    
    app.post("/games", async (req, res) => {
        
        try {
            const nuevoGame = new Game(req.body); //body = {name: "JS", level: "advanced"}
        await nuevoGame.save()
           res.status(201).json(nuevoGame)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    })

     app.get("/games", async (req, res) => {
        const listGames = await Game.find()
        res.status(200).json(listGames)
     })

     app.get("/games/:id", async (req, res) => {
        const game = await Game.findById(req.params.id)
        
        if(!game){
            return res.status(404).json({error: "Game not found"})
        }

        res.status(200).json(game)
     })

     app.delete("/games/:id", async (req, res) => {
        const gameEliminado = await Game.findByIdAndDelete(req.params.id)
        
        if(!gameEliminado){
            return res.status(404).json({error: "Game not found"})
        }

        res.status(200).json(gameEliminado)
     })

     app.put("/games/:id", async (req, res) => {
        const gameActualizado = await Game.findByIdAndUpdate(req.params.id, req.body)
        
        if(!gameActualizado){
            return res.status(404).json({error: "Game not found"})
        }

        res.status(200).json(gameActualizado)
     })
