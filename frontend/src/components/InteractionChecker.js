import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function InteractionChecker() {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});

    const PRESETS = [
        { label: 'Aspirin + Warfarin 🚨', drugs: ['Aspirin', 'Warfarin'] },
        { label: 'Atorvastatin + Metformin ✅', drugs: ['Atorvastatin', 'Metformin'] },
        { label: 'Ibuprofen + Loratadine ✅', drugs: ['Ibuprofen', 'Loratadine'] },
        { label: 'Aspirin + Ibuprofen ⚠️', drugs: ['Aspirin', 'Ibuprofen'] },
    ];

    const handleAddMedicine = () => {
        setMedicines([...medicines, '']);
    };

    const handleRemoveMedicine = (index) => {
        if (medicines.length > 2) {
            const newMedicines = medicines.filter((_, i) => i !== index);
            setMedicines(newMedicines);
        }
    };

    const handleMedicineChange = (index, value) => {
        const newMedicines = [...medicines];
        newMedicines[index] = value;
        setMedicines(newMedicines);
    };

    const checkInteractions = async (overrideMedicines = null) => {
        const listToUse = Array.isArray(overrideMedicines) ? overrideMedicines : medicines;
        const filteredMedicines = listToUse.filter(m => m.trim() !== '');
        if (filteredMedicines.length < 2) {
            setError('Please enter at least two medicine names.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setExpandedCards({});

        try {
            const response = await fetch(`${API_BASE_URL}/api/check-interactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ medicines: filteredMedicines }),
            });

            if (!response.ok) {
                throw new Error('Failed to check interactions. Please try again.');
            }

            const data = await response.json();
            setResult(data);
            
            // Expand all by default
            if (data.interactions) {
                const initialExpanded = {};
                data.interactions.forEach((_, idx) => {
                    initialExpanded[idx] = true;
                });
                setExpandedCards(initialExpanded);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPreset = (drugs) => {
        setMedicines(drugs);
        checkInteractions(drugs);
    };

    const handleClearAll = () => {
        setMedicines(['', '']);
        setResult(null);
        setError(null);
        setExpandedCards({});
    };

    const toggleCard = (index) => {
        setExpandedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getSeverityColor = (severity) => {
        switch (severity.toLowerCase()) {
            case 'dangerous': return '#ff4d4d';
            case 'caution': return '#ffa500';
            case 'safe': return '#4caf50';
            default: return '#666';
        }
    };

    return (
        <div className="App">
            <div className="container">
                <header className="header">
                    <button className="back-btn" onClick={() => navigate('/')}>← Home</button>
                    <h1 className="title">
                        <span className="icon">🤝</span>
                        Interaction Checker
                    </h1>
                    <p className="subtitle">
                        Check if taking multiple medicines together is safe and avoid adverse reactions
                    </p>
                </header>

                <div className="main-content">
                    <div className="interaction-form-card">
                        <div className="form-card-header">
                            <h3>Enter Medicines</h3>
                            <button className="clear-btn-text" onClick={handleClearAll} title="Clear all fields">
                                🧹 Clear All
                            </button>
                        </div>
                        
                        <div className="presets-container">
                            <span className="presets-label">Quick Test Presets:</span>
                            <div className="preset-badges">
                                {PRESETS.map((preset, idx) => (
                                    <button 
                                        key={idx} 
                                        className="preset-badge" 
                                        onClick={() => handleApplyPreset(preset.drugs)}
                                        disabled={loading}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="inputs-container">
                            {medicines.map((medicine, index) => (
                                <div key={index} className="medicine-input-group slide-in">
                                    <span className="input-index-badge">{index + 1}</span>
                                    <span className="input-field-icon">💊</span>
                                    <input
                                        type="text"
                                        placeholder={`Enter medicine name (e.g., Aspirin)`}
                                        value={medicine}
                                        onChange={(e) => handleMedicineChange(index, e.target.value)}
                                        className="medicine-input"
                                    />
                                    {medicines.length > 2 && (
                                        <button 
                                            className="remove-btn" 
                                            onClick={() => handleRemoveMedicine(index)}
                                            title="Remove field"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="form-actions">
                            <button className="add-btn" onClick={handleAddMedicine} disabled={loading}>
                                ➕ Add Another Medicine
                            </button>
                            <button 
                                className="check-btn" 
                                onClick={() => checkInteractions()}
                                disabled={loading}
                            >
                                {loading ? '🔍 Checking...' : '⚡ Check Interactions'}
                            </button>
                        </div>

                        {error && <div className="error-message shake">{error}</div>}
                    </div>

                    {loading && (
                        <div className="skeleton-loader-container">
                            <div className="skeleton-status-pulse"></div>
                            <div className="skeleton-card-pulse"></div>
                            <div className="skeleton-card-pulse"></div>
                            <p className="loading-subtext">Comparing chemical profiles and querying drug-drug interaction databases...</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="results-container slide-up">
                            <div className={`overall-status-card ${result.overall_status.toLowerCase()}`}>
                                <span className="status-badge-icon">
                                    {result.overall_status.toLowerCase() === 'dangerous' ? '🚨' :
                                     result.overall_status.toLowerCase() === 'caution' ? '⚠️' : '✅'}
                                </span>
                                <h2>Overall Status: {result.overall_status}</h2>
                            </div>

                            <div className="interactions-list">
                                {result.interactions.map((interaction, index) => {
                                    const isExpanded = expandedCards[index];
                                    return (
                                        <div key={index} className={`interaction-detail-card ${isExpanded ? 'expanded' : ''}`}>
                                            <div className="interaction-card-header" onClick={() => toggleCard(index)}>
                                                <div 
                                                    className="severity-tag" 
                                                    style={{ backgroundColor: getSeverityColor(interaction.severity) }}
                                                >
                                                    {interaction.severity}
                                                </div>
                                                <span className="interaction-title-text">
                                                    Interaction Detail #{index + 1}
                                                </span>
                                                <span className="accordion-arrow">{isExpanded ? '▼' : '▶'}</span>
                                            </div>
                                            
                                            {isExpanded && (
                                                <div className="interaction-card-body">
                                                    <p className="explanation"><strong>Explanation:</strong> {interaction.explanation}</p>
                                                    
                                                    {interaction.harmful_effects && interaction.harmful_effects.length > 0 && (
                                                        <div className="harmful-effects">
                                                            <strong>⚠️ Potential Harmful Effects:</strong>
                                                            <ul>
                                                                {interaction.harmful_effects.map((effect, i) => (
                                                                    <li key={i}>{effect}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="advice-box">
                                                        <strong>💡 Clinical Advice:</strong> {interaction.advice}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="disclaimer-info">
                                <p>{result.disclaimer}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InteractionChecker;
