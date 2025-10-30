import './App.css'
import Header from './components/Header'
import Progress from './components/Progress'
import Games from './components/Games'
import { useState, useEffect } from 'react'
import FavoriteForm from './components/FavoriteForm';



function App() {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const reloadFavorites = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/favorites');
            const data = await res.json();
            setFavorites(Array.isArray(data) ? data : []);
        } catch {
            setFavorites([]);
        }
    };
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
            <Header games={games} favorites={favorites} />
            <Progress favoritesCount={favoritesCount} completedCount={completedCount} incompleteCount={incompleteCount} />
            <Games onFavoritesChanged={reloadFavorites} />
            <FavoriteForm />
            {/* ... existing code ... */}
        </>
    )
}

export default App
