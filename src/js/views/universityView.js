import View from './View.js';

class UniversityView extends View {
  _parentElement = document.querySelector('.university-list');
  _errorMessage = '';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(
        uni => `
        <li class="university">
        <p class="university__name">${uni.name}</p>
        <span>Webpage: </span>
        <a href="${uni.web_pages[0]}" class="university__webpage" target="_blank">${uni.domains[0]}</a>
        </li>
        `
      )
      .join('');
  }
}
export default new UniversityView();
