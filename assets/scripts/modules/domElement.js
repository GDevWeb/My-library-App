import { MESSAGES } from "../utils/constants.js";

export class DOMElement {
  constructor(collectionBooksInstance) {
    this.booksList = collectionBooksInstance;
    this.bookListContainer = document.getElementById("list-book-container");

    // Ensure the "Clear Library" button is created
    this.createClearLibraryButton();
  }

  renderBooks() {
    // Clear existing content
    this.bookListContainer.innerHTML = "";

    if (this.booksList.stockBook.length === 0) {
      this.bookListContainer.innerHTML = `<p>No books available</p>`;
      return;
    }

    // Render each book
    this.booksList.stockBook.forEach((book) => {
      const bookItem = this.createBookItem(book);
      this.bookListContainer.appendChild(bookItem);
    });
  }

  createBookItem(book) {
    const card = document.createElement("div");
    card.id = `book-${book.id}`;
    card.className = "book-card";

    const title = document.createElement("h2");
    // checkValidity
    title.innerHTML =
      book.title.trim() !== "" && typeof book.title === "string"
        ? book.title[0].toUpperCase() + book.title.slice(1)
        : "Untitled Book";
    card.appendChild(title);

    const author = document.createElement("p");
    // checkValidity
    author.innerHTML =
      book.author.trim() !== "" && typeof book.author === "string"
        ? `<strong>Author:</strong> ${book.author}`
        : "Anonymous Author";
    card.appendChild(author);

    const genre = document.createElement("p");
    // checkValidity
    genre.innerHTML =
      book.genre.trim() !== "" && typeof book.genre === "string"
        ? `<strong>Genre:</strong> ${book.genre}`
        : "Undefined";
    card.appendChild(genre);

    const year = document.createElement("p");
    // checkValidity
    const currentYear = new Date().getFullYear();
    let checkedYear;
    isNaN(book.year) || book.year > currentYear
      ? (checkedYear = currentYear)
      : (checkedYear = book.year);
    year.innerHTML = `<strong>Year:</strong> ${checkedYear}`;
    card.appendChild(year);

    // CRUD button
    const containerCRUDButton = document.createElement("div");
    containerCRUDButton.id = "containerCRUDButton";
    containerCRUDButton.className = "containerCRUDButton";
    // Add Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "editButton";
    card.appendChild(editButton);

    containerCRUDButton.appendChild(editButton);

    // Handle Edit button click
    editButton.addEventListener("click", () => {
      this.openEditForm(book); // Open the form for editing
    });

    // Add Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteButton";

    deleteButton.addEventListener("click", () => {
      this.booksList.remove(book.id); // Remove book by ID
      this.renderBooks(); // Re-render the updated list

      this.showToast(MESSAGES.DELETE_SUCCESS, "error");
    });
    containerCRUDButton.appendChild(deleteButton);
    card.appendChild(containerCRUDButton);

    return card;
  }

  openEditForm(book) {
    const form = document.getElementById("addBookForm");

    // Pre-fill the form with the book's current details
    form.querySelector("#title").value = book.title;
    form.querySelector("#author").value = book.author;
    form.querySelector("#genre").value = book.genre;
    form.querySelector("#year").value = book.year;

    // Temporarily update the form submit behavior
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.textContent = "Update Book";

    const submitHandler = (e) => {
      e.preventDefault();

      // Update the book details
      book.title = form.querySelector("#title").value;
      book.author = form.querySelector("#author").value;
      book.genre = form.querySelector("#genre").value;
      book.year = parseInt(form.querySelector("#year").value);

      this.booksList.saveToLocalStorage();
      form.reset();
      submitButton.textContent = "Add Book";
      this.renderBooks();

      this.showToast(MESSAGES.EDIT_SUCCESS, "info");

      // Restore the default add book handler
      form.removeEventListener("submit", submitHandler);
      form.addEventListener("submit", this.handleAddBook.bind(this));
    };

    form.removeEventListener("submit", this.handleAddBook);
    form.addEventListener("submit", submitHandler);
  }

  createClearLibraryButton() {
    if (document.getElementById("clearLibrary")) return;

    const clearLibraryButton = document.createElement("button");
    clearLibraryButton.id = "clearLibrary";
    clearLibraryButton.textContent = "Clear Library";
    clearLibraryButton.className = "clearLibraryButton";

    const parentContainer = document.getElementById("app");
    parentContainer.appendChild(clearLibraryButton);

    clearLibraryButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear the library?")) {
        this.booksList.stockBook = [];
        this.booksList.saveToLocalStorage();
        this.renderBooks();
        this.showToast(MESSAGES.CLEAR_SUCCESS, "error");
      }
    });
  }

  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}
