import React, { useState, useEffect, useCallback } from 'react';
import { flashcards as initialFlashcards } from './data/flashcards';
import Flashcard from './components/Flashcard';
import { ChevronLeft, ChevronRight, LayoutGrid, CreditCard, RotateCcw, CheckCircle, XCircle, Shuffle } from 'lucide-react';

function App() {
    const [cards, setCards] = useState(initialFlashcards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [viewMode, setViewMode] = useState('study'); // 'study' or 'grid'
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    // Progress tracking state: { cardId: 'correct' | 'incorrect' | 'unseen' }
    const [progressData, setProgressData] = useState(() => {
        const saved = localStorage.getItem('civil-war-progress');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('civil-war-progress', JSON.stringify(progressData));
    }, [progressData]);

    const currentCard = cards[currentIndex];
    const totalCards = cards.length;
    const progressPercent = ((currentIndex + 1) / totalCards) * 100;

    const correctCount = Object.values(progressData).filter(v => v === 'correct').length;
    const incorrectCount = Object.values(progressData).filter(v => v === 'incorrect').length;

    const nextCard = useCallback(() => {
        setFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % totalCards);
        }, 50);
    }, [totalCards]);

    const prevCard = useCallback(() => {
        setFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
        }, 50);
    }, [totalCards]);

    const toggleFlip = useCallback(() => {
        setFlipped(prev => !prev);
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (viewMode !== 'study') return;

            if (e.code === 'Space') {
                e.preventDefault();
                toggleFlip();
            } else if (e.code === 'ArrowRight') {
                nextCard();
            } else if (e.code === 'ArrowLeft') {
                prevCard();
            } else if (e.code === 'KeyC') {
                markProgress('correct');
            } else if (e.code === 'KeyI') {
                markProgress('incorrect');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode, nextCard, prevCard, toggleFlip]);

    const markProgress = (status) => {
        setProgressData(prev => ({
            ...prev,
            [currentCard.id]: status
        }));
    };

    const showToast = (message, type = 'info') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
    };

    const shuffleCards = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setFlipped(false);
        showToast('Deck Shuffled', 'shuffle');
    };

    const resetStudy = () => {
        if (window.confirm('Reset all progress tracking and return to original order?')) {
            setProgressData({});
            setCurrentIndex(0);
            setFlipped(false);
            setCards(initialFlashcards);
            showToast('Progress Reset', 'reset');
        }
    };

    const getStatusBadge = (id) => {
        const status = progressData[id];
        if (status === 'correct') return <span className="status-badge status-correct">Mastered</span>;
        if (status === 'incorrect') return <span className="status-badge status-incorrect">Learning</span>;
        return <span className="status-badge status-unseen">Unrated</span>;
    };

    return (
        <div className="app-container">
            <header>
                <h1>Origins of the Civil War</h1>
                <p>Expert history study tool. Use <span>Arrow Keys</span> to navigate and <span>Space</span> to flip.</p>
            </header>

            <nav className="view-switcher-container">
                <div className="view-switcher-pill">
                    <button
                        className={`view-btn ${viewMode === 'study' ? 'active' : ''}`}
                        onClick={() => setViewMode('study')}
                    >
                        <CreditCard size={16} />
                        Study
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={16} />
                        List
                    </button>
                </div>
            </nav>

            {viewMode === 'study' ? (
                <main className="study-area">
                    <div className="progress-section">
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="progress-info">
                            <span className="count-tag">Card {currentIndex + 1} of {totalCards}</span>
                            <span className="percent-tag">{Math.round(progressPercent)}% Complete</span>
                        </div>
                    </div>

                    <Flashcard
                        card={currentCard}
                        flipped={flipped}
                        setFlipped={setFlipped}
                    />

                    <div className="mastery-summary">
                        <div className="mastery-chip correct">
                            <CheckCircle size={14} />
                            <span>{correctCount} Mastered</span>
                        </div>
                        <div className="mastery-chip incorrect">
                            <XCircle size={14} />
                            <span>{incorrectCount} Reviewing</span>
                        </div>
                    </div>

                    <div className="action-controls">
                        <div className="nav-group">
                            <button className="icon-btn" onClick={prevCard} title="Previous (Left Arrow)">
                                <ChevronLeft size={24} />
                            </button>

                            <div className="rating-group">
                                <button
                                    className={`rate-btn incorrect ${progressData[currentCard.id] === 'incorrect' ? 'active' : ''}`}
                                    onClick={() => markProgress('incorrect')}
                                    title="Mark Incorrect (I)"
                                >
                                    <XCircle size={20} />
                                    <span>Incorrect</span>
                                </button>

                                <button
                                    className={`rate-btn correct ${progressData[currentCard.id] === 'correct' ? 'active' : ''}`}
                                    onClick={() => markProgress('correct')}
                                    title="Mark Correct (C)"
                                >
                                    <CheckCircle size={20} />
                                    <span>Correct</span>
                                </button>
                            </div>

                            <button className="icon-btn" onClick={nextCard} title="Next (Right Arrow)">
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="utility-group">
                            <button className="util-btn" onClick={shuffleCards} title="Shuffle Deck">
                                <Shuffle size={16} />
                                Shuffle
                            </button>
                            <button className="util-btn reset" onClick={resetStudy} title="Reset All Progress">
                                <RotateCcw size={16} />
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className={`toast-container ${toast.visible ? 'visible' : ''} ${toast.type}`}>
                        {toast.type === 'shuffle' ? <Shuffle size={16} /> : <RotateCcw size={16} />}
                        {toast.message}
                    </div>
                </main>
            ) : (
                <div className="grid-view">
                    {cards.map((card) => (
                        <div key={card.id} className="grid-item">
                            <div className="grid-item-header">
                                {getStatusBadge(card.id)}
                                <h3>{card.term}</h3>
                            </div>
                            <div className="grid-item-body">
                                <div className="card-info-item">
                                    <span className="card-label">Importance</span>
                                    <p className="card-value">{card.why}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
