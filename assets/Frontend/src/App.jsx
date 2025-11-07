
import Header from './components/Header'
import Progress from './components/Progress'
import Games from './components/Games'
import { useState, useEffect, useRef } from 'react'
import FavoriteForm from './components/FavoriteForm';


// -------------------Componente Principal---------------------------
function App() {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const gamesComponentRef = useRef(null);
    const reloadFavorites = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/favorites');
            const data = await res.json();
            setFavorites(Array.isArray(data) ? data : []);
        } catch {
            setFavorites([]);
        }
    };
//--------------------Componente Principal---------------------------

// Función para manejar la selección de juego desde el Header
    const handleGameSelect = (gameId) => {
        if (gamesComponentRef.current && gamesComponentRef.current.scrollToGame) {
            gamesComponentRef.current.scrollToGame(gameId);
        }
    };
// Función para manejar la seleccion de juego desde el Header    

//------------------Obtener juegos y favoritos al cargar la página----------------------
    useEffect(() => {
        fetch('http://localhost:3000/api/games')
            .then(res => res.json())
            .then(data => setGames(data))
            .catch(error => console.error('Error al obtener juegos:', error));
        reloadFavorites();
    }, []);

    // calcular completados (100%) manejando número o string con '%'
    const completedCount = games.filter((g) => {
        const raw = g?.progress;
        const val = typeof raw === 'number' ? raw : parseInt(String(raw).replace('%', ''), 10);
        return val === 100;
    }).length;

    const incompleteCount = games.filter((g) => {
        const raw = g?.progress;
        const val = typeof raw === 'number' ? raw : parseInt(String(raw).replace('%', ''), 10);
        return Number.isFinite(val) ? val < 100 : true;
    }).length;
        
    const favoritesCount = favorites.length;
    return (
        <>
            <Header games={games} favorites={favorites} onGameSelect={handleGameSelect} />
            <Progress favoritesCount={favoritesCount} completedCount={completedCount} incompleteCount={incompleteCount} />
            <Games ref={gamesComponentRef} onFavoritesChanged={reloadFavorites} />
            <FavoriteForm />
           
        </>
    )
}
//-------------------Obtener Juegos y Favoritos al Cargar la Página----------------------

export default App
