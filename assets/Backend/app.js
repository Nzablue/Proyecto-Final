const cors = require('cors')
const chalk = require('chalk');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors())

const MONGO_URL = 'mongodb+srv://nazareyesbaccaro_db_user:Tg8guiEMisOD7Ahd@clusterjc.bdj8tfe.mongodb.net/?retryWrites=true&w=majority&appName=ClusterJC'
//const MONGO_URL = 'mongodb+srv://jacobogarcesoquendo:aFJzVMGN3o7fA38A@cluster0.mqwbn.mongodb.net/NazarenoReyesBaccaro'
mongoose.connect(MONGO_URL)
    .then(() => console.log(chalk.green('MongoDB Conectado')))
    .catch(err => console.log(chalk.red(err)));

    app.listen(port, () => {
        console.log(chalk.blue(`servidor escuchando en http://localhost:${port}`))
    });
    

    //modelo games
    const Game = mongoose.model("Game", {
        name: {type: String, required: true},
        level: {type: String, default: "beginner"},
        banner: {type: String, required: true},
        hours: {type: Number, required: true},
        progress: {type: Number, required: true},
        type: {type: String, required: true}
    })
    
    app.post("/api/games", async (req, res) => {
        
        try {
            const nuevoGame = new Game(req.body); //body = {name: "JS", level: "advanced"}
        await nuevoGame.save()
           res.status(201).json(nuevoGame)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    })

     app.get("/api/games", async (req, res) => {
        const listGames = await Game.find()
        res.status(200).json(listGames)
     })

     app.get("/api/games/:id", async (req, res) => {
        const game = await Game.findById(req.params.id)
        
        if(!game){
            return res.status(404).json({error: "Game not found"})
        }

        res.status(200).json(game)
     })

     app.delete("/api/games/:id", async (req, res) => {
        const gameEliminado = await Game.findByIdAndDelete(req.params.id)
        if(!gameEliminado){
            return res.status(404).json({error: "Game not found"})
        }
        await Review.deleteMany({ gameId: req.params.id })
        res.status(200).json(gameEliminado)
     })

     app.put("/api/games/:id", async (req, res) => {
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

// Obtener todas las reviews (ahora con filtro opcional por gameId)
app.get("/api/reviews", async (req, res) => {
    try {
        const { gameId } = req.query;
        const query = gameId ? { gameId } : {};
        const listReviews = await Review.find(query);
        res.status(200).json(listReviews);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener reviews" });
    }
});

// Obtener una review específica por ID
app.get("/api/reviews/:id", async (req, res) => {
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
app.post("/api/reviews", async (req, res) => {
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
app.put("/api/reviews/:id", async (req, res) => {
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
app.delete("/api/reviews/:id", async (req, res) => {
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

// NUEVO: modelo favorites con referencia a Game
const FavoriteSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true, unique: true },
    note: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const Favorite = mongoose.model("Favorite", FavoriteSchema);

// NUEVO: endpoint para crear favorito
app.post("/api/favorites", async (req, res) => {
    try {
        const { gameId, note } = req.body
        if (!gameId) {
            return res.status(400).json({ error: "gameId es requerido" })
        }

        const game = await Game.findById(gameId)
        if (!game) {
            return res.status(404).json({ error: "Game not found" })
        }

        const exists = await Favorite.findOne({ gameId })
        if (exists) {
            return res.status(409).json({ error: "Favorite already exists for this game" })
        }

        const fav = new Favorite({ gameId, note })
        await fav.save()
        res.status(201).json(fav)
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ error: "Favorite already exists for this game" })
        }
        res.status(400).json({ error: error.message })
    }
})

app.get("/api/favorites/:id", async (req, res) => {
    try {
        const fav = await Favorite.findById(req.params.id)
        if (!fav) {
            return res.status(404).json({ error: "Favorite not found" })
        }
        res.status(200).json(fav)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// NUEVO: endpoint para obtener favoritos con nombre del juego (sin cambiar esquema)
// GET /api/favorites con populate
app.get("/api/favorites", async (req, res) => {
    try {
        const listFavorites = await Favorite.find().populate("gameId", "name");
        res.status(200).json(listFavorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/favorites/:id", async (req, res) => {
    try {
        const { note } = req.body
        if (!note) {
            return res.status(400).json({ error: "note es requerido" })
        }

        const fav = await Favorite.findByIdAndUpdate(
            req.params.id,
            { note },
            { new: true }
        )
        if (!fav) {
            return res.status(404).json({ error: "Favorite not found" })
        }

        res.status(200).json(fav)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.delete('/api/favorites/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;
        const deleted = await Favorite.findOneAndDelete({ gameId });
        if (!deleted) {
            return res.status(404).json({ error: 'Favorito no encontrado' });
        }
        res.status(200).json({ message: 'Eliminado', favorite: deleted });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar favorito' });
    }
});

