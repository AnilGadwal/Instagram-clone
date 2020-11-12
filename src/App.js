import React, { useEffect, useState } from 'react';
import './App.css';
import Post from "./Post"
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import instaLogo from "./insta_logo.png"


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      } else  {
        setUser(null);
      }
    })

    return () => {
        unsubscribe();
    }

  },[user, username])
  

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const singUp = (event) => {
      event.preventDefault();

      auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName : username
        })
      })
      .catch((error) => alert(error.message));
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.messasge))
    
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <center>

          <img src='app_headerImage'
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
          alt=""
          />
          <form className="app_signup">
          <Input 
          type="text"
          placeholder="Enter a Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />

          <Input 
          type="text"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />

          <Input 
          type="password"
          placeholder="Enter a Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />  

          <Button type="submit" onClick={singUp}>Sign Up</Button>
          </form>

        </center>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <center>

          <img src='app_headerImage'
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
          alt=""
          />
          <form className="app_signup">

          <Input 
          type="text"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />

          <Input 
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />  

          <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>

        </center>
      </div>
      </Modal>

      <div className="app_header">
        <img
        className="app_headerImage" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
          {user ? (
      <Button onClick={() => auth.signOut()}>Logout</Button>
      ) : (
        <div className="app_Container">
      <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
      <Button onClick={() => setOpen(true)}>Sign up</Button>
      </div>
      )}
      </div>


      {user?.displayName ? (
        <div className="app_posts">    
        {
         posts.map(({id, post}) => (
           
           <Post 
           key={id}
           user={user}
           postId={id}
           username={post.username} 
           caption={post.caption} 
           imageUrl={post.imageUrl}/> 
         ))
       }
        <ImageUpload username={user.displayName}/>
        </div>
      ) : (
  
        <img className="insta_logo"
        src = {instaLogo}
        alt="insta_logo"
        />
        
      )}
        
    </div>
  );
}

export default App; 
