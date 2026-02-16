// --- СТОРІНКА 1: ГОЛОВНА ---
const HomePage = () => {
    const router = window.ReactRouterDOM;
    if (!router) return null;

    const { Link } = router;
    const [events, setEvents] = React.useState([]);

    React.useEffect(() => {
        window.api?.fetchEvents().then(setEvents);
    }, []);

    return (
        <div className="grid-container">
            {events.map(event => (
                <div key={event.id} className="card">
                    <h3>{event.title}</h3>
                    <div className="actions">
                        <Link to={`/register/${event.id}`}>Реєстрація</Link>
                        <Link to={`/participants/${event.id}`}>Учасники</Link>
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- СТОРІНКА 2: РЕЄСТРАЦІЯ ---
const RegisterPage = () => {
    const router = window.ReactRouterDOM;
    if (!router) return null;

    const { useParams, useNavigate } = router;
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = React.useState({});
    const z = window.zod;

    const registrationSchema = z.object({
        fullName: z.string().min(3, "ПІБ занадто коротке"),
        email: z.string().email("Невірний формат Email"),
        birthDate: z.string().refine((date) => {
            const age = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24 * 365.25);
            return age >= 18;
        }, "Вам має бути 18+ років"),
        source: z.string().min(1, "Оберіть джерело")
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const result = registrationSchema.safeParse(data);
        
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach(issue => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
        } else {
            await window.api.registerToEvent(eventId, data);
            alert("Успішно зареєстровано!");
            navigate('/');
        }
    };

    return (
        <div className="form-container">
            <h2>Реєстрація на подію #{eventId}</h2>
            <form onSubmit={handleSubmit}>
                <input name="fullName" placeholder="ПІБ" />
                {errors.fullName && <p className="error">{errors.fullName}</p>}
                <input name="email" type="email" placeholder="Email" />
                {errors.email && <p className="error">{errors.email}</p>}
                <input name="birthDate" type="date" />
                {errors.birthDate && <p className="error">{errors.birthDate}</p>}
                <select name="source">
                    <option value="">Звідки дізналися?</option>
                    <option value="social">Соцмережі</option>
                    <option value="friends">Від друзів</option>
                </select>
                {errors.source && <p className="error">{errors.source}</p>}
                <button type="submit">Надіслати</button>
            </form>
        </div>
    );
};

// --- СТОРІНКА 3: УЧАСНИКИ ---
const ParticipantsPage = () => {
    const router = window.ReactRouterDOM;
    if (!router) return null;

    const { useParams, Link } = router;
    const { eventId } = useParams();
    const [participants, setParticipants] = React.useState([]);

    React.useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${eventId}/comments`)
            .then(res => res.json())
            .then(data => setParticipants(data));
    }, [eventId]);

    return (
        <div className="participants-container">
            <h2>Учасники події #{eventId}</h2>
            <ul>
                {participants.map(p => (
                    <li key={p.id}><strong>{p.name}</strong> — {p.email}</li>
                ))}
            </ul>
            <Link to="/">← Назад</Link>
        </div>
    );
};