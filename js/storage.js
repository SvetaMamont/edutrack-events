export const StorageService = {
    getFavorites() {
        try {
            const data = localStorage.getItem('favs');
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error("Помилка при читанні localStorage:", err);
            return [];
        }
    },
    save(id) {
        try {
            const favs = this.getFavorites();
            if (!favs.includes(id)) {
                localStorage.setItem('favs', JSON.stringify([...favs, id]));
            }
        } catch (err) {
            console.error("Помилка при збереженні:", err);
        }
    }
};