import express from "express";

const app = express();
const PORT = 3000;

// Фіктивні дані
const events = [
  { id: 1, title: "React Workshop", date: "2026-03-10" },
  { id: 2, title: "Node.js Meetup", date: "2026-03-12" },
  { id: 3, title: "JavaScript Conference", date: "2026-04-01" },
  { id: 4, title: "Frontend Bootcamp", date: "2026-02-20" },
  { id: 5, title: "Backend Summit", date: "2026-05-05" },
  { id: 6, title: "Web Security Talk", date: "2026-01-18" }
];


// Middleware для логування часу
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});


// GET /events
app.get("/events", (req, res) => {

  let { page = 1, limit = 5, sort = "date", order = "asc" } = req.query;

  page = Number(page);
  limit = Number(limit);

  // Валідація
  if (page < 1 || limit < 1) {
    return res.status(400).json({
      error: "page і limit повинні бути більше 0"
    });
  }

  if (!["date", "title"].includes(sort)) {
    return res.status(400).json({
      error: "sort може бути тільки 'date' або 'title'"
    });
  }

  if (!["asc", "desc"].includes(order)) {
    return res.status(400).json({
      error: "order може бути 'asc' або 'desc'"
    });
  }

  let result = [...events];

  // Сортування
  result.sort((a, b) => {
    if (sort === "date") {
      return order === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }

    if (sort === "title") {
      return order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  // Пагінація
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = result.slice(start, end);

  res.json({
    page,
    limit,
    total: events.length,
    data: paginated
  });

});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});