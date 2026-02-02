import { fetchEvents } from './api.js';
import { StorageService } from './storage.js';
import { renderEvents, showLoader } from './ui.js';

let page = 1;
let isThrottled = false;

async function loadMore() {
    if (isThrottled) return;
    isThrottled = true;
    showLoader(true);

    try {
        const data = await fetchEvents(page++);
        renderEvents(data);
    } catch (err) {
        console.error(err);
    } finally {
        showLoader(false);
        isThrottled = false;
    }
}

// Infinite Scroll
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const handleScroll = debounce(() => {
    const scrollBottom = window.innerHeight + window.scrollY;
    if (scrollBottom >= document.body.offsetHeight - 200) {
        loadMore();
    }
}, 250); 

window.addEventListener('scroll', handleScroll);

document.getElementById('event-container').addEventListener('toggleFav', (e) => {
    const eventId = e.detail;
    StorageService.save(eventId);
    
    const btn = e.target; 
    if (btn) {
        btn.innerText = 'У вибраному';
        btn.classList.add('active');
    }
});

loadMore();