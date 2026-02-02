import { StorageService } from './storage.js';

export function renderEvents(events) {
    const container = document.getElementById('event-container');
    const favorites = StorageService.getFavorites();

    const html = events.map(event => {
        const isFav = favorites.includes(event.id);
        return `
        <div class="card" data-id="${event.id}">
            <h3>${event.title}</h3>
            <p>${event.body}</p>
            <button class="fav-btn ${isFav ? 'active' : ''}" 
                    onclick="this.dispatchEvent(new CustomEvent('toggleFav', { 
                    detail: ${event.id}, 
                    bubbles: true
                    }))">
                 ${isFav ? 'У вибраному' : 'Додати в цікаві'}
            </button>
        </div>
    `}).join('');
    container.innerHTML += html;
}

export function showLoader(show) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = show ? 'block' : 'none';
}