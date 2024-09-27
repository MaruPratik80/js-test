'use strict';

const config = {
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
    {
      name: 'tab-3',
    },
    {
      name: 'tab-4',
    },
  ],
};

const data = {};
const TIMEOUT_SEC = 10;
const overview = document.querySelector('.overview');
const tabContents = document.querySelector('.tab__contents');
const tabList = document.querySelector('.tab__list');
const sortBtns = document.getElementsByClassName('btn--sort');
const searchInputs = document.getElementsByClassName('search__input');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

const renderSpinner = function (parentEl) {
  const markup = `<div class="spinner"></div>`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const renderoverview = function () {
  const markup = `
      <img src="${data.profile.img}" alt="Profile Photo" class="overview__img" />
      <p class="overview__name">${data.profile.name}</p>
      <p class="overview__email"><span>Email: </span>${data.profile.email}</p>
      <p class="overview__phone"><span>Phone: </span>${data.profile.phone}</p>
      <p class="overview__username"><span>Username: </span>${data.profile.username}</p>
    `;

  overview.innerHTML = '';
  overview.insertAdjacentHTML('afterbegin', markup);
};

const formatInfo = function (info) {
  return {
    gender: info.gender,
    name: Object.values(info.name).join(' '),
    email: info.email,
    img: info.picture.large,
    phone: info.phone,
    cell: info.cell,
    username: info.login.username,
    password: info.login.password,
    address: Object.values(info.location)
      .map(d => (typeof d === 'object' ? Object.values(d) : d))
      .slice(0, 5)
      .join(', '),
    country: info.location.country,
    dob: new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'long', day: '2-digit' }).format(
      new Date(info.dob.date)
    ),
  };
};

const loadInfo = async function () {
  try {
    renderSpinner(overview);
    const { results } = await getJSON(config.api);
    const info = results[0];
    data.profile = formatInfo(info);
    console.log(info);
    renderoverview();
  } catch (err) {
    console.error(err);
  }
};

const showTabs = function () {
  const tabListHTML = config.tabs
    .map(
      (tab, i) => `
      <li class="tab__item ${i !== 0 ? '' : 'active'}" data-index="${i}">${tab.name}</li>
      `
    )
    .join('');
  tabList.insertAdjacentHTML('afterbegin', tabListHTML);
};

const switchTab = function (e) {
  const tab = e.target.closest('.tab__item');
  if (!tab) return;

  Array.from(tabList.children)
    .find(tab => tab.classList.contains('active'))
    .classList.remove('active');
  tab.classList.add('active');

  Array.from(tabContents.children).forEach(tabContent => {
    tabContent.style.transform = `translateX(${tab.dataset.index * -100}%)`;
  });
};

const generateProfileMarkup = function () {
  return `
  <div class="profile">
  <p><span>Name: </span>${data.profile.name}</p>
  <p><span>Email: </span>${data.profile.email}</p>
  <p><span>Phone: </span>${data.profile.phone}</p>
  <p><span>Cell: </span>${data.profile.cell}</p>
  <p><span>Username: </span>${data.profile.username}</p>
  <p><span>Password: </span>${data.profile.password}</p>
  <p><span>Date of birth: </span>${data.profile.dob}</p>
  <p><span>Gender: </span>${data.profile.gender}</p>
  <p><span>Address: </span>${data.profile.address}</p>
  </div>
  `;
};

const getResultsPage = function (tab, page = data[tab].page) {
  data[tab].page = page;

  const start = (page - 1) * data[tab].resultsPerPage; // 0
  const end = page * data[tab].resultsPerPage; // 9

  return data[tab].results.slice(start, end);
};

const generateListMarkup = function (tabName, results = data[tabName].results) {
  const datalist = !data[tabName].sorted
    ? results
    : results.slice().sort((a, b) => (a.name > b.name ? 1 : -1));

  return datalist
    .map(
      uni => `
    <li class="${tabName}__item">
    <p class="${tabName}__name">${uni.name}</p>
    <span>Webpage: </span>
    <a href="${uni.web_pages[0]}" class="${tabName}__webpage" target="_blank">${uni.domains[0]}</a>
    </li>
    `
    )
    .join('');
};

const generateMarkup = async function (tab, tabName) {
  try {
    data[tabName] = {};
    data[tabName].results = await getJSON(
      tab.api.replace('SELECTED_USER_COUNTRY', data.profile.country.replaceAll(' ', '+'))
    );
    data[tabName].sorted = false;
    data[tabName].page = 1;
    data[tabName].resultsPerPage = 10;
    const datalist = generateListMarkup(tabName);
    const markup = `
    <header class="tab__content__header">
    <div class="search">
    <input type="search" class="search__input" data-tab="${tabName}"/>
    </div>
    <button class="btn--sort" data-tab="${tabName}">Sort &UpArrowDownArrow;</button>
    </header>
    <ul class="${tabName}-list">
    ${datalist}
    </ul>
    <div class="pagination">
    <button class="btn btn--prev" disabled>&larr; Prev</button>
    <ul class="pagination__list">
    <li class="pagination__item"><a href="" class="pagination__link"></a></li>
    </ul>
    <button class="btn btn--next">Next &rarr;</button>
    </div>`;
    return markup;
  } catch (err) {
    console.error(err);
  }
};

const loadTabContents = async function () {
  tabContents.innerHTML = '<div class="spinner"></div> ';
  const html = config.tabs.map(async tab => {
    if (tab.name === 'Profile') return generateProfileMarkup();
    const tabName = tab.name.toLowerCase().replace(' ', '-');
    const markup = !tab.api ? tab.name : await generateMarkup(tab, tabName);

    return ` 
    <section class="tab__content tab__content--${tabName}">${markup}</section>
    `;
  });
  const tabContentHtml = (await Promise.all(html)).join('');

  tabContents.innerHTML = '';
  tabContents.insertAdjacentHTML('afterbegin', tabContentHtml);
};

const sortData = function () {
  const tab = this.dataset.tab.replace('btn--sort-', '');
  const parentEL = document.querySelector(`.${tab}-list`);
  data[tab].sorted = !data[tab].sorted;
  this.classList.toggle('sorted');
  const newMarkup = generateListMarkup(tab);
  parentEL.innerHTML = '';
  parentEL.insertAdjacentHTML('afterbegin', newMarkup);
};

const searchData = function () {
  const tab = this.dataset.tab.replace('btn--sort-', '');
  const parentEL = document.querySelector(`.${tab}-list`);
  const searchResults = data[tab].results.filter(result =>
    result.name.toLowerCase().includes(this.value.toLowerCase())
  );
  const newMarkup = generateListMarkup(tab, searchResults);
  parentEL.innerHTML = '';
  parentEL.insertAdjacentHTML('afterbegin', newMarkup);
};

const init = async function () {
  await loadInfo();
  showTabs();
  tabList.addEventListener('click', switchTab);
  await loadTabContents();
  Array.from(sortBtns).forEach(btn => btn.addEventListener('click', sortData));
  Array.from(searchInputs).forEach(input => input.addEventListener('input', searchData));
};
init();
