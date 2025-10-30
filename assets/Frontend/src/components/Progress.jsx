import React from 'react'
import './CSS/Progress.css'


const Progress = ({ favoritesCount = 0, completedCount = 0, incompleteCount = 0 }) => {
        // ... existing code ...
        return (
            <section class="progress-section">
                <h1>Progreso</h1>
                {/* ... existing code ... */}
                <section id="Wishlist">
                    <h4>Lista de Favoritos ({favoritesCount})</h4>
                    {/* Mostrar cantidad de favoritos */}
                    
                </section>
                {/* ... existing code ... */}
                <section id="Played">
                    <h4>Juegos Completados ({completedCount})</h4>
                </section>
    
                <section id="Sin-Completar">
                    <h4>Juegos Sin Completar ({incompleteCount})</h4>
                </section>
    
                <section id="JC">
                    <p>Diseñado Para: Jóvenes CreaTIvos 2025 ©Copyright</p>
                </section>
            </section>
        )
        // ... existing code ...
    }

export default Progress
