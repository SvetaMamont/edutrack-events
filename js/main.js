const App = () => {
  const router = window.ReactRouterDOM;

  if (!router) {
    return <div>Завантаження модулів маршрутизації...</div>;
  }

  const { BrowserRouter, Routes, Route, Link } = router;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register/:eventId" element={<RegisterPage />} />
        <Route path="/participants/:eventId" element={<ParticipantsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
