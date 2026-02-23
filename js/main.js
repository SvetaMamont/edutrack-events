// main.js
const App = () => {
    const router = window.ReactRouterDOM;
    if (!router) return <div>Завантаження маршрутизації...</div>;

    const { BrowserRouter, Routes, Route } = router;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register/:eventId" element={<RegisterPage />} />
                <Route path="/participants/:eventId" element={<ParticipantsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
        </BrowserRouter>
    );
};

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// Функція для запуску додатка
const startApp = () => {
    // 1. Намагаємося ініціалізувати Store
    const isStoreReady = window.initReduxStore ? window.initReduxStore() : false;

    // 2. Перевіряємо, чи всі бібліотеки готові
    if (isStoreReady && window.ReactRedux && window.store) {
        const { Provider } = window.ReactRedux;
        root.render(
            <Provider store={window.store}>
                <App />
            </Provider>
        );
    } else {
        // Якщо ні, чекаємо 100мс і пробуємо знову
        console.log("Стан:", {
    RTK: !!window.ReduxToolkit,
    ReactRedux: !!window.ReactRedux,
    Store: !!window.store,
    API: !!window.api
});
        setTimeout(startApp, 100);
    }
};

startApp();