import React, { useRef, useState } from 'react';
import './App.css';

// import img1 from './image/profile.jpg';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({

  apiKey: "AIzaSyDrG2nwHSijpOCoMLtjp13_zSo1w-FzS3U",
  authDomain: "chat-app-e9c47.firebaseapp.com",
  projectId: "chat-app-e9c47",
  storageBucket: "chat-app-e9c47.appspot.com",
  messagingSenderId: "838964702014",
  appId: "1:838964702014:web:e6b318bcd6dcb3cd171a6f",
  measurementId: "G-96FH0GFJ25"
 
  
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <img src={"./image/profile.jpg"} />
        {/* <h1>⚛️🔥💬</h1> */}
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" >💫✨🌟</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'img1'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;


// apiKey: "AIzaSyDrG2nwHSijpOCoMLtjp13_zSo1w-FzS3U",
//   authDomain: "chat-app-e9c47.firebaseapp.com",
//   projectId: "chat-app-e9c47",
//   storageBucket: "chat-app-e9c47.appspot.com",
//   messagingSenderId: "838964702014",
//   appId: "1:838964702014:web:e6b318bcd6dcb3cd171a6f",
//   measurementId: "G-96FH0GFJ25"
 