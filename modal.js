const Modal = {
    init({ modalElement }) {
        this._modalElement = modalElement
        this._closeModalButton = this._modalElement.querySelector('.modal-content .close')
        this._addBookForm = this._modalElement.querySelector('form')
        this._createEvent()
    },
    open() {
        this._modalElement.classList.add('open')
    },
    close() {
        this._modalElement.classList.remove('open')
    },
    getFormData() {
        const title = document.getElementById('book-title').value
        const author = document.getElementById('book-author').value
        const year = document.getElementById('book-year').value
        const isCompleted = document.getElementById('completed-checkbox').checked

        return { title, author, year, isCompleted }
    },
    _createEvent() {
        this._closeModalButton.addEventListener('click', (event) => {
            event.preventDefault()
            this.close()
        })

        this._addBookForm.addEventListener('submit', (event) => {
            event.preventDefault()
            App.createBook()
            this.close()
            this._addBookForm.reset()
        })
    }
}