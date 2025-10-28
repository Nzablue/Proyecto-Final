import React, { useEffect, useState } from 'react';

// ... existing code ...
function FavoriteForm({ isOpen, onClose, defaultGameId, onSaved }) {
    // ... existing code ...
    const [games, setGames] = useState([]);
    const [gameId, setGameId] = useState(defaultGameId || '');
    const [note, setNote] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/games')
            .then((res) => res.json())
            .then((data) => setGames(data))
            .catch(() => setGames([]));
    }, []);

    useEffect(() => {
        setGameId(defaultGameId || '');
    }, [defaultGameId, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId, note }),
            });
            if (!res.ok) throw new Error('Error al guardar favorito');
            const saved = await res.json();
            onSaved && onSaved(saved);
            onClose && onClose();
            setNote('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="favorite-form-modal">
            <div className="favorite-form-content">
                <h3>Agregar a Favoritos</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Juego
                        <select value={gameId} onChange={(e) => setGameId(e.target.value)} required>
                            <option value="" disabled>Selecciona un juego</option>
                            {games.map((g) => (
                                <option key={g._id} value={g._id}>{g.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Nota (opcional)
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ej: razones para guardar"
                        />
                    </label>

                    <div className="favorite-form-actions">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
// ... existing code ...

export default FavoriteForm;