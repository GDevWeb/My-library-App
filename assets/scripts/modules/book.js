export class Book {
  constructor(title, author, genre, year) {
    this.id = Math.random();
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.year = year;
  }
}
