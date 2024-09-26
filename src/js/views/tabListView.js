import View from './View.js';

class TabListView extends View {
  _parentElement = document.querySelector('.tab__list');
  _errorMessage = '';
  _message = '';

  addHandlerTabChange(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  _generateMarkup() {
    return this._data
      .map(
        (tab, i) => `
      <li class="tab__item ${i !== 0 ? '' : 'active'}" data-index="${i}">${tab.name}</li>
      `
      )
      .join('');
  }
}
export default new TabListView();
