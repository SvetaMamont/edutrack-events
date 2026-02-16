const API_URL = "https://jsonplaceholder.typicode.com";

window.api = {
  fetchEvents: async () => {
    const res = await fetch(`${API_URL}/posts?_limit=12`);
    return res.json();
  },
  registerToEvent: async (eventId, data) => {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      body: JSON.stringify({ eventId, ...data }),
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  }
};
