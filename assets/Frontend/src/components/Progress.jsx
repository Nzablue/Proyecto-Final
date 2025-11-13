import React from 'react'
import './CSS/Progress.css'

// ------------------------- Progreso -------------------------
const Progress = ({ gamesCount = 0, favoritesCount = 0, completedCount = 0, incompleteCount = 0 }) => {
    // --------------------------Progreso--------------------------

        // --------------------------Seccion de Favoritos--------------------------
        return (
            <section className="progress-section">
                <h1>Progreso</h1>

                <section>
                    <h4>Total de Juegos ({gamesCount})</h4>
                </section>
              
                <section id="Wishlist">
                    <h4>Lista de Favoritos ({favoritesCount})</h4>
                
                </section>
                {/* --------------------------Seccion de Favoritos-------------------------- */}


                {/* --------------------------Seccion de Juegos Completados-------------------------- */}
                <section id="Played">
                    <h4>Juegos Completados ({completedCount})</h4>
                </section>
                {/* --------------------------Seccion de Juegos Completados-------------------------- */}

                {/* --------------------------Seccion de Juegos Sin Completar-------------------------- */}
                <section id="Sin-Completar">
                    <h4>Juegos Sin Completar ({incompleteCount})</h4>
                </section>
                {/* --------------------------Seccion de Juegos Sin Completar-------------------------- */}
    
                {/* --------------------------Seccion de Copyright-------------------------- */}
                <section id="JC">
                    <p>Diseñado Para: Jóvenes CreaTIvos 2025 ©Copyright</p>
                </section>
               </section>
                // --------------------------Seccion de Copyright--------------------------
        )
        
    }

export default Progress
