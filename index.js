document.addEventListener("DOMContentLoaded", () => {
    const uncompletedListElement = document.getElementById('uncompletedList')
    const completedListElement = document.getElementById('completedList')
    const addBookModal = document.getElementById('addBookModal')
    const addBookButton = document.querySelector('.add-button')
    const importBookButton = document.getElementById('import-book')
    const exportBookButton = document.querySelector('.export-button')
    const searchBar = document.querySelector('.search-bar')

    App.init({
        uncompletedList: uncompletedListElement,
        completedList: completedListElement,
        modal: addBookModal,
        addBookButton,
        importBookButton,
        exportBookButton,
        searchBar,
    })
})

document.addEventListener("ondatasaved", () => {
    Search.reset()
    App.renderBookList()
})

document.addEventListener("ondataloaded", () => {
    App.renderBookList()
})