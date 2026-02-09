// Компонент картки: приймає дані через аргументи (props)
export function EventCard({ event, isFav, onFavClick }) {
    return `
        <div class="card ${isFav ? 'highlight' : ''}">
            <h3>${event.title}</h3>
            <p>${event.body}</p>
            <div class="meta">
                <span> 12.02.2026</span> | <span> Організатор #${event.userId}</span>
            </div>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${event.id}">
                ${isFav ? ' У вибраному' : 'Додати в цікаві'}
            </button>
        </div>
    `;
}

// Компонент заголовка з керованим інпутом
export function Header(searchQuery) {
    return `
        <header>
            <h1>EduTrack Lite</h1>
            <input type="text" id="search-input" placeholder="Пошук за назвою..." value="${searchQuery}">
        </header>
    `;
}