// --- СТОРІНКА 1: ГОЛОВНА ---
const HomePage = () => {
    const router = window.ReactRouterDOM;
    if (!router) return null;

    const { Link } = router;
    const dispatch = ReactRedux.useDispatch();

    const events = ReactRedux.useSelector(
  state => Object.values(state.events.entities)
);

const loading =
  ReactRedux.useSelector(
    state => state.events.loading
        );
    
    React.useEffect(() => {
  dispatch(window.actions.fetchEvents());
}, [dispatch]);
    

    return (
    <div>

        {/* кнопка переходу */}
        <Link to="/analytics" className="analytics-btn">
             Аналітика
        </Link>

        <div className="grid-container">
            {events.map(event => (
                <div key={event.id} className="card">
                    <h3>{event.title}</h3>

                    <div className="actions">
                        <Link to={`/register/${event.id}`}>
                            Реєстрація
                        </Link>

                        <Link to={`/participants/${event.id}`}>
                            Учасники
                        </Link>
                    </div>

                </div>
            ))}
        </div>
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
    const dispatch = ReactRedux.useDispatch();

    const participants =
  ReactRedux.useSelector(
    window.selectFilteredParticipants
        );
    
    const loading =
  ReactRedux.useSelector(
    s => s.participants.loading
        );
    
    React.useEffect(() => {
  dispatch(
    window.actions.fetchParticipants(eventId)
  );
    }, [eventId, dispatch]);
    

    return (
    <div className="participants-container">
        <h2>Учасники події #{eventId}</h2>

        <input
            placeholder="Пошук по імені або email"
            onChange={(e)=>
                dispatch(
                    window.actions.setSearch(e.target.value)
                )
            }
        />

        {loading && <p>Loading...</p>}

        <ul>
            {participants.map(p => (
                <li key={p.id}>
                    <strong>{p.name}</strong> — {p.email}
                </li>
            ))}
        </ul>

        <Link to="/">← Назад</Link>
    </div>
);
};

// --- СТОРІНКА АНАЛІТИКИ ---
const AnalyticsPage = () => {

    const dispatch = ReactRedux.useDispatch();
    const participants =
        ReactRedux.useSelector(
            state => Object.values(state.participants.entities)
        );

    React.useEffect(() => {
        dispatch(window.actions.fetchParticipants(1));
    }, [dispatch]);

    const registrationsByDay = React.useMemo(() => {
        const result = {};

        participants.forEach(p => {
            const day =
                new Date(Date.now() - (p.id % 7) * 86400000)
                .toLocaleDateString();

            result[day] = (result[day] || 0) + 1;
        });

        return {
            labels: Object.keys(result),
            datasets: [{
                label: "Реєстрації",
                data: Object.values(result)
            }]
        };
    }, [participants]);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" }
        }
    };

    const { Line } = window["react-chartjs-2"];

    return (
        <div className="analytics">
            <h2>Аналітика реєстрацій</h2>

            <div style={{maxWidth:"900px"}}>
                <Line
                    data={registrationsByDay}
                    options={options}
                />
            </div>
        </div>
    );
};