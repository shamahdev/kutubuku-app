const Template = {
    bookItemTemplate(data) {
        const bookCard = document.createElement('div')
        bookCard.classList = 'book-card'
        bookCard.id = data.id
        bookCard.innerHTML = `
        <div class="book-icon">
                <span>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </span>
            </div>
            <div class="book-info">
                <h3>${data.title}</h3>
                <p class="author">${data.author}</p>
                <small>${data.year}</small>
                <p class="info">Tekan Enter untuk mengakhiri edit</p>
                <div class="book-action">
                    <button data-book="${data.id}" class="done-button">${data.isCompleted ? '❌ Tandakan belum selesai dibaca' : '✅ Tandakan selesai dibaca' }</button>
                    <div>
                        <button data-book="${data.id}" class="edit-button" aria-label="Edit Book Button"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                        <button data-book="${data.id}" class="delete-button" aria-label="Delete Book Button"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </div>
                </div>
            </div>
        `
        return bookCard
    },
    createToast(text, type = '') {
        const toastElement = document.createElement('div')
        toastElement.classList = `toast ${type}`
        toastElement.innerHTML = `<p>${text}</p> <button class="close-toast" onclick="this.parentNode.remove()">X</button>`

        const shelf = document.querySelector('.shelf-container')
        shelf.insertBefore(toastElement, shelf.firstChild)

        setTimeout(() => {
            toastElement.remove()
        }, 2000)
    }
}

const App = {
    init({ uncompletedList, completedList, modal, addBookButton, importBookButton, exportBookButton, searchBar }) {
        this._uncompletedListElement = uncompletedList
        this._completedListElement = completedList

        this._addBookButton = addBookButton

        this._importBookButton = importBookButton
        this._exportBookButton = exportBookButton

        Search.init({ searchBar })
        Modal.init({ modalElement: modal })

        this._createAppEvent()
    },
    _createAppEvent() {
        this._addBookButton.addEventListener('click', () => {
            Modal.open()
        })
        this._importBookButton.addEventListener('change', async(event) => {
            const jsonFile = event.target.files[0]
            const reader = new FileReader()

            reader.onload = async(event) => {
                const importedBooks = JSON.parse(event.target.result)
                books = importedBooks

                BookStorage.updateData()
                this._importBookButton.value = ''
                Template.createToast('Buku berhasil diimpor')
            }
            reader.readAsBinaryString(jsonFile)
        })
        this._exportBookButton.addEventListener('click', () => {
            const dataJSON = JSON.stringify(books)
            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataJSON)}`;

            const exportFileDefaultName = 'data.json'
            const linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
        })
        if (BookStorage.isExist()) BookStorage.loadData()
    },
    createBook() {
        const bookObject = BookStorage.composeBookObject(Modal.getFormData())

        const bookItem = Template.bookItemTemplate(bookObject)
        books.push(bookObject)

        if (bookObject.isCompleted) this._completedListElement.append(bookItem)
        else this._uncompletedListElement.append(bookItem)

        BookStorage.updateData()
        Template.createToast('Buku berhasil ditambahkan')
    },
    renderBookList(queryObject = []) {
        this._completedListElement.innerHTML = ''
        this._uncompletedListElement.innerHTML = ''

        let renderBooks = books

        if (queryObject.length && queryObject[0] !== '') {
            renderBooks = books.filter((book) => {
                if (queryObject[1] !== 'all') return book.title.toLowerCase().includes(queryObject[0].toLowerCase()) && book.isCompleted === !!queryObject[1]
                return book.title.toLowerCase().includes(queryObject[0].toLowerCase())

            })
        }
        renderBooks.forEach(book => {
            const bookItem = Template.bookItemTemplate(book)

            if (book.isCompleted) this._completedListElement.append(bookItem)
            else this._uncompletedListElement.append(bookItem)

            this._createBookItemEventButton(book.id, book.isCompleted)
        })

        if (this._completedListElement.innerHTML === '') this._completedListElement.innerHTML = '<p class="empty">Buku Kosong :(</p>'
        if (this._uncompletedListElement.innerHTML === '') this._uncompletedListElement.innerHTML = '<p class="empty">Buku Kosong :(</p>'
    },
    _createBookItemEventButton(id, isCompleted) {
        const doneButton = document.querySelector(`.done-button[data-book="${id}"]`)
        const editButton = document.querySelector(`.edit-button[data-book="${id}"]`)
        const deleteButton = document.querySelector(`.delete-button[data-book="${id}"]`)

        doneButton.addEventListener('click', (event) => {
            const thisBook = BookStorage.getBook(event.currentTarget.dataset.book)
            thisBook.isCompleted = !isCompleted

            BookStorage.updateData()
        })
        editButton.addEventListener('click', (event) => {
            this._modifyBookItem(event.currentTarget.dataset.book)
        })
        deleteButton.addEventListener('click', (event) => {
            const thisBookPosition = BookStorage.getBook(event.currentTarget.dataset.book)
            books.splice(thisBookPosition, 1)

            BookStorage.updateData()
            Template.createToast('Buku berhasil dihapus')
        })
    },
    _modifyBookItem(id) {
        const thisBookElement = document.getElementById(id)
        const bookAction = thisBookElement.querySelector('.book-action')
        const bookTips = thisBookElement.querySelector('.book-info .info')
        const bookInformationElement = {
            title: thisBookElement.querySelector('.book-info h3'),
            author: thisBookElement.querySelector('.book-info p'),
            year: thisBookElement.querySelector('.book-info small')
        }

        bookInformationElement.title.setAttribute('contentEditable', true)
        bookInformationElement.author.setAttribute('contentEditable', true)
        bookInformationElement.year.setAttribute('contentEditable', true)

        bookAction.classList.add('hide')
        bookTips.classList.add('show')

        document.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                bookInformationElement.title.setAttribute('contentEditable', false)
                bookInformationElement.author.setAttribute('contentEditable', false)
                bookInformationElement.year.setAttribute('contentEditable', false)

                bookAction.classList.remove('hide')
                bookTips.classList.remove('show')

                const thisBook = BookStorage.getBook(id)
                thisBook.title = bookInformationElement.title.outerText
                thisBook.author = bookInformationElement.author.outerText
                thisBook.year = bookInformationElement.year.outerText

                BookStorage.updateData()
            }
        })
    }
}