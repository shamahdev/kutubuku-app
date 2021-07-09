const Search = {
    init({ searchBar }) {
        this._searchBar = searchBar
        this._queryElement = this._searchBar.querySelector('#query')
        this._queryFilter = this._searchBar.querySelector('select')

        this._createEvent()
    },
    _createEvent() {
        this._queryElement.addEventListener('keyup', this._search.bind(this))
        this._queryFilter.addEventListener('change', this._search.bind(this))
    },
    _search() {
        let queryObject = [this._queryElement.value || '', this._queryFilter.value === 'false' ? false : this._queryFilter.value]
        App.renderBookList(queryObject)
    },
    reset() {
        this._queryElement.value = ''
        this._queryFilter.value = 'all'
        App.renderBookList([])
    }
}