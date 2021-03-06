const announcementList = document.querySelector('.announcements');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');


const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }
    // account info
    db.collection('organizations').doc(user.organization).collection('users').doc(user.uid).get().then(doc => {
      const html = `
      <div>Logged in as ${user.email}</div>
      <div>${doc.data().bio}</div>
      <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
      `;
      accountDetails.innerHTML = html;
    })
    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    adminItems.forEach(item => item.style.display = 'none');
    // hide account info
    accountDetails.innerHTML = '';
    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}

// setup announcements
const setupAnnouncements = (data) => {

  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const announcement = doc.data();
      const li = `
        <li>
        <div class="collapsible-header grey lighten-4">${announcement.title}</div>
        <div class="collapsible-body white">${announcement.content}</div>
        </li>
      `;
      html += li;
    });

    announcementList.innerHTML = html;

  } else {
    announcementList.innerHTML = '<h5 class="center-align">Login in to view announcements</h5>';
  }

}


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});