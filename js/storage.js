export const StorageService = {
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('favs')) || [];
        } catch { return []; }
    },
    save(id) {
        const favs = this.getFavorites();
        if (!favs.includes(id)) {
            localStorage.setItem('favs', JSON.stringify([...favs, id]));
        }
    }
};