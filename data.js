const STORAGE_KEY = "SI_KUTU_BUKU";
let books = [];

const BookStorage = {
    isExist() {
        if (typeof(Storage) === undefined) {
            alert("Browser tidak mendukung local storage");
            return false
        }
        return true
    },
    saveData() {
        const parsedData = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsedData)
        document.dispatchEvent(new Event("ondatasaved"))
    },
    loadData() {
        const serializedData = localStorage.getItem(STORAGE_KEY)
        let data = JSON.parse(serializedData);

        if (data !== null) books = data

        document.dispatchEvent(new Event("ondataloaded"))
    },
    updateData() {
        if (this.isExist()) this.saveData()
    },
    composeBookObject(book) {
        return {
            id: `book-${+new Date()}`,
            title: book.title,
            author: book.author,
            year: book.year,
            isCompleted: book.isCompleted,
        }
    },
    getBook(bookId) {
        for (book of books) {
            if (book.id === bookId)
                return book
        }
        return null
    },
    getBookId(bookId) {
        let index = 0
        for (book of books) {
            if (book.id === bookId)
                return index

            index++
        }
        return -1
    }
}