import React from 'react';
import Cryptos from './Cryptos';
import Header from "./Header";
import Home from "./Home";
import {db} from '../firebase-config';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import LoginForm from './modals/LoginForm';
import {
  deleteUser,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithPopup,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
  TwitterAuthProvider
} from "firebase/auth";
import RegistrationForm from "./modals/RegistrationForm";
import UserPages from "./UserPages";
import axios from "axios";
import {ThemeProvider} from "react-bootstrap";
import {Footer} from "./Footer";
import {ConfirmModal} from "./modals/ConfirmModal";
import {ChangePasswordModal} from "./modals/ChangePasswordModal";
import {ResetPasswordModal} from "./modals/ResetPasswordModal";
import {ChangeEmailModal} from "./modals/ChangeEmailModal";
import {DeleteAccountModal} from "./modals/DeleteAccountModal";
import SavePageModal from "./modals/SavePageModal";
import {getSystemTheme} from "./Theme";
import {Privacy} from "./Privacy";
import {About} from "./About";

class App extends React.Component {

  //<editor-fold desc="State">
  state = {
    logging: false,
    theme: 'light',
    userPageTitle: '',
    cryptos: [],
    cryptosLoading: false,
    cryptosOwner: '',
    loggedInUser: '',       //this can only be a user that we already have in the database (user is registered)...
    loginProvider: '',   //...and this
    watchingAuthState: false,
    userDataInitFetched: false,
    pageDataInitFetched: false,
    loginFormOpened: false,
    regFormOpened: false,
    resetPasswordFormOpened: false,
    registeringNewUser: false,
    allowedToBeListeningToPageData: false,
    userPages: [],
    userPagesLoading: false,
    slugBeingSavedAlreadyExists: false,
    newPageTitle: '',
    newPageSlug: '',
    savingPage: false,
    newUserEmail: '',
    newUserEmailError: '',
    newUserPass: '',
    newUserRegistered: false,
    newUserVerified: false,
    newUserVerifCode: '',
    newUserVerifError: '',
    newUserPasswordSet: false,
    regUserOfferedToLogin: false,
    socialUserRegistered: false,
    loginEmail: '',
    loginPass: '',
    loginEmailError: '',
    loginPassError: '',
    loggingInAsync: false,
    confirmModalShown: false,
    confirmModalText: '',
    confirmModalAction: null,
    cryptoBeingAddedAsync: null,
    authenticatingSocialUserAsync: null,
    registeringUser: false,
    savePageIntent: false,
    newCryptoNameError: '',
    newCryptoAddressError: '',
    changePasswordModalShown: false,
    changePasswordError: '',
    passwordChanging: false,
    changeEmailModalShown: false,
    changeEmailError: '',
    changeEmailCurrEmailError: '',
    changeEmailNewEmailError: '',
    changeEmailPasswordError: '',
    changingEmail: false,
    passwordChanged: false,
    emailChanged: false,
    passwordReset: false,
    resetPassPasswordError: '',
    resetPassEmailError: '',
    resetPassVerifCode: '',
    resetPassVerifCodeError: '',
    resetPassVerifEmailSentTo: '',
    resetPassCodeVerifiedFor: '',
    requestingPasswordResetCode: false,
    verifyingCodeForPassResetAsync: false,
    passwordResetError: '',
    resettingPassword: false,
    deleteAccountModalShown: false,
    deletingAccount: false,
    accountDeleted: false,
    savingCryptos: false,
    savePageModalOpened: false,
    localCryptosLoaded: false,
    userPageBeingDeleted: null
  }

  //</editor-fold>
  checkerIfWereAllowedToBeListeningToPageData = null;

  componentDidMount() {
    const app = this;
    this.loadTheme()

    if (!this.state.watchingAuthState) {
      onAuthStateChanged(getAuth(), this.authStateChangedHandler)
      this.setState({watchingAuthState: true});
    }

    this.checkerIfWereAllowedToBeListeningToPageData = setInterval(() => {
      if (app.state.allowedToBeListeningToPageData) {
        app.listenToPageData()
      } else {
        app.stopListeningToPageData()
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.checkerIfWereAllowedToBeListeningToPageData);
    this.stopListeningToPageData()
  }

  //<editor-fold desc="Theme">
  setTheme = (variant) => {
    window.localStorage.setItem("theme", variant);
    this.setState({theme: variant});
  }
  loadTheme = () => {
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      this.setState({theme: localTheme});
    } else {
      this.setState({theme: getSystemTheme()})
    }
  }

  //</editor-fold>

  //<editor-fold desc="Pages">
  getUserPages = async () => {
    //go thru all pages and see if any have this uid as the owner
    const q = query(
      collection(db, 'pages'),
      where("owner", '==', this.state.loggedInUser),
      orderBy("creationEpoch", "asc")
    );
    await this.setState({userPagesLoading: true})
    const pages = await getDocs(q);
    const userPages = pages.docs.map(page => {
      return {
        ...page.data(),
        id: page.id
      }
    });
    const localCryptos = window.localStorage.getItem('cryptos');
    if (localCryptos) {
      userPages.push({
        id: 'draft',
        draft: true,
        cryptos: JSON.parse(localCryptos)
      })
    }
    if (this.state.logging) console.log(userPages);
    this.setState({userPages, userPagesLoading: false})
  }
  newUserPageSlugIsValid = async (slug) => {
    const pages = await getDocs(collection(db, `pages`));
    const reservedPageSlugs = [
      'draft',
      'account',
      'accounts',
      'user',
      'users',
      'about',
      'story',
      'ourstory',
      'ourstories',
      'our-story',
      'our_story',
      'our-stories',
      'our_stories',
      'support',
      'help',
      'contact',
      'contacts',
      'contact-us',
      'contact_us',
      'contactus',
      'connect',
      'connectwithus',
      'connect-with-us',
      'connect_with_us',
      'cards',
      'business',
      'store',
      'shop',
      'donate',
      'donation',
      'donations',
      'settings',
      'options',
      'preferences',
      'profile',
      'pages',
      'mypages',
      'my-pages',
      'my_pages',
      'crypto',
      'cryptos',
      'cryptocurrency',
      'cryptocurrencies',
      'crypto-currency',
      'crypto_currency',
      'crypto-currencies',
      'crypto_currencies',
      'receive',
      'receive-cash',
      'receive_cash',
      "receivecash",
      'cash',
      'money',
      'coins',
      'coin',
      'rc',
      'privacy',
      'privacy-policy',
      'privacy_policy',
      'privacypolicy',
      'terms',
      'terms-and-conditions',
      'terms_and_conditions',
      'termsandconditions',
      'termsconditions',
      'terms-conditions',
      'terms_conditions',
      'credit',
      'credits',
      'careers',
      'career',
      'job',
      'jobs',
      'work',
      'hire',
      'hiring',
      'team',
      'teammembers',
      'team_members',
      'team-members',
      'teammember',
      'team_member',
      'team-member',
      'vadim',
      'haiduk',
      'vhaiduk',
      'vadimhaiduk',
      'vadimh',
      'vadim-h',
      'vadim-haiduk',
      'vadim_haiduk',
      'vadim_h',
      'vadim-h',
      'h-vadim',
      'h_vadim',
      'hvadim',
      'haidukvadim',
      'haiduk-vadim',
      'haiduk_vadim',
      'pos',
      'storefront',
      'store-front',
      'store_front',
      'possystem',
      'pos-system',
      'pos_system',
      'system',
      'status',
      'intro',
      'introduction',
      'referral',
      'referrals',
      'refer',
      'password',
      'passwords',
      'reset-password',
      'resetpassword',
      'reset_password',
      'changeemail',
      'change-email',
      'change_email',
      'delete',
      'deleteaccount',
      'delete-account',
      'delete_account',
      'signup',
      'sign-up',
      'sign_up',
      'join',
      'joinus',
      'join-us',
      'join_us',
      'login',
      'log-in',
      'log_in',
      'logout',
      'log_out',
      'log-in',
      'signin',
      'sign-in',
      'sign_in',
      'register',
      'start',
      'begin',
      'enter',
      'develop',
      'developer',
      'repo',
      'repository',
      'repos',
      'repositories',
      'share',
      'address',
      'addresses',
      'add',
      'remove',
      'delete',
      'edit',
      'rename',
      'newcrypto',
      'new-crypto',
      'new_crypto',
      'mycrypto',
      'my-crypto',
      'my_crypto',
      'mycryptos',
      'my-cryptos',
      'my_cryptos',
      'feedback',
      'issues',
      'submit-issue',
      'submitissue',
      'submit_issue',
      'feature',
      'features',
      'guide',
      'guides',
      'manual',
      'manuals',
      'instruction',
      'instructions',
      'doc',
      'docs',
      'documentation',
      'documentations',
      'report',
      'report-bug',
      'report-bugs',
      'reportbug',
      'reportbugs',
      'report_bug',
      'report_bugs'
    ]
    let pageSlugAlreadyExists = false;
    let pageSlugIsReserved = false;
    pages.forEach(page => {
      if (slug === page.id) {
        pageSlugAlreadyExists = true;
      }
    });
    if (reservedPageSlugs.includes(slug)) {
      pageSlugIsReserved = true;
    }
    return !(pageSlugAlreadyExists || pageSlugIsReserved);
  }
  createUserPage = async (cryptos) => {
    const slugIsValid = await this.newUserPageSlugIsValid(this.state.newPageSlug);

    this.setState({slugBeingSavedAlreadyExists: !slugIsValid})

    if (
      this.state.newPageTitle === '' ||
      this.state.newPageSlug === '' ||
      !slugIsValid
    ) {
      this.setState({savingPage: false})
      return false
    }

    this.setState({slugBeingSavedAlreadyExists: false})

    const data = {
      title: this.state.newPageTitle,
      owner: this.state.loggedInUser,
      creationEpoch: Date.now(),
      updateEpoch: Date.now(),
    }
    if (cryptos) data.cryptos = cryptos;
    if (this.state.logging) console.log(data);
    await setDoc(doc(db, `pages`, this.state.newPageSlug), data);
    this.setState({
      newPageTitle: '',
      newPageSlug: ''
    })
    return true;
  }
  deleteUserPage = async (id, uid) => {
    this.setState({userPageBeingDeleted: id})
    if (this.state.logging) console.log(`deleting page ${id} by ${uid}`)
    await deleteDoc(doc(db, `pages/${id}`));
    await this.getUserPages();
    this.setState({userPageBeingDeleted: null})
  }
  deleteDraftPage = () => {
    const newSetOfPages = [];
    this.state.userPages.forEach((page) => {
      if (!page.draft) {
        newSetOfPages.push(page);
      }
    })
    this.setState({userPages: newSetOfPages});
    this.saveCryptosToLocalStorage([])
  }
  saveNewEmptyPage = async () => {
    this.setState({savingPage: true});
    await this.createUserPage();
    this.setState({
      savingPage: false
    });
    await this.getUserPages()
  }
  saveOpenedDraftPage = async () => {
    const cryptos = JSON.parse(window.localStorage.getItem('cryptos'));
    if (cryptos) {
      this.setState({savingPage: true});
      const pageCreated = await this.createUserPage(cryptos);
      if (!pageCreated) {
        console.error('Error saving local cryptos');
        if (this.state.loggedInUser !== '') {
          this.props.navigate('/draft');
        }
        return false;
      }

      await this.setState({
        newPageTitle: '',
        newPageSlug: '',
        savingPage: false,
        savePageModalOpened: false,

      })
      await this.props.navigate('/' + this.state.newPageSlug, {replace: true})

      window.localStorage.removeItem("cryptos");
      return true;
    } else {
      if (this.state.logging) console.log('No local cryptos to save')
      return false;
    }
  }
  //</editor-fold>

  //<editor-fold desc="Users">
  getUsers = async () => {
    return await getDocs(collection(db, 'users'));
  }
  authenticateSocialUser = (options) => {
    const auth = getAuth()
    const provider =
      options.provider === 'Facebook' ? new FacebookAuthProvider() :
        options.provider === 'Twitter' ? new TwitterAuthProvider() :
          options.provider === 'Google' ? new GoogleAuthProvider() :
            options.provider === 'GitHub' ? new GithubAuthProvider() : null;
    if (!provider) {
      alert('Authentication provider not acquired');
      return;
    }
    this.setState({
      registeringNewUser: true,
      authenticatingSocialUserAsync: options.provider
    }, () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const uid = result.user.uid;

          //check if user is registered
          this.getUsers().then(async (users) => {
            let userIsNew = true;
            users.docs.forEach(doc => {
              if (doc.id === uid) {
                userIsNew = false;
              }
            });
            if (userIsNew) {
              if (this.state.logging) console.log("Registering a new user");
              await setDoc(doc(db, `users/${uid}`), {
                loginProvider: options.provider
              })
              this.setState({
                socialUserRegistered: true,
              })
            } else {
              this.setState({
                regFormOpened: false,
                savePageModalOpened: this.state.savePageIntent,
                savePageIntent: false
              })
            }
            this.setState({
              loggedInUser: uid,
              loginProvider: options.provider,
              loginEmail: '',
              loginPass: '',
              authenticatingSocialUserAsync: null,
              registeringNewUser: false,
              loginFormOpened: false,
              newUserEmail: '',
              newUserPass: '',
              newUserVerifCode: '',
              newUserRegistered: false,
              newUserVerified: false,
              newUserPasswordSet: false,
              newUserEmailError: '',
              newUserVerifError: '',
              regUserOfferedToLogin: false
            });
          });

          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          // const credential = FacebookAuthProvider.credentialFromResult(result);
          // const accessToken = credential.accessToken;
        })
        .catch((error) => {
          this.setState({
            authenticatingSocialUserAsync: null,
            registeringNewUser: false,
          })
          const errorMessage = error.message;
          console.error(errorMessage)
        });
    });
  }
  loginHandler = (uid, inBackground = false) => {
    //check if user is registered
    this.getUsers().then(users => {
      let userFound = false,
        userData;
      users.forEach(user => {
        if (user.id === uid) {
          userFound = true;
          userData = user.data();
          this.closeLoginForm();
        }
      });
      if (userFound) {
        this.setState({
          loggedInUser: uid,
          loginProvider: userData.loginProvider,
          loginEmail: '',
          loginPass: '',
          newUserEmail: '',
          newUserPass: ''
        });
      } else {
        if (!this.state.registeringNewUser && !inBackground) {
          this.logOut().then(() => alert('User not found'));
        }
      }
      this.setState({authenticatingSocialUserAsync: null})
    });
  }
  authStateChangedHandler = user => {
    if (user) {
      const uid = user.uid;
      if (!this.state.registeringNewUser) {
        this.loginHandler(uid, true);
      }
    }
  }
  logOut = () => {
    const app = this;
    return new Promise(function (resolve) {
      const signOutAsyncFunc = async function () {
        await signOut(getAuth())
      };
      signOutAsyncFunc().then(() => {
        const state = {
          loggedInUser: '',
          loginProvider: '',
          userPages: []
        };
        if (window.location.pathname.match(/\/user\/pages/)) {
          app.props.navigate('/', {replace: true});
          state.cryptos = [];
        }
        app.setState(state, resolve);
      });
    });
  }
  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }
  sendNewUserEmailVerifCode = async () => {
    const app = this;
    this.setState({registeringUser: true})
    if (this.state.logging) console.log(app.state.newUserEmail);

    const send = () => {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/send_new_user_email_verif_code.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.newUserEmail
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };
    if (!this.validateEmail(this.state.newUserEmail.trim())) {
      this.setState({newUserEmailError: "Invalid email address"});
      this.setState({registeringUser: false})
      return;
    }

    const request = await send();

    if (request.registered) {
      this.setState({newUserRegistered: true})
    }
    if (request.password_set) {
      this.setState({newUserPasswordSet: true, regUserOfferedToLogin: true})
    }

    if (this.state.logging) console.log(request);

    this.setState({registeringUser: false})
  }
  saveNewUserPass = async () => {
    const app = this;
    const saveNewUserPass = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/set_new_user_password.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.newUserEmail,
            pass: app.state.newUserPass
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };

    this.setState({registeringUser: true})

    const savingNewUserPass = await saveNewUserPass();
    if (this.state.logging) console.log(savingNewUserPass);

    if (savingNewUserPass.password_set) {
      this.setState({newUserPasswordSet: true})
      const uid = savingNewUserPass.uid;
      const signedInToFirebase = await this.signIntoFirebase(savingNewUserPass.firebase_token);
      if (signedInToFirebase) {
        await setDoc(doc(db, `users/${uid}`), {
          loginProvider: 'email and password'
        });
        this.setState({
          loggedInUser: uid,
          loginProvider: 'email and password'
        })
      } else {
        console.error('Error signing into Firebase');
      }
    } else {
      this.setState({newUserVerifError: savingNewUserPass.verif_error})
    }
    this.setState({registeringUser: false})
  }
  cancelUserReg = async () => {
    if (this.state.newUserRegistered && !this.state.newUserPasswordSet) {
      await this.deleteNewAccount();
    }
    this.setState({
      newUserEmail: '',
      newUserPass: '',
      newUserVerifCode: '',
      newUserRegistered: false,
      newUserVerified: false,
      newUserPasswordSet: false,
      newUserEmailError: '',
      newUserVerifError: '',
      regUserOfferedToLogin: false,
      socialUserRegistered: false
    })
  }
  signIntoFirebase = (token) => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      signInWithCustomToken(auth, token)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          if (this.state.logging) console.log('logged into firebase:');
          if (this.state.logging) console.log(user);
          resolve(true);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode + ': ' + errorMessage);
          reject(false);
          // ...
        });
    })
  }
  verifyNewUser = async () => {
    const app = this;
    const verifyUser = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/verifyUser.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.newUserEmail,
            verifCode: app.state.newUserVerifCode
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };

    this.setState({registeringUser: true})

    const userVerification = await verifyUser();
    if (this.state.logging) console.log(userVerification);

    if (userVerification.verified) {
      this.setState({newUserVerified: true})
    } else {
      this.setState({newUserVerifError: userVerification.verif_error})
    }
    this.setState({registeringUser: false})
  }
  setNewUserPass = async () => {
    const app = this;
    const setPass = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/set_new_user_password.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.newUserEmail,
            pass: app.state.newUserPass
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };

    this.setState({registeringUser: true})

    const settingPass = await setPass();
    if (this.state.logging) console.log(settingPass);

    if (settingPass.verified) {
      this.setState({newUserVerified: settingPass.verified})
      const uid = settingPass.uid;

      const signedIn = await this.signIntoFirebase(settingPass.token);
      if (signedIn) {
        await setDoc(doc(db, `users/${uid}`), {
          loginProvider: 'email and password'
        });
        this.setState({
          loggedInUser: uid,
          loginProvider: 'email and password'
        }, this.closeRegForm)
      } else {
        console.error('Error signing in after user verification');
      }
    } else {
      this.setState({newUserVerifError: settingPass.verif_error})
    }
    this.setState({registeringUser: false})
  }

  loginWithEmailPass = async () => {
    const app = this;
    const login = function () {
      return new Promise(function (resolve, reject) {
        const data = {
          email: app.state.loginEmail,
          pass: app.state.loginPass,
        }
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/login.php',
          method: 'post',
          withCredentials: false,
          data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error("ERROR!");
          console.error(error);
          reject(error);
        });
      })
    };

    if (!this.validateEmail(this.state.loginEmail)) {
      this.setState({
        loginEmailError: 'Invalid email address'
      })
      return false
    }

    this.setState({loggingInAsync: true});
    const loginResult = await login();
    if (this.state.logging) console.log(loginResult);

    this.setState({
      loginEmailError: '',
      loginPassError: ''
    }, () => {
      if (loginResult.registered) {
        if (loginResult.password_set) {
          if (loginResult.pass_correct) {
            this.signIntoFirebase(loginResult.token).then(() => {
              this.setState({
                loggedInUser: loginResult.uid,
                loginProvider: 'email and password',
                loggingInAsync: false,
                loginEmail: '',
                loginPass: '',
                savePageModalOpened: this.state.savePageIntent,
                savePageIntent: false,
                newUserEmail: '',
                newUserPass: '',
                newUserVerifCode: '',
                newUserRegistered: false,
                newUserVerified: false,
                newUserPasswordSet: false,
                newUserEmailError: '',
                newUserVerifError: '',
              });
              this.closeLoginForm();
            }).catch(() => {
              console.error('Sign-in error');
              this.setState({loggingInAsync: false})
            });
          } else {
            this.setState({
              loginPassError: 'Wrong password',
              loggingInAsync: false
            })
          }
        } else {
          this.setState({
            newUserRegistered: true,
            newUserVerified: false,
            newUserEmail: app.state.loginEmail,
            newUserPass: app.state.loginPass,
            loginEmail: '',
            loginPass: '',
            loggingInAsync: false
          }, () => {
            this.closeLoginForm();
            this.openRegForm();
          })
        }
      } else {
        this.setState({
          loginEmailError: 'This email address is not registered',
          loggingInAsync: false
        })
      }
    })
  }
  userIsRegistered = async (uid) => {
    return await this.getUsers().then((users) => {
      let userIsRegistered = false;
      users.forEach((user) => {
        if (user.id === uid) {
          userIsRegistered = true;
        }
      })
      return userIsRegistered;
    });

  }
  closeLoginForm = () => this.setState({
    loginFormOpened: false,
    savePageIntent: false
  });
  openLoginForm = () => {
    this.setState({loginFormOpened: true});
  }
  closeRegForm = () => {
    this.setState({
      regFormOpened: false,
      registeringNewUser: false,
      savePageModalOpened: this.state.savePageIntent && this.state.loggedInUser !== '',
      savePageIntent: false
    });
  }
  openRegForm = () => this.setState({regFormOpened: true});
  cancelNewUserVerif = () => {
    this.setState({
      newUserEmail: '',
      newUserPass: '',
      newUserVerified: false,
      newUserRegistered: false,
      newUserVerifError: '',
      newUserVerifCode: '',
    })
  }
  saveNewPassword = async (currentPassword, newPassword) => {
    const app = this;
    const saveNewPassword = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/change_password.php',
          method: 'post',
          withCredentials: false,
          data: {
            uid: app.state.loggedInUser,
            currPass: currentPassword,
            newPass: newPassword
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };

    this.setState({passwordChanging: true})
    const saveNewPasswordResult = await saveNewPassword();
    if (this.state.logging) console.log(saveNewPasswordResult);
    if (saveNewPasswordResult.changed) {
      this.setState({
        passwordChanged: true,
        changePasswordError: ''
      })
    } else {
      this.setState({
        changePasswordError: saveNewPasswordResult.mysql_error ? saveNewPasswordResult.mysql_error : 'Something went wrong :('
      })
    }
    this.setState({passwordChanging: false})
  }
  saveNewEmail = async (currEmail, newEmail, password) => {
    if (!this.validateEmail(currEmail)) {
      this.setState({changeEmailCurrEmailError: 'Invalid email address'});
      return
    }
    if (!this.validateEmail(newEmail)) {
      this.setState({changeEmailNewEmailError: 'Invalid email address'});
      return
    }
    const app = this;
    const saveNewEmail = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/change_email.php',
          method: 'post',
          withCredentials: false,
          data: {
            uid: app.state.loggedInUser,
            currEmail,
            newEmail,
            password
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };

    await this.setState({changingEmail: true});
    const saveNewEmailResult = await saveNewEmail();

    if (saveNewEmailResult.changed) {
      const oldUid = this.state.loggedInUser;

      //update user's document id in the users collection by deleting old and creating new
      await setDoc(doc(db, `users/${saveNewEmailResult.new_uid}`), {
        loginProvider: 'email and password'
      })
      await deleteDoc(doc(db, `users/${oldUid}`));

      //go thru all documents in pages collection and whichever has owner field === oldUid, change that document's owner
      const changePageOwners = () => {
        const promises = [];
        this.state.userPages.filter(page => {
          return page.id !== 'draft'
        }).forEach(page => {
          promises.push(updateDoc(doc(db, `pages/${page.id}`), {owner: saveNewEmailResult.new_uid}))
        })
        return Promise.all(promises)
      }
      await changePageOwners();

      //re-login with old uid & so we could delete it in firebase (have to be recently logged in order to delete a uid)
      const auth = getAuth();
      await signOut(auth);
      await signInWithCustomToken(auth, saveNewEmailResult.tokenForOldUid)
      const user = auth.currentUser;
      await deleteUser(user);
      await signOut(auth);
      signInWithCustomToken(auth, saveNewEmailResult.token).then(() => {
        this.setState({
          loggedInUser: saveNewEmailResult.new_uid,
          loginProvider: 'email and password',
          emailChanged: true,
          changeEmailError: '',
          changingEmail: false
        });
      }).catch(() => {
        console.error('Sign-in error');
      });
    } else {
      this.setState({
        changeEmailError: saveNewEmailResult.error ? saveNewEmailResult.error : '',
        changeEmailCurrEmailError: saveNewEmailResult.curr_email_error ? saveNewEmailResult.curr_email_error : '',
        changeEmailNewEmailError: saveNewEmailResult.new_email_error ? saveNewEmailResult.new_email_error : '',
        changeEmailPasswordError: saveNewEmailResult.password_error ? saveNewEmailResult.password_error : '',
        changingEmail: false
      })
    }
  }
  forgetPasswordWasChanged = () => {
    this.setState({passwordChanged: false})
  }
  clearChangePasswordError = () => {
    this.setState({changePasswordError: ''})
  }
  forgetEmailWasChanged = () => {
    this.setState({emailChanged: false})
  }
  forgetPasswordWasReset = () => {
    this.setState({
      passwordReset: false,
      loginEmail: '',
      resetPassVerifEmailSentTo: '',
      resetPassCodeVerifiedFor: ''
    })
  }
  clearResetPassEmailError = () => {
    this.setState({resetPassEmailError: ''})
  }
  clearResetPassPasswordError = () => {
    this.setState({resetPassPasswordError: ''})
  }
  clearResetPassVerifCodeError = () => {
    this.setState({resetPassVerifCodeError: ''})
  }
  verifyEmailAndSendVerifCodeForPassReset = async () => {
    const app = this;
    const requestPasswordResetCode = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/request_password_reset_code.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.loginEmail
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };

    this.setState({requestingPasswordResetCode: true})
    const passwordResetCodeRequest = await requestPasswordResetCode();
    this.setState({requestingPasswordResetCode: false})

    if (this.state.logging) console.log(passwordResetCodeRequest);
    if (passwordResetCodeRequest.user_found) {
      if (passwordResetCodeRequest.verif_code_email_sent) {
        this.setState({resetPassVerifEmailSentTo: this.state.loginEmail})
      } else {
        this.setState({resetPassEmailError: "Email not sent"})
      }
    } else {
      this.setState({resetPassEmailError: "Email not registered"})
    }
  }
  verifyCodeForPasswordReset = async () => {
    const app = this;
    const requestPasswordReset = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/verify_password_reset_code.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.loginEmail,
            verifCode: app.state.resetPassVerifCode
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };

    this.setState({verifyingCodeForPassResetAsync: true})
    const passwordResetRequest = await requestPasswordReset();
    this.setState({verifyingCodeForPassResetAsync: false})

    if (this.state.logging) console.log(passwordResetRequest);
    if (passwordResetRequest.verif_code_correct) {
      this.setState({
        resetPassCodeVerifiedFor: this.state.loginEmail,
        resetPassVerifCodeError: ''
      })
      if (this.resetPassCodeVerifiedTimeoutID) clearTimeout(this.resetPassCodeVerifiedTimeoutID);
      this.resetPassCodeVerifiedTimeoutID = setTimeout(() => {
        app.resetPassCodeVerifiedTimeoutID = 0;
        app.setState({resetPassVerifCode: '', resetPassCodeVerifiedFor: ''})
      }, 300000)
      // }, 3000)
    } else {
      this.setState({resetPassVerifCodeError: "Code incorrect"})
    }
  }
  resetPasswordAndLogin = async (newPass) => {
    const app = this;
    const resetPassword = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/reset_password.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.resetPassCodeVerifiedFor,
            verifCode: app.state.resetPassVerifCode,
            newPass
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };


    this.setState({resettingPassword: true})
    const passwordResetRequest = await resetPassword();
    this.setState({resettingPassword: false})

    if (this.state.logging) console.log(passwordResetRequest);
    if (passwordResetRequest.password_reset) {
      this.setState({passwordReset: true, loginPass: newPass}, this.loginWithEmailPass)
    } else {
      this.setState({passwordResetError: "Password not changed"})
    }
  }
  deleteAccount = async (password) => {
    const app = this;
    const get_custom_token = function () {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/create_custom_token.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.loggedInUser,
            pass: password
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    };
    const delete_email_account = () => {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/delete_account.php',
          method: 'post',
          withCredentials: false,
          data: {
            emailHash: app.state.loggedInUser,
            pass: password
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    }
    this.setState({deletingAccount: true})

    //delete user's pages and uid from custom users table
    if (this.state.userPages.length === 0) await this.getUserPages();
    const batch = writeBatch(db);
    this.state.userPages.filter(page => page.id !== 'draft').forEach(page => {
      batch.delete(doc(db, 'pages', page.id))
    })
    batch.delete(doc(db, 'users', this.state.loggedInUser))

    //re-login so we could delete the uid in firebase (have to be recently logged in order to delete a uid)
    const auth = getAuth();
    const user = auth.currentUser;
    let userDeleted = false;
    if (this.state.loginProvider === 'email and password') {
      await signOut(auth);
      const token = await get_custom_token();
      if (this.state.logging) console.log(token);
      if (token.token) {
        await signInWithCustomToken(auth, token.token).then(async () => {
          await batch.commit();
          await deleteUser(user).then(async () => {
            const accountDeletion = await delete_email_account();
            if (this.state.logging) console.log(accountDeletion);
            userDeleted = true;
          }).catch(err => {
            console.error('Was unable to delete user')
            console.error(err)
          });
        }).catch(err => {
          console.error('Was unable to sign into firebase')
          console.error(err);
        });
      }
    } else {
      const provider =
        this.state.loginProvider === 'Facebook' ? new FacebookAuthProvider() :
          this.state.loginProvider === 'Twitter' ? new TwitterAuthProvider() :
            this.state.loginProvider === 'Google' ? new GoogleAuthProvider() :
              this.state.loginProvider === 'GitHub' ? new GithubAuthProvider() : '';
      await reauthenticateWithPopup(user, provider).then(async () => {
        await batch.commit();
        await deleteUser(user).then(async () => {
          userDeleted = true;
        }).catch(err => {
          console.error('Was unable to delete user')
          console.error(err)
        });
      }).catch(err => {
        console.error('Was unable to reauthenticate')
        console.error(err)
      })
    }

    if (userDeleted) {
      if (window.location.pathname.match(/\/user\/pages/)) {
        this.props.navigate('/', {replace: true});
      } else {
        this.state.userPages.forEach(page => {
          const regex = new RegExp("/" + page.id);
          if (regex.test(window.location.pathname)) {
            this.props.navigate('/', {replace: true});
          }
        })
      }
      this.logOut();
      this.setState({accountDeleted: true, socialUserRegistered: false})
    }
    this.setState({deletingAccount: false})
  }
  deleteNewAccount = async () => {
    const app = this;
    const delete_email_account = () => {
      return new Promise(function (resolve, reject) {
        axios({
          url: process.env.REACT_APP_AUTH_HOST + '/delete_new_account.php',
          method: 'post',
          withCredentials: false,
          data: {
            email: app.state.newUserEmail
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          resolve(response.data);
        }).catch(function (error) {
          console.error(error);
          reject(error);
        });
      })
    }
    this.setState({registeringUser: true})
    const accountDeletion = await delete_email_account();
    if (this.state.logging) console.log(accountDeletion);
    this.setState({registeringUser: false})
  }
  deverifyNewAccount = async () => {
    this.setState({newUserVerified: false})
  }
  //</editor-fold>

  //<editor-fold desc="Cryptos">
  listenToPageDataSnapshot = null;

  listenToPageData = () => {
    if (this.listenToPageDataSnapshot === null) {
      this.setState({cryptosLoading: true})
      if (this.state.logging) console.log('starting to listen to page ' + this.props.params.pageSlug)
      const app = this;
      const page = doc(db, `pages/${this.props.params.pageSlug}`);
      if (this.state.logging) console.log('page doc reference:');
      if (this.state.logging) console.log(page);
      this.listenToPageDataSnapshot = onSnapshot(doc(db, `pages/${this.props.params.pageSlug}`), snapshot => {
        if (this.state.logging) console.log('snapshot received:')
        if (this.state.logging) console.log(snapshot)
        const pageData = snapshot.data();
        let appState = {};
        if (pageData) {
          appState.userPageTitle = pageData.title
          appState.cryptosOwner = pageData.owner
          appState.cryptosLoading = false
          if (pageData.cryptos) {
            const cryptoDocs = pageData.cryptos;
            const cryptos = cryptoDocs.map((crypto) => ({...crypto}))
            appState.cryptos = this.getCryptosWithRefs(cryptos)
          }
        } else {
          appState.cryptos = [];
          appState.userPageTitle = 'Page not found :(';
        }
        appState.cryptosLoading = false
        app.setState(appState);
      });

      this.setState({localCryptosLoaded: false});
    }
  }
  stopListeningToPageData = () => {
    if (this.listenToPageDataSnapshot !== null) {
      this.listenToPageDataSnapshot();
      this.listenToPageDataSnapshot = null
      if (this.state.logging) console.log('stopped listening');
      this.setState({cryptosLoading: false})
    }
  }
  loadLocalCryptos = () => {
    const cryptos = JSON.parse(window.localStorage.getItem('cryptos'));
    if (cryptos) {
      this.setState({cryptos: this.getCryptosWithRefs(cryptos)});
    } else {
      this.setState({cryptos: []});
    }
    this.setState({localCryptosLoaded: true});
  }
  getCryptosWithRefs = (cryptos) => {
    if (cryptos.length) {
      return cryptos.map((crypto) => {
        crypto.ref = React.createRef();
        return crypto;
      });
    } else {
      return [];
    }
  }
  getCryptosWithoutRefs = (cryptos) => {
    return cryptos.map(({id, name, symbol, logo, icon, address}) => {
      return {id, name, symbol, logo, icon, address};
    });
  }
  saveCryptosToState = (cryptos) => {
    this.setState({cryptos: this.getCryptosWithRefs(cryptos)});
  }
  saveCryptosToLocalStorage = (cryptos) => {
    if (cryptos.length) {
      window.localStorage.setItem("cryptos", JSON.stringify(this.getCryptosWithoutRefs(cryptos)));
    } else {
      window.localStorage.removeItem('cryptos')
    }
  }
  addCrypto = async crypto => {
    const cryptos = [...this.state.cryptos];
    let isUnique = true;
    cryptos.forEach((c) => {
      if (c.symbol === crypto.symbol) {
        isUnique = false;
      }
    })
    if (!isUnique) {
      this.setState({newCryptoNameError: 'The page already has this crypto'});
      return false;
    }
    cryptos.push(crypto);
    this.saveCryptosToState(cryptos);
    if (
      this.state.loggedInUser !== '' &&
      this.state.loggedInUser === this.state.cryptosOwner &&
      this.props.params.pageSlug !== 'draft'
    ) {
      this.setState({cryptoBeingAddedAsync: crypto.id}, async () => {
        await updateDoc(doc(db, `pages/${this.props.params.pageSlug}`), {
          cryptos: this.getCryptosWithoutRefs(cryptos),
          updateEpoch: Date.now()
        });
        this.setState({cryptoBeingAddedAsync: null});
        if (this.state.logging) console.log(Date.now())
      })
    } else {
      window.localStorage.setItem("cryptos", JSON.stringify(this.getCryptosWithoutRefs(cryptos)));
    }
  };
  updateCrypto = async crypto => {
    const cryptos = [...this.state.cryptos],
      newCryptos = [];
    cryptos.forEach((elem) => {
      if (elem.id === crypto.id) {
        elem.address = crypto.address;
      }
      newCryptos.push(elem)
    })
    this.saveCryptosToState(newCryptos);

    if (this.state.loggedInUser !== '' && this.props.params.pageSlug && this.props.params.pageSlug !== 'draft' && this.state.loggedInUser === this.state.cryptosOwner) {
      await updateDoc(doc(db, `pages/${this.props.params.pageSlug}`), {
        cryptos: this.getCryptosWithoutRefs(newCryptos),
        updateEpoch: Date.now()
      });
    } else {
      this.saveCryptosToLocalStorage(cryptos);
    }
  }
  deleteCrypto = async crypto => {
    const cryptos = [...this.state.cryptos],
      newCryptos = [];
    cryptos.forEach((elem) => {
      if (elem.id !== crypto.id) {
        newCryptos.push(elem)
      }
    })
    this.saveCryptosToState(newCryptos);

    if (this.props.params.pageSlug !== 'draft' && this.state.loggedInUser !== '' && this.state.loggedInUser === this.state.cryptosOwner) {
      this.setState({cryptosLoading: true})
      await updateDoc(doc(db, `pages/${this.props.params.pageSlug}`), {
        cryptos: this.getCryptosWithoutRefs(newCryptos),
        updateEpoch: Date.now()
      });
    } else {
      this.saveCryptosToLocalStorage(newCryptos);
    }
    this.props.navigate(`/${this.props.params.pageSlug}`, {replace: true});
  }
  saveCryptos = async (cryptos) => {
    await this.setState({
      cryptos,
      savingCryptos: true,
      sortingAllowed: false
    });
    if (this.state.loggedInUser !== '' && this.state.loggedInUser === this.state.cryptosOwner && this.props.params.pageSlug !== 'draft') {
      await this.setState({cryptosLoading: true})
      await updateDoc(doc(db, `pages/${this.props.params.pageSlug}`), {
        cryptos: this.getCryptosWithoutRefs(cryptos),
        updateEpoch: Date.now()
      });
    } else {
      this.saveCryptosToLocalStorage(cryptos);
    }
    this.setState({
      savingCryptos: false,
      sortingAllowed: true
    })
  }
  //</editor-fold>

  confirmModal = (text, action) => {
    this.setState({
      confirmModalShown: true,
      confirmModalText: text,
      confirmModalAction: action
    })
  }

  render() {
    let body;
    if (this.props.body === 'cryptos') {
      body = (
        <Cryptos
          pageSlug={this.props.params.pageSlug}
          pageTitle={this.state.userPageTitle}
          requestedCrypto={this.props.params.cryptoSymbol}
          loggedInUser={this.state.loggedInUser}
          loggedInUserIsOwner={this.state.cryptosOwner !== '' && this.state.loggedInUser !== '' && this.state.cryptosOwner === this.state.loggedInUser}
          theme={this.state.theme}
          setPageTitle={this.setPageTitle}
          cryptos={this.state.cryptos}
          addCrypto={this.addCrypto}
          updateCrypto={this.updateCrypto}
          deleteCrypto={this.deleteCrypto}
          allowPageDataListening={() => this.setState({
            allowedToBeListeningToPageData: true,
          })}
          disallowPageDataListening={() => this.setState({
            allowedToBeListeningToPageData: false,
          })}
          loadLocalCryptos={this.loadLocalCryptos}
          localCryptosLoaded={this.state.localCryptosLoaded}
          navigate={this.props.navigate}
          cryptoBeingAddedAsync={this.state.cryptoBeingAddedAsync}
          newCryptoNameError={this.state.newCryptoNameError}
          clearNewCryptoNameError={() => this.setState({newCryptoNameError: ''})}
          saveCryptos={this.saveCryptos}
          savingCryptos={this.state.savingCryptos}
          sortingAllowed={!this.props.params.cryptoSymbol && !this.state.savingCryptos}
          // disallowSorting={() => this.setState({sortingAllowed: false})}
          // allowSorting={() => this.setState({sortingAllowed: true})}
          clearNewPageFlds={() => this.setState({newPageTitle: '', newPageSlug: ''})}
          logging={this.state.logging}
        />
      )
    } else if (this.props.body === 'userPages' && this.state.loggedInUser !== '') {
      body = (
        <UserPages
          theme={this.state.theme}
          loggedInUser={this.state.loggedInUser}
          getUserPages={this.getUserPages}
          pages={this.state.userPages}
          setPages={(pages) => this.setState({userPages: pages})}
          navigate={this.props.navigate}
          slugBeingSavedAlreadyExists={this.state.slugBeingSavedAlreadyExists}
          newPageTitle={this.state.newPageTitle}
          newPageSlug={this.state.newPageSlug}
          setNewPageTitle={(e) => this.setState({newPageTitle: e.currentTarget.value})}
          setNewPageSlug={(e) => this.setState({
            newPageSlug: e.currentTarget.value.replace(/[^a-zA-Z0-9\-_]/, ''),
            slugBeingSavedAlreadyExists: false
          })}
          clearNewPageFlds={() => {
            this.setState({newPageTitle: '', newPageSlug: ''})
          }}
          savePage={this.saveNewEmptyPage}
          deleteUserPage={this.deleteUserPage}
          pageBeingDeleted={this.state.userPageBeingDeleted}
          deleteDraftPage={this.deleteDraftPage}
          newUserPageSlugIsValid={this.newUserPageSlugIsValid}
          confirmModal={this.confirmModal}
          saveCryptosToLocalStorage={this.saveCryptosToLocalStorage}
          emptyCryptos={() => this.setState({cryptos: []})}
          savingPage={this.state.savingPage}
        />
      )
    } else if (this.props.body === 'home') {
      body = <Home
        theme={this.state.theme}
        navigate={this.props.navigate}
      />
    } else if (this.props.body === 'privacy') {
      body = <Privacy theme={this.state.theme}/>
    } else if (this.props.body === 'about') {
      body = <About theme={this.state.theme}/>;
    }

    return (
      <ThemeProvider
        breakpoints={['xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs', 'xxxs', 'xxxxs']}
        minBreakpoint="xxxxs"
      >
        <div className={`${this.state.theme}-theme d-flex flex-column h-100`}>
          <main className={`flex-shrink-0`}>
            <Header
              theme={this.state.theme}
              body={this.props.body}
              setTheme={this.setTheme}
              pageSlug={this.props.params.pageSlug}
              userPageTitle={this.state.userPageTitle}
              loggedInUser={this.state.loggedInUser}
              loggedInUserIsOwner={this.state.cryptosOwner !== '' && this.state.loggedInUser !== '' && this.state.cryptosOwner === this.state.loggedInUser}
              loggedIn={this.state.loggedInUser !== ''}
              loginProvider={this.state.loginProvider}
              openLoginForm={this.openLoginForm}
              openRegForm={this.openRegForm}
              logOut={this.logOut}
              navigate={this.props.navigate}
              params={this.props.params}
              openChangePasswordModal={() => this.setState({changePasswordModalShown: true})}
              openChangeEmailModal={() => this.setState({changeEmailModalShown: true})}
              openDeleteAccountModal={() => this.setState({deleteAccountModalShown: true})}
              setSavePageIntent={(val) => this.setState({savePageIntent: val})}
              openSavePageModal={() => this.setState({savePageModalOpened: true})}
              loadLocalCryptos={this.loadLocalCryptos}
              cryptosLoading={this.state.cryptosLoading}
              userPagesLoading={this.state.userPagesLoading}
            />
            <LoginForm theme={this.state.theme}
                       close={this.closeLoginForm}
                       opened={this.state.loginFormOpened}
                       authenticateSocialUser={this.authenticateSocialUser}
                       authenticatingSocialUserAsync={this.state.authenticatingSocialUserAsync}
                       loginWithEmailPass={this.loginWithEmailPass}
                       loggingInAsync={this.state.loggingInAsync}
                       verifyNewUser={this.verifyNewUser}
                       loginEmail={this.state.loginEmail}
                       loginPass={this.state.loginPass}
                       setLoginEmail={(email) => this.setState({loginEmail: email})}
                       setLoginPass={(pass) => this.setState({loginPass: pass})}
                       setNewUserVerifCode={(code) => this.setState({newUserVerifCode: code})}
                       newUserEmail={this.state.newUserEmail}
                       newUserPass={this.state.newUserPass}
                       newUserRegistered={this.state.newUserRegistered}
                       newUserVerified={this.state.newUserVerified}
                       loginEmailError={this.state.loginEmailError}
                       setLoginEmailError={(error) => this.setState({loginEmailError: error})}
                       loginPassError={this.state.loginPassError}
                       setLoginPassError={(error) => this.setState({loginPassError: error})}
                       showResetPasswordModal={() => {
                         this.setState({
                           loginFormOpened: false,
                           resetPasswordFormOpened: true
                         })
                       }}
                       loggedIn={this.state.loggedInUser !== ''}
            />
            <RegistrationForm
              theme={this.state.theme}
              loggedIn={this.state.loggedInUser !== ''}
              loginProvider={this.state.loginProvider}
              sendVerifCode={this.sendNewUserEmailVerifCode}
              registering={this.state.registeringUser}
              logOut={this.logOut}
              close={this.closeRegForm}
              openLoginForm={this.openLoginForm}
              opened={this.state.regFormOpened}
              authenticateSocialUser={this.authenticateSocialUser}
              authenticatingSocialUserAsync={this.state.authenticatingSocialUserAsync}
              email={this.state.newUserEmail}
              emailError={this.state.newUserEmailError}
              pass={this.state.newUserPass}
              setEmail={(e) => this.setState({newUserEmail: e.currentTarget.value.trim()})}
              setPass={(e) => this.setState({newUserPass: e.currentTarget.value})}
              setVerifCode={(e) => this.setState({newUserVerifCode: e.currentTarget.value.trim()})}
              savePass={this.saveNewUserPass}
              registered={this.state.newUserRegistered}
              verified={this.state.newUserVerified}
              verifCode={this.state.newUserVerifCode}
              verifError={this.state.newUserVerifError}
              passwordSet={this.state.newUserPasswordSet}
              setVerifError={(error) => this.setState({newUserVerifError: error})}
              verify={this.verifyNewUser}
              setEmailError={(error) => this.setState({newUserEmailError: error})}
              cancelVerif={this.cancelNewUserVerif}
              cancelReg={this.cancelUserReg}
              verifyEmail={this.verifyNewUser}
              setRegistered={(bool) => this.setState({newUserRegistered: bool})}
              setVerified={(bool) => this.setState({newUserVerified: bool})}
              setLoginEmail={(email) => this.setState({loginEmail: email})}
              offeredToLogin={this.state.regUserOfferedToLogin}
              deverify={this.deverifyNewAccount}
              socialUserRegistered={this.state.socialUserRegistered}
              forgetSocialUserRegistered={() => this.setState({socialUserRegistered: false})}
            />
            <ConfirmModal shown={this.state.confirmModalShown} text={this.state.confirmModalText}
                          action={this.state.confirmModalAction} theme={this.state.theme} close={() => {
              this.setState({confirmModalShown: false});
            }}/>
            <ChangePasswordModal
              theme={this.state.theme}
              shown={this.state.changePasswordModalShown}
              loggedIn={this.state.loggedInUser !== ''}
              loginProvider={this.state.loginProvider}
              close={() => {
                this.setState({changePasswordModalShown: false})
              }}
              save={this.saveNewPassword}
              error={this.state.changePasswordError}
              clearError={this.clearChangePasswordError}
              changing={this.state.passwordChanging}
              changed={this.state.passwordChanged}
              forgetPasswordWasChanged={this.forgetPasswordWasChanged}
            />
            <ChangeEmailModal
              theme={this.state.theme}
              shown={this.state.changeEmailModalShown}
              loggedIn={this.state.loggedInUser !== ''}
              loginProvider={this.state.loginProvider}
              close={() => {
                this.setState({changeEmailModalShown: false})
              }}
              saveNewEmail={this.saveNewEmail}
              error={this.state.changeEmailError}
              clearError={() => this.setState({changeEmailError: ''})}
              currEmailError={this.state.changeEmailCurrEmailError}
              clearCurrEmailError={() => this.setState({changeEmailCurrEmailError: ''})}
              newEmailError={this.state.changeEmailNewEmailError}
              clearNewEmailError={() => this.setState({changeEmailNewEmailError: ''})}
              passwordError={this.state.changeEmailPasswordError}
              clearPasswordError={() => this.setState({changeEmailPasswordError: ''})}
              emailChanged={this.state.emailChanged}
              forgetEmailWasChanged={this.forgetEmailWasChanged}
              changingEmail={this.state.changingEmail}
            />
            <ResetPasswordModal theme={this.state.theme}
                                shown={this.state.resetPasswordFormOpened}
                                email={this.state.loginEmail}
                                setEmail={(email) => this.setState({loginEmail: email})}
                                emailError={this.state.resetPassEmailError}
                                passwordReset={this.state.passwordReset}
                                forgetPasswordWasReset={this.forgetPasswordWasReset}
                                clearPasswordError={this.clearResetPassPasswordError}
                                clearEmailError={this.clearResetPassEmailError}
                                close={() => {
                                  this.setState({resetPasswordFormOpened: false})
                                  if (this.state.resetPassCodeVerifiedFor !== '') {
                                    this.setState({
                                      resetPassCodeVerifiedFor: '',
                                      resetPassVerifCode: ''
                                    })
                                  }
                                }}
                                verifCodeError={this.state.resetPassVerifCodeError}
                                clearVerifCodeError={this.clearResetPassVerifCodeError}
                                verifEmailSentTo={this.state.resetPassVerifEmailSentTo}
                                codeVerifiedFor={this.state.resetPassCodeVerifiedFor}
                                verifyEmailAndSendVerifCode={this.verifyEmailAndSendVerifCodeForPassReset}
                                verifyCode={this.verifyCodeForPasswordReset}
                                resetPasswordAndLogin={this.resetPasswordAndLogin}
                                verifCode={this.state.resetPassVerifCode}
                                setVerifCode={(code) => this.setState({resetPassVerifCode: code})}
                                requestingCode={this.state.requestingPasswordResetCode}
                                verifyingCode={this.state.verifyingCodeForPassResetAsync}
                                requestingPassword={this.state.resettingPassword}
            />
            <DeleteAccountModal
              confirmModal={this.confirmModal}
              deleteAccount={this.deleteAccount}
              theme={this.state.theme}
              shown={this.state.deleteAccountModalShown}
              close={() => this.setState({
                deleteAccountModalShown: false,
                accountDeleted: false
              })}
              deletingAccount={this.state.deletingAccount}
              loggedInUser={this.state.loggedInUser}
              deleted={this.state.accountDeleted}
              loginProvider={this.state.loginProvider}
            />
            <SavePageModal
              theme={this.state.theme}
              opened={this.state.savePageModalOpened}
              close={() => this.setState({savePageModalOpened: false, savePageIntent: false})}
              saving={this.state.savingPage}
              save={this.saveOpenedDraftPage}
              setTitle={(e) => this.setState({newPageTitle: e.currentTarget.value})}
              setSlug={(e) => this.setState({
                newPageSlug: e.currentTarget.value.replace(/[^a-zA-Z0-9\-_]/, ''),
                slugBeingSavedAlreadyExists: false
              })}
              title={this.state.newPageTitle}
              slug={this.state.newPageSlug}
              slugAlreadyExists={this.state.slugBeingSavedAlreadyExists}
            />
            {body}
          </main>
          <Footer theme={this.state.theme} navigate={this.props.navigate}/>
        </div>
      </ThemeProvider>
    )
  }
}

export default App;
