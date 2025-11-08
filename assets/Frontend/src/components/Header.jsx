import React, { useState } from 'react'
import './CSS/Header.css'
import CreateGameRequirements from './CreateGameRequirements'

// --------------------------Constantes--------------------------
const Header = ({ games, favorites, onGameSelect }) => {
    const [showGamesList, setShowGamesList] = useState(false);
    const [showFavoritesList, setShowFavoritesList] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);

    const toggleGamesList = () => {
        setShowGamesList(!showGamesList);
    };
    
    const toggleFavoritesList = () => {
        setShowFavoritesList(!showFavoritesList);
    };
   
    const handleGameClick = (gameId) => {
        if (gameId === null) {
            // Si gameId es null, significa que se hizo clic en "Crear Juego"
            setShowRequirements(true);
        } else {
            // Si hay un gameId válido, es un juego existente
            onGameSelect && onGameSelect(gameId);
        }
        setShowGamesList(false); // Cerrar la lista después de seleccionar
    };
    // --------------------------Constantes--------------------------
    
    // --------------------------Encabezado--------------------------
    return (
        <>
        <header id="header">
            <div className="header-container">
                <nav className="navbar">
                    <h1>GameTracker <br /> (Nazablue's Edition)</h1>
                    <div className="nav-buttons">
                        <button className="btn-create" onClick={() => handleGameClick(null)}>
                            <a>Crear Juego</a>
                        </button>
                        <button className="btn-game" onClick={toggleGamesList}>
                            <a>Todos los Juegos</a>
                        </button>
                        <button className="btn-list" onClick={toggleFavoritesList}>
                            <a>Lista de Favoritos</a>
                        </button>
                    </div>
                </nav>
    {/* --------------------------Encabezado-------------------------- */}

               {/* --------------------------Lista de Juegos-------------------------- */}
                {showGamesList && (
                    <div className="games-dropdown">
                        <h3>Lista de Juegos</h3>
                        <ul>
                            {games.length > 0 ? (
                                games.map((game) => (
                                    <li 
                                        key={game._id} 
                                        onClick={() => handleGameClick(game._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {game.name}
                                    </li>
                                ))
                            ) : (
                                <li>Cargando juegos...</li>
                            )}
                        </ul>
                    </div>
                )}
                {/* --------------------------Lista de Juegos-------------------------- */}
                
                {/* --------------------------Lista de Favoritos-------------------------- */}
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
                {/* --------------------------Lista de Favoritos-------------------------- */}
            </div>
          
        </header>

        {/* Modal de Requisitos para Crear Juego */}
        <CreateGameRequirements 
            isOpen={showRequirements} 
            onClose={() => setShowRequirements(false)} 
            
        />
        </>
    );
};

export default Header;