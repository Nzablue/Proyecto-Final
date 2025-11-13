import React, { useEffect, useState } from 'react';
import './CSS/ReviewForm.css';

function ReviewForm({ isOpen, onClose, gameId, onSaved }) {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');
    const [existingId, setExistingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen || !gameId) return;
        setLoading(true);
        setExistingId(null);
        setReviewText('');
        setRating('');
        fetch(`http://localhost:3000/api/reviews?gameId=${gameId}`)
            .then((res) => res.json())
            .then((list) => {
                const existing = Array.isArray(list) ? list.find(r => r.gameId === gameId) : null;
                if (existing) {
                    setExistingId(existing._id);
                    setReviewText(existing.review || '');
                    setRating(existing.rating != null ? String(existing.rating) : '');
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isOpen, gameId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ratingNum = Number(rating);
        if (!reviewText.trim()) {
            alert('La reseña no puede estar vacía');
            return;
        }
        if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            alert('La calificación debe ser un número entre 1 y 5');
            return;
        }
        try {
            setSaving(true);
            let res;
            if (existingId) {
                res = await fetch(`http://localhost:3000/api/reviews/${existingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ review: reviewText, rating: ratingNum }),
                });
            } else {
                res = await fetch('http://localhost:3000/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameId, review: reviewText, rating: ratingNum }),
                });
            }
            if (!res.ok) throw new Error('Error al guardar la reseña');
            const saved = await res.json();
            onSaved && onSaved(saved);
            onClose && onClose();
        } catch (err) {
            alert('No se pudo guardar la reseña');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="review-modal-overlay">
            <div className="review-modal-1">
                <div className="review-header">
                    <h2>Añadir/Editar Reseña</h2>
                    <button className="review-close-button" type="button" onClick={onClose}>×</button>
                </div>

                <div className="review-content">
                    {loading ? (
                        <div>Cargando reseña...</div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <textarea
                                    className="review-input"
                                    rows={4}
                                    placeholder="Escribe tu reseña aquí"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <input
                                    className="review-input"
                                    type="number"
                                    min={1}
                                    max={5}
                                    placeholder="Calificación (1-5)"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                            </div>
                            <div className="review-actions">
                                <button className="review-submit" type="submit" disabled={saving}>
                                    {saving ? 'Guardando...' : (existingId ? 'Actualizar' : 'Guardar')}
                                </button>
                                <button className="review-cancel" type="button" onClick={onClose} disabled={saving}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReviewForm;