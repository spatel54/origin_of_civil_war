import React from 'react';

const Flashcard = ({ card, flipped, setFlipped }) => {
    return (
        <div className="flashcard-wrapper">
            <div
                className={`flashcard ${flipped ? 'flipped' : ''}`}
                onClick={() => setFlipped(!flipped)}
            >
                {/* Front */}
                <div className="card-face card-front">
                    <h2 className="card-term">{card.term}</h2>
                    <p className="card-hint">Click to reveal details</p>
                </div>

                {/* Back */}
                <div className="card-face card-back">
                    <div className="card-back-header">
                        <h3>{card.term}</h3>
                    </div>

                    <div className="card-back-grid">
                        <InfoItem label="Who" value={card.who} fullWidth />
                        <InfoItem label="What" value={card.what} fullWidth />

                        <div className="card-back-row">
                            <InfoItem label="When" value={card.when} />
                            <InfoItem label="Where" value={card.where} />
                        </div>

                        <InfoItem
                            label={card.result ? "Result" : "Why Important"}
                            value={card.result || card.why}
                            fullWidth
                            highlight
                        />

                        {/* If both exist, show both, otherwise the logic above handles one */}
                        {card.result && card.why && (
                            <InfoItem label="Importance" value={card.why} fullWidth />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value, fullWidth = false, highlight = false }) => {
    if (!value) return null;
    return (
        <div className={`card-info-item ${fullWidth ? 'full-width' : ''} ${highlight ? 'highlight' : ''}`}>
            <span className="card-label">{label}</span>
            <p className="card-value">{value}</p>
        </div>
    );
};

export default Flashcard;
