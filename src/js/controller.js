import * as model from './model.js';
import overviewView from './views/overviewView.js';
import tabListView from './views/tabListView.js';
import universityView from './views/universityView.js';

const details = {
  name: '',
  email: '',
  phone: '',
  username: '',
  api: 'https://randomuser.me/api/',
  tabs: [
    {
      name: 'Profile',
      // show all details of the user
    },
    {
      name: 'University',
      api: 'http://universities.hipolabs.com/search?country=SELECTED_USER_COUNTRY',
      // show universities data and implement search, sort(name), pagination.
    },
  ],
};

const tabContents = document.getElementsByClassName('tab__content');
const universitiesEL = document.querySelector('.university-list');
const search = document.querySelector('.search-input');

let dataUni;

const controlInfo = async function () {
  try {
    await model.loadInfo();
    overviewView.render(model.state.info);
    console.log(model.state.info);
  } catch (err) {
    console.error(err);
  }
};

const controlTabList = function () {
  tabListView.render(model.state.tabs);
};

const controlTabChange = function (e) {
  const tab = e.target.closest('.tab__item');
  if (!tab) return;

  Array.from(document.querySelectorAll('.tab__item'))
    .find(tab => tab.classList.contains('active'))
    .classList.remove('active');
  tab.classList.add('active');

  Array.from(tabContents).forEach(tabContent => {
    tabContent.style.transform = `translateX(${tab.dataset.index * -100}%)`;
  });
};

const controlUniversity = async function () {
  try {
    await model.loadUniversities();
    universityView.render(model.state.uni.results);
    console.log(model.state.uni.results);
  } catch (err) {
    console.error(err);
  }
};

// const renderUni = function (data, sort = false) {
//   universitiesEL.innerHTML = '';
//   // document
//   //   .getElementById('university-name-list')
//   //   .insertAdjacentHTML('afterbegin', data.map(uni => `<option value="${uni.name}"/>`).join(''));

//   const universities = !sort ? data : data.slice().sort((a, b) => (a.name > b.name ? 1 : -1));

//   const markup = universities
//     .map(
//       uni => `
//     <li class="university">
//     <p class="university__name">${uni.name}</p>
//     <span>Webpage: </span>
//     <a href="${uni.web_pages[0]}" class="university__webpage" target="_blank">${uni.domains[0]}</a>
//       </li>`
//     )
//     .join('');
//   universitiesEL.insertAdjacentHTML('afterbegin', markup);
// };

let sorterd = false;
document.querySelector('.btn--sort').addEventListener('click', function (e) {
  e.preventDefault();
  renderUni(dataUni, !sorterd);
  sorterd = !sorterd;
});

search.addEventListener('input', function () {
  const data = dataUni.filter(uni => uni.name.toLowerCase().includes(search.value.toLowerCase()));
  renderUni(data, sorterd);
});

const init = async function () {
  await controlInfo();
  controlTabList();
  tabListView.addHandlerTabChange(controlTabChange);
  controlUniversity();
};
init();
