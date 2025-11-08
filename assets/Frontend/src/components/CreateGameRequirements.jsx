import React, { useState } from 'react';
import './CSS/CreateGameRequirements.css';

const CreateGameRequirements = ({ isOpen, onClose, onGameCreated }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [gameData, setGameData] = useState({
        name: '',
        banner: '',
        hours: '',
        progress: '',
        type: '',
        level: 'Principiante'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const requirements = [
        {
            title: "Requisito 1: Nombre del Juego",
            description: "Debe tener un nombre único y descriptivo que identifique claramente el juego.",
            field: 'name',
            type: 'text',
            placeholder: "Ej: The Legend of Zelda: Breath of the Wild"
        },
        {
            title: "Requisito 2: Banner o Imagen",
            description: "Debe incluir una imagen representativa del juego (URL válida). La imagen debe ser clara y de buena calidad.",
            field: 'banner',
            type: 'text',
            placeholder: "https://ejemplo.com/imagen-del-juego.jpg"
        },
        {
            title: "Requisito 3: Horas Jugadas",
            description: "Debe especificar el número de horas que has jugado (debe ser un número positivo).",
            field: 'hours',
            type: 'number',
            placeholder: "Ej: 120",
            min: 0
        },
        {
            title: "Requisito 4: Progreso del Juego",
            description: "Debe indicar el porcentaje de progreso completado (0-100%).",
            field: 'progress',
            type: 'number',
            placeholder: "Ej: 75",
            min: 0,
            max: 100
        },
        {
            title: "Requisito 5: Tipo de Juego",
            description: "Debe especificar la categoría o tipo de juego (ej: RPG, Acción, Aventura, etc.).",
            field: 'type',
            type: 'text',
            placeholder: "Ej: RPG, Acción, Aventura, Estrategia"
        },
        {
            title: "Requisito 6: Nivel o Rango",
            description: "Debe indicar tu nivel actual o rango en el juego (ej: Principiante, Intermedio, Avanzado).",
            field: 'level',
            type: 'select',
            options: ['Principiante', 'Intermedio', 'Avanzado', 'Experto', 'Maestro']
        }
    ];

    const nextStep = () => {
        if (validateCurrentStep() && currentStep < requirements.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (!validateCurrentStep()) {
            alert('Por favor completa este campo antes de continuar');
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const closeModal = () => {
        setCurrentStep(0);
        setGameData({
            name: '',
            banner: '',
            hours: '',
            progress: '',
            type: '',
            level: 'Principiante'
        });
        onClose();
    };

    const handleInputChange = (field, value) => {
        setGameData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:3000/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: gameData.name,
                    banner: gameData.banner,
                    hours: parseInt(gameData.hours),
                    progress: parseInt(gameData.progress),
                    type: gameData.type,
                    level: gameData.level
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el juego');
            }

            const newGame = await response.json();
            onGameCreated && onGameCreated(newGame);
            closeModal();
        } catch (error) {
            alert('Error al crear el juego: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateCurrentStep = () => {
        const currentReq = requirements[currentStep];
        const value = gameData[currentReq.field];
        
        if (!value || value.toString().trim() === '') {
            return false;
        }
        
        if (currentReq.field === 'hours' && parseInt(value) < 0) {
            return false;
        }
        
        if (currentReq.field === 'progress') {
            const progress = parseInt(value);
            if (progress < 0 || progress > 100) {
                return false;
            }
        }
        
        return true;
    };

    if (!isOpen) return null;

    return (
        <div className="requirements-modal-overlay">
            <div className="requirements-modal">
                <div className="requirements-header">
                    <h2>Requisitos para Crear un Nuevo Juego</h2>
                    <button className="close-button" onClick={closeModal}>×</button>
                </div>
                
                <div className="requirements-content">
                    <div className="step-indicator">
                        Paso {currentStep + 1} de {requirements.length}
                    </div>
                    
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${((currentStep + 1) / requirements.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="requirement-card">
                        <h3>{requirements[currentStep].title}</h3>
                        <p>{requirements[currentStep].description}</p>
                        
                        <div className="input-container">
                            {requirements[currentStep].type === 'select' ? (
                                <select
                                    value={gameData[requirements[currentStep].field]}
                                    onChange={(e) => handleInputChange(requirements[currentStep].field, e.target.value)}
                                    className="requirement-input"
                                >
                                    {requirements[currentStep].options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={requirements[currentStep].type}
                                    value={gameData[requirements[currentStep].field]}
                                    onChange={(e) => handleInputChange(requirements[currentStep].field, e.target.value)}
                                    placeholder={requirements[currentStep].placeholder}
                                    min={requirements[currentStep].min}
                                    max={requirements[currentStep].max}
                                    className="requirement-input"
                                />
                            )}
                        </div>
                        
                        {gameData[requirements[currentStep].field] && (
                            <div className="field-preview">
                                <strong>Valor ingresado:</strong> {gameData[requirements[currentStep].field]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="requirements-navigation">
                    <button 
                        onClick={prevStep} 
                        disabled={currentStep === 0}
                        className="nav-button prev-button"
                    >
                        Anterior
                    </button>
                    
                    <div className="step-dots">
                        {requirements.map((_, index) => (
                            <span 
                                key={index}
                                className={`dot ${index === currentStep ? 'active' : ''}`}
                                onClick={() => setCurrentStep(index)}
                            ></span>
                        ))}
                    </div>
                    
                    {currentStep < requirements.length - 1 ? (
                        <button 
                            onClick={nextStep} 
                            className="nav-button next-button"
                        >
                            Siguiente
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting || !validateCurrentStep()}
                            className="nav-button submit-button"
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Juego'}
                        </button>
                    )}
                </div>

                <div className="requirements-footer">
                    {currentStep === requirements.length - 1 && (
                        <div className="final-summary">
                            <h4>Resumen del Juego:</h4>
                            <div className="summary-item">Nombre: {gameData.name}</div>
                            <div className="summary-item">Tipo: {gameData.type}</div>
                            <div className="summary-item">Horas: {gameData.hours}</div>
                            <div className="summary-item">Progreso: {gameData.progress}%</div>
                            <div className="summary-item">Nivel: {gameData.level}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateGameRequirements;