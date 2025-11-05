import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import FavoriteForm from './FavoriteForm.jsx';
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
    const [postingReviewId, setPostingReviewId] = useState(null);
    const [reviewMessage, setReviewMessage] = useState('');

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

    // --------------------------Agregar/Editar Reseña--------------------------
    const addEditReview = async (gameId) => {
        try {
            setPostingReviewId(gameId);

            // Buscar reseña existente de este juego
            const resList = await fetch(`http://localhost:3000/api/reviews?gameId=${gameId}`);
            const list = await resList.json();
            const existing = Array.isArray(list) ? list.find(r => r.gameId === gameId) : null;

            // Prellenar prompts con valores existentes
            const initialText = existing?.review || '';
            const initialRating = existing?.rating != null ? String(existing.rating) : '';

            const reviewText = window.prompt('Escribe tu reseña:', initialText);
            if (reviewText === null) { setPostingReviewId(null); return; }

            const ratingStr = window.prompt('Calificación (1-5):', initialRating);
            if (ratingStr === null) { setPostingReviewId(null); return; }
            const rating = Number(ratingStr);

            let saveRes;
            if (existing?._id) {
                // Actualizar reseña existente
                saveRes = await fetch(`http://localhost:3000/api/reviews/${existing._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ review: reviewText, rating }),
                });
            } else {
                // Crear nueva reseña si no existe
                saveRes = await fetch('http://localhost:3000/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameId, review: reviewText, rating }),
                });
            }

            if (!saveRes.ok) throw new Error('No se pudo guardar la reseña');
            setReviewMessage(existing?._id ? 'Reseña actualizada' : 'Reseña guardada');
        } catch (err) {
            setReviewMessage('Error al guardar reseña');
        } finally {
            setPostingReviewId(null);
            setTimeout(() => setReviewMessage(''), 3000);
        }
    };
    // --------------------------Agregar/Editar Reseña--------------------------

    // --------------------------Ver Reseñas--------------------------
    const viewReview = async (gameId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/reviews?gameId=${gameId}`);
            if (!res.ok) throw new Error('No se pudo obtener reseñas');
            const list = await res.json();
            if (!list.length) {
                alert('No hay reseñas para este juego.');
                return;
            }
            const content = list.map(r => {
                const txt = r.review || r.comment || r.text || '';
                const rate = r.rating ?? r.rate ?? '';
                return `• ${txt}${rate ? ` (⭐ ${rate})` : ''}`;
            }).join('\n');
            alert(`Reseñas:\n\n${content}`);
        } catch (err) {
            alert('Error al obtener reseñas');
        }
    };
    // --------------------------Ver Reseñas--------------------------

    // --------------------------Mensajes y Título-----------------------------
    return (
        <>
            {saveMessage && <div className="favorite-feedback">{saveMessage}</div>}
            {removeMessage && <div className="favorite-feedback">{removeMessage}</div>}
            {reviewMessage && <div className="favorite-feedback">{reviewMessage}</div>}
    

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
                                    onClick={() => addEditReview(game._id)}
                                    disabled={postingReviewId === game._id}
                                >
                                    {postingReviewId === game._id ? 'Guardando...' : 'Añadir/Editar Reseña'}
                                    
                                </button>
                                {/* Botón de Ver Reseña */}
                                <button
                                    id="view-review"
                                    onClick={() => viewReview(game._id)}
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
        </>
    );
});
// --------------------------Carta de Juego--------------------------

export default Games;


