// add admin to cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email:adminEmail }).then(result => {
    console.log(result);
    adminForm.reset();
  });
});

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      user.organization = user.email.replace(/.*@/, "");
      setupUI(user);
      return true;
    }).then(() => {
      db.collection('organizations').doc(user.organization).collection('announcements').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        console.log(snapshot.docs);
        setupAnnouncements(snapshot.docs);
      }, err => {
        console.log(err.message)
      });
    });
  } else {
    setupUI();
    setupAnnouncements([]);
  }
})

// create a new announcement
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('organizations').doc(auth.currentUser.organization).collection('announcements').add({
    title: createForm['title'].value,
    content: createForm['content'].value,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  }).then(() => {
    // close modal and reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err =>  {
    console.log(err.message);
  })
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const emailDomain = email.replace(/.*@/, "");

  // sign up user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    db.collection('organizations').doc(emailDomain).set({
      domain: emailDomain
    });
    return db.collection('organizations').doc(emailDomain).collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value 
    });
  }).then(() => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  })
})

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
})

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  })

});