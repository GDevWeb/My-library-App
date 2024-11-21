import { Book } from "./modules/book.js";
import { DOMElement } from "./modules/domElement.js";
import { Library } from "./modules/library.js";
import { FORM_VALIDATION_MESSAGES, MESSAGES } from "./utils/constants.js";

class App {
  static init() {
    const myLibrary = new Library();
    const domElement = new DOMElement(myLibrary);

    // Handle adding new books
    const addBookForm = document.getElementById("addBookForm");
    addBookForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const title = formData.get("title");
      const author = formData.get("author");
      const genre = formData.get("genre");
      const year = parseInt(formData.get("year"));

      // checkFormData :
      if (title.trim() === "") {
        console.error(FORM_VALIDATION_MESSAGES.TITLE_REQUIRED, "error");
        return;
      }
      if (author.trim() === "") {
        console.error(FORM_VALIDATION_MESSAGES.AUTHOR_REQUIRED, "error");
        return;
      }
      if (genre.trim() === "") {
        console.error(FORM_VALIDATION_MESSAGES.GENRE_REQUIRED, "error");
        return;
      }
      if (isNaN(year)) {
        console.error(FORM_VALIDATION_MESSAGES.YEAR_INVALID, "error");
        return;
      }

      const newBook = new Book(title, author, genre, year);
      myLibrary.add(newBook);

      e.target.reset();
      domElement.renderBooks();
      domElement.showToast(MESSAGES.ADD_SUCCESS, "success");
    });

    // Handle searching for books
    const searchBookForm = document.getElementById("searchBookForm");
    const searchResultsDiv = document.getElementById("searchResults");

    searchBookForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const query = document.getElementById("searchQuery").value.trim();
      const results = myLibrary.searchBook(query);

      searchResultsDiv.innerHTML = ""; // Clear previous results

      if (Array.isArray(results)) {
        results.forEach((book) => {
          const bookDetails = document.createElement("p");
          bookDetails.textContent = `${book.title} by ${book.author}, Genre: ${book.genre}, Year: ${book.year}`;
          searchResultsDiv.appendChild(bookDetails);
        });
      } else {
        // Show no results message
        searchResultsDiv.textContent = results;
      }

      domElement.showToast(
        Array.isArray(results)
          ? MESSAGES.SEARCH_RESULT
          : MESSAGES.SEARCH_NO_RESULT,
        Array.isArray(results) ? "info" : "error"
      );
    });

    // Render books initially
    domElement.renderBooks();
  }
}

App.init();
