const chalk = require('chalk');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const MONGO_URL = 'mongodb+srv://nazareyesbaccaro_db_user:Tg8guiEMisOD7Ahd@clusterjc.bdj8tfe.mongodb.net/?retryWrites=true&w=majority&appName=ClusterJC'
mongoose.connect(MONGO_URL)
    .then(() => console.log(chalk.green('MongoDB connected')))
    .catch(err => console.log(chalk.red(err)));

    app.listen(port, () => {
        console.log(chalk.blue(`servidor escuchando en http://localhost:${port}`))
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

//modelo reviews
const Review = mongoose.model("Review", {
    gameId: {type: String, required: true},
    review: {type: String, required: true},
    rating: {type: Number, required: true},
});

// Obtener todas las reviews
app.get("/reviews", async (req, res) => {
    const listReviews = await Review.find()
    res.status(200).json(listReviews)
});

// Obtener una review específica por ID
app.get("/reviews/:id", async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if(!review) {
            return res.status(404).json({error: "Review not found"});
        }
        
        res.status(200).json(review);
    } catch (error) {
        console.log(chalk.red(`Error al obtener review: ${error.message}`));
        res.status(500).json({error: "Error al obtener review"});
    }
});

// Crear una nueva review
app.post("/reviews", async (req, res) => {
    try {
        const nuevaReview = new Review(req.body); //body = {gameId: "68e1a594747ca697ad65b040", review: "Excelente juego", rating: 5}
        await nuevaReview.save();
        res.status(201).json(nuevaReview);
    } catch (error) {
        console.log(chalk.red(`Error al crear review: ${error.message}`));
        res.status(400).json({error: error.message});
    }
});

// Actualizar una review
app.put("/reviews/:id", async (req, res) => {
    try {
        const reviewActualizada = await Review.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true } // Para devolver el documento actualizado
        );
        
        if(!reviewActualizada) {
            return res.status(404).json({error: "Review not found"});
        }

        res.status(200).json(reviewActualizada);
    } catch (error) {
        console.log(chalk.red(`Error al actualizar review: ${error.message}`));
        res.status(500).json({error: "Error al actualizar review"});
    }
});

// Eliminar una review
app.delete("/reviews/:id", async (req, res) => {
    try {
        const reviewEliminada = await Review.findByIdAndDelete(req.params.id);
        
        if(!reviewEliminada) {
            return res.status(404).json({error: "Review not found"});
        }

        res.status(200).json(reviewEliminada);
    } catch (error) {
        console.log(chalk.red(`Error al eliminar review: ${error.message}`));
        res.status(500).json({error: "Error al eliminar review"});
    }
});
