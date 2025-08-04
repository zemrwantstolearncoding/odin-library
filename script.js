let myLibrary = [];

class Book {
    constructor(title, author, totalPages, readPages) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.totalPages = totalPages;
        this.readPages = readPages;

        if (this.totalPages - this.readPages) {
            this.read = false;
        } else {
            this.read = true;
        }
    }
    toggleRead() {
        this.read = !this.read;
    }
}


function addBookToLibrary(title, author, totalPages, readPages) {
    const newBook = new Book(title, author, totalPages, readPages);
    myLibrary.push(newBook);
}

function deleteUserBook(event) {
    console.log(event.target.id);
    const bookToDelete = document.querySelector(`div.book-card[id="${event.target.id}"]`);
    bookToDelete.remove();
    const myModifiedLibrary = myLibrary.filter((book) => book.id !== event.target.id);
    myLibrary = myModifiedLibrary;
    console.log(myLibrary);
}

function toggleReadBook(event) {
    const bookToToggle = myLibrary.find((book) => book.id === event.target.id);
    bookToToggle.toggleRead();
    const readProgress = document.querySelector(`div.read-progress[id="${event.target.id}"]`);
    if (readProgress) {
        readProgress.remove();
    }
    
    const progressDot = document.querySelector(`div.progress-dot[id="${event.target.id}"]`);
    const dot = progressDot.firstElementChild;
    const dotText = progressDot.lastElementChild;

    progressDot.classList.toggle("orange");
    progressDot.classList.toggle("green");
    dot.classList.toggle("orange");
    dot.classList.toggle("green");

    if (dotText.textContent === "Completed") {
        dotText.textContent = "In Progress";
        event.target.textContent = "Read";
    } else {
        dotText.textContent = "Completed";
        event.target.textContent = "Unread";
    }
}

function displayBook(book) {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.id = book.id;

    const dot = document.createElement("span");
    dot.classList.add("dot");
    const dotText = document.createElement("span");

    const progressDot = document.createElement("div");
    progressDot.classList.add("progress-dot");
    progressDot.id = book.id;

    if (book.read) {
        progressDot.classList.add("green");
        dot.classList.add("green");
        dotText.textContent = "Completed";
    } else {
        progressDot.classList.add("orange");
        dot.classList.add("orange");
        dotText.textContent = "In Progress";
    }

    progressDot.appendChild(dot);
    progressDot.appendChild(dotText);

    const title = document.createElement("p");
    const author = document.createElement("p");
    const totalPages = document.createElement("p");

    title.textContent = book.title;
    author.textContent = "by " + book.author;
    totalPages.textContent = book.totalPages + " pages";

    const bookInfo = document.createElement("div");
    bookInfo.classList.add("book-info");
    bookInfo.appendChild(progressDot);
    bookInfo.appendChild(title);
    bookInfo.appendChild(author);
    bookInfo.appendChild(totalPages);

    bookCard.appendChild(bookInfo);

    const deleteBook = document.createElement("button");
    deleteBook.id = book.id;
    deleteBook.textContent = "Delete";
    deleteBook.addEventListener("click", deleteUserBook);

    const toggleRead = document.createElement("button");
    toggleRead.id = book.id;
    if (book.read) {
        toggleRead.textContent = "Unread";
    } else {
        toggleRead.textContent = "Read";
    }
    toggleRead.addEventListener("click", toggleReadBook);

    const bookUtility = document.createElement("div");
    bookUtility.classList.add("book-utility");
    bookUtility.appendChild(deleteBook);
    bookUtility.appendChild(toggleRead);

    const progressStatus = document.createElement("p");
    progressStatus.classList.add("progress-status");
    progressStatus.textContent = `${book.readPages} / ${book.totalPages}`;

    const progressInside = document.createElement("div");
    progressInside.classList.add("progress-inside");
    const currentProgress = ((book.readPages / book.totalPages) * 100).toFixed(2);
    progressInside.style["width"] = `${currentProgress}%`;

    const readProgress = document.createElement("div");
    readProgress.classList.add("read-progress");
    readProgress.id = book.id;
    readProgress.appendChild(progressStatus);
    readProgress.appendChild(progressInside);

    const readStatus = document.createElement("div");
    readStatus.classList.add("read-status");
    readStatus.appendChild(bookUtility);
    readStatus.appendChild(readProgress);

    bookCard.appendChild(readStatus);
    allBooks.appendChild(bookCard);
}

addBookToLibrary('The Alchemist', 'Paulo Coelho', 182, 121);
addBookToLibrary("Harry Potter and the Philosopher's Stone", 'J. K. Rowling', 333, 333);
addBookToLibrary('The Perks of Being a Wallflower', 'Stephen Chbosky', 213, 213);
addBookToLibrary('The da Vinci Code', 'Dan Brown', 480, 25);
addBookToLibrary('Pride and Prejudice', 'Jane Austen', 400, 0);
addBookToLibrary('The Great Gatsby', 'F. Scott Fitzgerald', 180, 180);

const allBooks = document.querySelector("div.all-books");

myLibrary.forEach(book => displayBook(book));

function addUserBook(event) {

    const formAlert = document.querySelector("div.form-alert");
    formAlert.classList.add("hidden");

    const addBookForm = document.querySelector("form.form-section");
    if (!addBookForm.checkValidity()) {
        addBookForm.reportValidity();
        return;
    }

    formData = new FormData(addBookForm);
    const title = formData.get("title");
    const author = formData.get("author");
    const totalPages = formData.get("total-pages");
    const readPages = formData.get("read-pages");

    if (readPages > totalPages) {
        formAlert.classList.remove("hidden");
        event.preventDefault();
        return;
    }

    addBookToLibrary(title, author, totalPages, readPages);
    displayBook(myLibrary.at(-1));

    event.preventDefault();
}

const addBookButton = document.querySelector("button.add-book");
addBookButton.addEventListener("click", addUserBook);
