import React, { useState } from 'react'
import './CSS/Header.css'

const Header = ({ games, favorites }) => {
    const [showGamesList, setShowGamesList] = useState(false);
    const [showFavoritesList, setShowFavoritesList] = useState(false);

    const toggleGamesList = () => {
        setShowGamesList(!showGamesList);
    };
    
    const toggleFavoritesList = () => {
        setShowFavoritesList(!showFavoritesList);
    };
   
    
    return (
        <>
        <header id="header">
            <div className="header-container">
                <nav className="navbar">
                    <h1>GameTracker <br /> (No Oficial)</h1>
                    <div className="nav-buttons">
                        <button className="btn-game" onClick={toggleGamesList}>
                            <a>Todos los Juegos</a>
                        </button>
                        <button className="btn-list" onClick={toggleFavoritesList}>
                            <a>Lista de Favoritos</a>
                        </button>
                    </div>
                </nav>

                {showGamesList && (
                    <div className="games-dropdown">
                        <h3>Lista de Juegos</h3>
                        <ul>
                            {games.length > 0 ? (
                                games.map((game) => (
                                    <li key={game._id}>{game.name}</li>
                                ))
                            ) : (
                                <li>Cargando juegos...</li>
                            )}
                        </ul>
                    </div>
                )}

                {showFavoritesList && (
                    <div className="favorites-dropdown">
                        <h3>Favoritos</h3>
                        <ul>
                            {favorites.length > 0 ? (
                                favorites.map((fav) => (
                                    <li key={fav._id}>{fav.gameId?.name || fav.name || 'Juego desconocido'}</li>
                                
                                ))
                            ) : (
                                <li>No hay favoritos aún</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
          
        </header>

        
        </>
    );
};

export default Header;