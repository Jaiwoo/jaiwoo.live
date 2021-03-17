// Imports
import React, { useRef, useState, useEffect } from 'react';
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

// React App Component
function App() {
  const firestore = firebase.firestore();
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
    appMinHeight = 'calc(var(--vh, 1vh) * 100)';
  }

  // ONLINE MODE
  if (isLive) {
    return (
      <div className='App' style={{ minHeight: appMinHeight }}>
        <header>Jaiwoo.Live</header>
        <Video />
        <Chat />
      </div>
    );
  }
  // OFFLINE MODE
  else if (isLive === false) {
    return (
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
    );
  }

  // NULL STATE
  else if (isLive == null) {
    return <div className='App' style={{ minHeight: appMinHeight }}></div>;
  }
}

function Video() {
  const { vjsId, vjsRef, vjsClassName } = useVideojs({
    src: 'https://d8g9rqwtz0vk3.cloudfront.net/stream/index.m3u8',
    type: 'application/x-mpegURL',
    controls: true,
    autoplay: true,
    playsinline: true,
    responsive: true,
    aspectRatio: '16:9',
    bigPlayButtonCentered: true,
  });
  return (
    <div data-vjs-player>
      <video ref={vjsRef} id={vjsId} className={vjsClassName}></video>
    </div>
  );
}

function Chat() {
  const [user] = useAuthState(auth);
  return (
    <section id='chat-container'>
      {user ? <p>Welcome User!</p> : <Welcome />}
    </section>
  );
}

function Welcome() {
  return (
    <div id='welcome' className='chat-component'>
      <div id='welcome-text'>
        <p style={{ fontSize: '20px' }}>Welcome!</p>
        <p>Hit ▶️ to start the party! 🔊</p>
        <p>Sign in below to participate in the live chat 🤪</p>
        <p>Or join as guest to follow along 🙃</p>
        <p>Thanks for hangin' out! 🙏🏼</p>
      </div>
      <div id='welcome-btns'>
        <WelcomeButton text='Create Account' />
        <WelcomeButton text='Sign In' />
        <WelcomeButton text='Join as Guest' />
      </div>
      <div id='welcome-foot'>Made with ❤️</div>
    </div>
  );
}

function WelcomeButton(props) {
  const text = props.text;
  return <div id='welcome-button'>{text}</div>;
}

// Exports
export default App;
