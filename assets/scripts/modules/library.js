export class Library {
  stockBook = [];

  constructor() {
    //load books from local storage on initialization
    this.loadFromLocalStorage();
  }

  add(...books) {
    this.stockBook.push(...books);
    this.saveToLocalStorage();
    return this.stockBook;
  }

  remove(bookId) {
    this.stockBook = this.stockBook.filter((book) => book.id !== bookId);
    this.saveToLocalStorage();
  }

  /* ***Local Storage*** */
  saveToLocalStorage() {
    localStorage.setItem("libraryBooks", JSON.stringify(this.stockBook));
  }

  loadFromLocalStorage() {
    const books = localStorage.getItem("libraryBooks");
    try {
      this.stockBook = books ? JSON.parse(books) : [];
    } catch (error) {
      console.error("Error parsing localStorage data :", error);
      this.stockBook = [];
    }
  }

  //by title or author
  searchBook(query) {
    const lowerCaseQuery = query.toLowerCase();
    const findBook = this.stockBook.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerCaseQuery) ||
        b.author.toLowerCase().includes(lowerCaseQuery) ||
        b.genre.toLowerCase().includes(lowerCaseQuery)
    );
    return findBook.length > 0
      ? findBook
      : `No result for your research: "${query}"`;
  }

  displayBook() {
    for (const book of this.stockBook) {
      console.log(book);
    }
  }
}
