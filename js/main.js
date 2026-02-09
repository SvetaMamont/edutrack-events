const { useState, useEffect } = React;

// Компонент картки (Props)
const EventCard = ({ event, isFav, onFavClick }) => (
    <div className={`card ${isFav ? 'highlight' : ''}`}>
        <h3>{event.title}</h3>
        <p>{event.body}</p>
        <div className="meta">ID: {event.id}</div>
        <button 
            className={`fav-btn ${isFav ? 'active' : ''}`} 
            onClick={() => onFavClick(event.id)}
        >
            {isFav ? ' У вибраному' : 'Цікаво'}
        </button>
    </div>
);

// Головний додаток (State)
const App = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);

    // Завантаження даних
    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
            .then(res => res.json())
            .then(data => setEvents(prev => [...prev, ...data]));
        
        // Завантаження вибраного
        const saved = JSON.parse(localStorage.getItem('favs')) || [];
        setFavorites(saved);
    }, [page]);

    // Infinite Scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleFav = (id) => {
        const newFavs = [...favorites, id];
        setFavorites(newFavs);
        localStorage.setItem('favs', JSON.stringify(newFavs));
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <header>
                <h1>EduTrack Lite</h1>
                <input 
                    type="text" 
                    placeholder="Пошук..." 
                    value={search} // Controlled component
                    onChange={(e) => setSearch(e.target.value)}
                    id="search-input"
                />
            </header>
            <div className="grid-container">
                {filteredEvents.map(event => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        isFav={favorites.includes(event.id)}
                        onFavClick={toggleFav}
                    />
                ))}
            </div>
        </div>
    );
};

// Рендеринг
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);