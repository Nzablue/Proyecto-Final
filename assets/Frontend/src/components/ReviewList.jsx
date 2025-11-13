import React, { useEffect, useState } from 'react';
import './CSS/ReviewList.css';


function ReviewList({ isOpen, onClose, gameId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !gameId) return;
        setLoading(true);
        fetch(`http://localhost:3000/api/reviews?gameId=${gameId}`)
            .then((res) => res.json())
            .then((list) => setReviews(Array.isArray(list) ? list : []))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [isOpen, gameId]);

    if (!isOpen) return null;

    return (
        <div className="review-modal-overlay">
            <div className="review-modal">
                <div className="review-header">
                    <h2>Reseña del Juego</h2>
                    <button className="review-close-button" type="button" onClick={onClose}>×</button>
                </div>
                <div className="review-content">
                    {loading ? (
                        <div>Cargando reseñas...</div>
                    ) : reviews.length === 0 ? (
                        <div>No hay reseñas para este juego.</div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {reviews.map((r) => (
                                <li key={r._id} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                                    {r.review} {typeof r.rating === 'number' ? `(⭐ ${r.rating})` : ''}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="review-actions">
                        <button className="review-cancel" type="button" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewList;