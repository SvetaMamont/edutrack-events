// store.js
window.initReduxStore = () => {
    const RTK = window.ReduxToolkit;
    const RR = window.ReactRedux;

    if (!RTK || !RR) {
        return false; // Бібліотеки ще не готові
    }

    const {
        configureStore,
        createSlice,
        createAsyncThunk,
        createEntityAdapter,
        createSelector
    } = RTK;

    const fetchEvents = createAsyncThunk(
        "events/fetchEvents",
        async () => await window.api.fetchEvents()
    );

    const eventsAdapter = createEntityAdapter();
    const eventsSlice = createSlice({
        name: "events",
        initialState: eventsAdapter.getInitialState({ loading: false, error: null }),
        extraReducers: builder => {
            builder
                .addCase(fetchEvents.pending, state => { state.loading = true; })
                .addCase(fetchEvents.fulfilled, (state, action) => {
                    state.loading = false;
                    eventsAdapter.setAll(state, action.payload);
                })
                .addCase(fetchEvents.rejected, (state) => {
                    state.loading = false;
                    state.error = "Помилка завантаження подій";
                });
        }
    });

    const fetchParticipants = createAsyncThunk(
        "participants/fetch",
        async (eventId) => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${eventId}/comments`);
            return await res.json();
        }
    );

    const participantsAdapter = createEntityAdapter();
    const participantsSlice = createSlice({
        name: "participants",
        initialState: participantsAdapter.getInitialState({ loading: false, error: null, search: "" }),
        reducers: {
            setSearch(state, action) { state.search = action.payload; }
        },
        extraReducers: builder => {
            builder
                .addCase(fetchParticipants.pending, state => { state.loading = true; })
                .addCase(fetchParticipants.fulfilled, (state, action) => {
                    state.loading = false;
                    participantsAdapter.setAll(state, action.payload);
                })
                .addCase(fetchParticipants.rejected, state => {
                    state.loading = false;
                    state.error = "Помилка завантаження учасників";
                });
        }
    });

    const participantsSelectors = participantsAdapter.getSelectors(state => state.participants);
    window.selectFilteredParticipants = createSelector(
        [participantsSelectors.selectAll, state => state.participants.search],
        (participants, search) => participants.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
        )
    );

    const themeSlice = createSlice({
        name: "theme",
        initialState: { mode: "light" },
        reducers: {
            toggleTheme(state) { state.mode = state.mode === "light" ? "dark" : "light"; }
        }
    });

    window.store = configureStore({
        reducer: {
            events: eventsSlice.reducer,
            participants: participantsSlice.reducer,
            theme: themeSlice.reducer
        }
    });

    window.actions = {
        fetchEvents,
        fetchParticipants,
        ...participantsSlice.actions,
        ...themeSlice.actions
    };

    return true; // Сховище успішно створено
};