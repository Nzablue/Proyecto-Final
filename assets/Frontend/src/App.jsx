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
    return (
        <>
        <Header games={games} favorites={favorites} />
        <Progress />
        <Games onFavoritesChanged={reloadFavorites} /> 
        <FavoriteForm />
        
        </>
    )
}

export default App
