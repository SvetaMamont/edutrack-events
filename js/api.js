export async function fetchEvents(page = 1, limit = 10) {
    const url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Помилка мережі");
    return await response.json();
}