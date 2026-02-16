window.StorageService = {
  getFavorites() {
    return JSON.parse(localStorage.getItem("favs") || "[]");
  },
  save(id) {
    const favs = this.getFavorites();
    if (!favs.includes(id)) {
      localStorage.setItem("favs", JSON.stringify([...favs, id]));
    }
  }
};
