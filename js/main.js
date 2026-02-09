import { fetchEvents } from './api.js';
import { StorageService } from './storage.js';
import { Header, EventCard } from './components.js';

// Імітація State (стан додатка)
let state = {
    events: [],
    searchQuery: '',
    favorites: StorageService.getFavorites(),
    page: 1,
    isLoading: false
};

const container = document.getElementById('event-container');
const headerContainer = document.getElementById('header-root');

// Функція рендерингу (аналог React render)
function render() {
    // Рендерим заголовок
    headerContainer.innerHTML = Header(state.searchQuery);
    
    // Фільтруємо список (Вимога завдання)
    const filtered = state.events.filter(ev => 
        ev.title.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    // Рендерим список
    container.innerHTML = filtered.map(event => EventCard({
        event,
        isFav: state.favorites.includes(event.id),
        onFavClick: () => {} // Обробка нижче через делегування
    })).join('');

    // Повертаємо фокус в інпут після перемальовки
    const input = document.getElementById('search-input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}

// Завантаження даних (Твій функціонал)
async function loadMore() {
    if (state.isLoading) return;
    state.isLoading = true;
    
    try {
        const newData = await fetchEvents(state.page);
        state.events = [...state.events, ...newData];
        state.page++;
        render();
    } catch (err) {
        console.error(err);
    } finally {
        state.isLoading = false;
    }
}

// Події Пошуку (Керований компонент)
headerContainer.addEventListener('input', (e) => {
    if (e.target.id === 'search-input') {
        state.searchQuery = e.target.value;
        render(); // Динамічна фільтрація
    }
});

// Події кнопок (LocalStorage)
container.addEventListener('click', (e) => {
    if (e.target.classList.contains('fav-btn')) {
        const id = parseInt(e.target.dataset.id);
        StorageService.save(id);
        state.favorites = StorageService.getFavorites();
        render();
    }
});

// Infinite Scroll (Твій функціонал)
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore();
    }
});

// Старт
loadMore();