// Imports
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useImperativeHandle,
} from 'react';
import { useVideojs } from 'react-videojs-hook';
import 'video.js/dist/video-js.css';

// Styles
import './App.css';

// Import & Configure Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBRWR91jg4xcO9kTK3DZ9-bl-OVP7qRtZE',
  authDomain: 'jaiwoodotlive.firebaseapp.com',
  projectId: 'jaiwoodotlive',
  storageBucket: 'jaiwoodotlive.appspot.com',
  messagingSenderId: '559732101251',
  appId: '1:559732101251:web:1521e357e10d915a148bb6',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// UserContext
const UserContext = React.createContext(null);
const UserProvider = UserContext.Provider;

//
// ─── REACT APP COMPONENT ────────────────────────────────────────────────────────
//

function App() {
  // CONNECT FIRESTORE DATABASE
  const firestore = firebase.firestore();

  // FIRESTORE USER STATE
  const [user] = useAuthState(auth);

  // APP ISLIVE STATE
  let [isLive, setIsLive] = useState(null);
  firestore
    .collection('appState')
    .doc('appState')
    .onSnapshot((doc) => {
      setIsLive(doc.data().isLive);
    });

  // SET APP FULL SCREEN HEIGHT
  let appMinHeight = '-webkit-fill-available';
  if (
    navigator.userAgent.includes('Chrome') ||
    navigator.userAgent.includes('Firefox')
  ) {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight / 100}px`
    );
    appMinHeight = 'calc(var(--vh, 1vh) * 100)';
  }

  // ONLINE MODE
  if (isLive) {
    return (
      <UserProvider value={user}>
        <div className='App' style={{ minHeight: appMinHeight }}>
          <header>Jaiwoo.Live</header>
          <VideoContainer />
          <InteractiveContainer />
        </div>
      </UserProvider>
    );
  }
  // OFFLINE MODE
  else if (isLive === false) {
    return (
      <UserProvider value={user}>
        <div className='App' style={{ minHeight: appMinHeight }}>
          <header>Jaiwoo.Live</header>
          <p>We're curently offline 😏</p>
          <br />
          <p>@djaiwoo for updates 👇🏼</p>
          <a
            style={{ marginTop: '2%' }}
            aria-label='a link to my instagram page'
            href='https://www.instagram.com/djaiwoo/'
            className='insta-button-container'
            target='_blank'
            rel='noreferrer'
          >
            <i id='instagram-btn' className='fab fa-instagram insta-button'></i>
          </a>
        </div>
      </UserProvider>
    );
  }

  // NULL STATE
  else if (isLive == null) {
    return <div className='App' style={{ minHeight: appMinHeight }}></div>;
  }
}

// Exports
export default App;

// ────────────────────────────────────────────────────────────────────────────────

function VideoContainer() {
  return (
    <div id='video-container'>
      <VideoJS />
    </div>
  );
}

function VideoJS() {
  const { vjsId, vjsRef, vjsClassName } = useVideojs({
    src:
      'https://74771800fd66.us-east-1.playback.live-video.net/api/video/v1/us-east-1.309644988325.channel.GGpWmcHRp4Mw.m3u8',
    type: 'application/x-mpegURL',
    controls: true,
    autoplay: true,
    playsinline: true,
    fluid: true,
    bigPlayButtonCentered: true,
    height: 'auto',
    width: 'auto',
  });
  return (
    <div data-vjs-player>
      <video ref={vjsRef} id={vjsId} className={vjsClassName}></video>
    </div>
  );
}

function InteractiveContainer() {
  const user = useContext(UserContext);

  return (
    <div id='interactive-container'>
      {user ? <Chat user={user} /> : <Authenticate />}
    </div>
  );
}

function Chat(props) {
  const user = props.user;
  const handleSignOut = () => {
    if (user.isAnonymous) {
      auth.currentUser.delete();
    }
  };
  return (
    <div id='chat-container' className='interactive-component'>
      <p>There is a user!</p>
      <br></br>
      <p onClick={handleSignOut}>SIGN OUT</p>
    </div>
  );
}

function Authenticate() {
  const [authPage, setAuthPage] = useState('welcome');

  // WELCOME PAGE
  if (authPage === 'welcome') {
    return (
      <div id='welcome' className='interactive-component'>
        <div id='welcome-text'>
          <p>Welcome!</p>
          <p>Hit ▶️ to start the party! 🔊</p>
          <p>Sign in below to participate in the live chat 🤪</p>
          <p>Or join as guest to follow along 🙃</p>
          <p>Thanks for hangin' out! 🙏🏼</p>
        </div>
        <div id='welcome-btns'>
          <div
            id='create-account-btn'
            className='welcome-button'
            onClick={() => {
              setAuthPage('create');
            }}
          >
            Create Account
          </div>
          <div
            id='sign-in-btn'
            className='welcome-button'
            onClick={() => {
              setAuthPage('sign-in');
            }}
          >
            Sign In
          </div>
          <div
            id='join-as-guest-btn'
            className='welcome-button'
            onClick={() => {
              auth.signInAnonymously();
            }}
          >
            Join as Guest
          </div>
        </div>
        <footer id='welcome-foot'>Made with ❤️</footer>
      </div>
    );
  }

  // CREATE ACCOUNT PAGE
  else if (authPage === 'create') {
    return (
      <div id='create' className='interactive-component'>
        <p>Create an account!</p>
        <br></br>
        <p
          onClick={() => {
            setAuthPage('welcome');
          }}
        >
          GO BACK
        </p>
      </div>
    );
  }

  // SIGN IN PAGE
  else if (authPage === 'sign-in') {
    return (
      <div id='sign-in' className='interactive-component'>
        <p>Sign in to your account!</p>
        <br></br>
        <p
          onClick={() => {
            setAuthPage('welcome');
          }}
        >
          GO BACK
        </p>
      </div>
    );
  }
}
