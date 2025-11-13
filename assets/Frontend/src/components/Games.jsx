import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import FavoriteForm from './FavoriteForm.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewList from './ReviewList.jsx';
import './CSS/Games.css';



// --------------------------Constantes--------------------------
const Games = forwardRef(function Games({ onFavoritesChanged }, ref) {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [showFavoriteForm, setShowFavoriteForm] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [savingFavoriteId, setSavingFavoriteId] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');
    const [removingFavoriteId, setRemovingFavoriteId] = useState(null);
    const [removeMessage, setRemoveMessage] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedReviewGameId, setSelectedReviewGameId] = useState('');
    const [showReviewList, setShowReviewList] = useState(false);
    const [selectedViewGameId, setSelectedViewGameId] = useState('');

    // Crear refs para cada juego
    const gameRefs = useRef({});
// --------------------------Constantes--------------------------
    
    // --------------------------Scroll a Juego--------------------------
    useImperativeHandle(ref, () => ({
        scrollToGame: (gameId) => {
            if (gameRefs.current[gameId]) {
                gameRefs.current[gameId].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    }));
    // --------------------------Scroll a Juego--------------------------

    const openFavoriteForm = (gameId) => {
        setSelectedGameId(gameId);
        setShowFavoriteForm(true);
    };

    const closeFavoriteForm = () => {
        setShowFavoriteForm(false);
        setSelectedGameId('');
    };

    const handleFavoriteSaved = () => {
        closeFavoriteForm();
        // Opcional: aquí puedes disparar una recarga de favoritos en App.jsx
        // por ejemplo, mediante un prop o contexto si lo necesitas.
    };

    const openReviewForm = (gameId) => {
        setSelectedReviewGameId(gameId);
        setShowReviewForm(true);
    };

    const closeReviewForm = () => {
        setShowReviewForm(false);
        setSelectedReviewGameId('');
    };

    const handleReviewSaved = () => {
        setReviewMessage('Reseña guardada');
        setTimeout(() => setReviewMessage(''), 3000);
        closeReviewForm();
    };

    const openReviewList = (gameId) => {
        setSelectedViewGameId(gameId);
        setShowReviewList(true);
    };

    const closeReviewList = () => {
        setShowReviewList(false);
        setSelectedViewGameId('');
    };

    // --------------------------Cargar Juegos--------------------------
    useEffect(() => {
        fetch('http://localhost:3000/api/games')
            .then((res) => res.json())
            .then((data) => setGames(data))
            .catch(() => setGames([]));
    }, []);
    // --------------------------Cargar Juegos--------------------------


    // --------------------------Cargar Favoritos--------------------------
    useEffect(() => {
        fetch('http://localhost:3000/api/favorites')
            .then((res) => res.json())
            .then((data) => setFavorites(data))
            .catch(() => setFavorites([]));
    }, []);
    // --------------------------Cargar Favoritos--------------------------
    

    // --------------------------Agregar a Favoritos--------------------------
    const addToFavorites = async (gameId) => {
        try {
            setSavingFavoriteId(gameId);
            const res = await fetch('http://localhost:3000/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId, note: '' }),
            });
             if (res.status === 409) {
                setSaveMessage('Ya está en favoritos');
                // Actualizar lista de favoritos por si acaso
                fetch('http://localhost:3000/api/favorites')
                    .then(res => res.json())
                    .then(data => setFavorites(Array.isArray(data) ? data : []));
                onFavoritesChanged && onFavoritesChanged();
                return;
            }
            if (!res.ok) throw new Error('No se pudo guardar en favoritos');
             // Agregar el nuevo favorito a la lista local
            const newFav = await res.json();
            setFavorites(prev => [...prev, newFav]);
            setSaveMessage('Juego agregado a favoritos');
            onFavoritesChanged && onFavoritesChanged();
        } catch (err) {
            setSaveMessage('Error al agregar a favoritos');
        } finally {
            setSavingFavoriteId(null);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };
    // --------------------------Agregar a Favoritos--------------------------


    // --------------------------Eliminar de Favoritos--------------------------
    const removeFromFavorites = async (gameId) => {
        try {
            setRemovingFavoriteId(gameId);
            const res = await fetch(`http://localhost:3000/api/favorites/${gameId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('No se pudo eliminar de favoritos');
             // Eliminar de la lista local de favoritos
            setFavorites(prev => prev.filter(fav => fav.gameId !== gameId));
            setRemoveMessage('Juego eliminado de favoritos');
            onFavoritesChanged && onFavoritesChanged();
        } catch (err) {
            setRemoveMessage('Error al eliminar de favoritos');
        } finally {
            setRemovingFavoriteId(null);
            setTimeout(() => setRemoveMessage(''), 3000);
        }
    };
    // --------------------------Eliminar de Favoritos--------------------------

    

    

    // --------------------------Mensajes y Título-----------------------------
    return (
        <>
          
            <div className="games-wrapper">
                <h4 className="title"><strong>Todos los Juegos</strong></h4>
                {games.map((game) => {
                    // Verificar si este juego ya está en favoritos
                    const isInFavorites = favorites.some(fav => fav.gameId === game._id);
                    // -------------------Mensajes y Título---------------------------

                    // -------------------Carta De Juego------------------------
                    return (
                    <div className="game-card" key={game._id} ref={el => gameRefs.current[game._id] = el}>
                        <div className="game-info">
                            <img src={game.banner} alt="Banner del juego" />
                            <h3>{game.name}</h3>
                            <p>Horas Jugadas: {game.hours}</p>
                            <p>Rango: {game.level}</p>
                            <div className='progress-full'>
                                <p>Progreso: {game.progress}%</p>
                            </div>
                            <p>Tipo de Juego: {game.type}</p>
                            <div className="game-buttons">
                                 {/* Mostrar botón "Agregar a favoritos" solo si NO está en favoritos */}
                                {!isInFavorites && (
                                    <button
                                        id="add-to-wishlist"
                                        onClick={() => addToFavorites(game._id)}
                                        disabled={savingFavoriteId === game._id}
                                    >
                                        {savingFavoriteId === game._id ? 'Guardando...' : 'Agregar a favoritos'}
                                    </button>
                                )}
                                {/* Mostrar botón "Eliminar de Favoritos" solo si está en favoritos */}
                                {isInFavorites && (
                                    <button
                                        id="remove-from-wishlist"
                                        onClick={() => removeFromFavorites(game._id)}
                                        disabled={removingFavoriteId === game._id}
                                    >
                                        {removingFavoriteId === game._id ? 'Eliminando...' : 'Eliminar de Favoritos'}
                                    </button>
                                )}
                                {/* Botón de Añadir/Editar Reseña */}
                                <button
                                    id="add-edit-review"
                                    onClick={() => openReviewForm(game._id)}
                                >
                                    Añadir/Editar Reseña
                                </button>
                                {/* Botón de Ver Reseña */}
                                <button
                                    id="view-review"
                                    onClick={() => openReviewList(game._id)}
                                >
                                    Ver Reseña
                                </button>
                                
                            </div>
                        </div>
                    </div>
                 );
                })}
            </div>

            <FavoriteForm
                isOpen={showFavoriteForm}
                onClose={closeFavoriteForm}
                defaultGameId={selectedGameId}
                onSaved={handleFavoriteSaved}
            />
            <ReviewForm
                isOpen={showReviewForm}
                onClose={closeReviewForm}
                gameId={selectedReviewGameId}
                onSaved={handleReviewSaved}
            />
            <ReviewList
                isOpen={showReviewList}
                onClose={closeReviewList}
                gameId={selectedViewGameId}
            />
        </>
    );
});
// --------------------------Carta de Juego--------------------------

export default Games;


