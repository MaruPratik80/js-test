export const TIMEOUT_SEC = 10;

export default {
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
