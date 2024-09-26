import View from './View.js';

class OverviewView extends View {
  _parentElement = document.querySelector('.overview');
  _errorMessage = '';
  _message = '';

  _generateMarkup() {
    return `
    <img src="${this._data.picture.large}" alt="Profile Photo" class="overview__img" />
    <p class="overview__name">${Object.values(this._data.name).join(' ')}</p>
    <p class="overview__email">${this._data.email}</p>
    <p class="overview__phone">${this._data.phone}</p>
    <p class="overview__username">${this._data.login.username}</p>
    `;
  }
}
export default new OverviewView();
