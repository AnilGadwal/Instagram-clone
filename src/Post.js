import React, { useEffect, useState } from 'react'
import "./Post.css"
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import { db } from "./firebase"


function Post({ postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            })

        }

        return () => {
            unsubscribe();
          };
        }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

      

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
          setComment("");
        };



    return (

        <div className="post">
            <div className="post_header">
            <Avatar
            className="post_avatar"
            src="/static/images/avatar/1.jpg"/>

            <h3>{username}</h3>
            
            </div>
           
            <img  className="post_image" src={imageUrl}/>

            <h4 className="post_text"><strong>{username}</strong> {caption}</h4>
            
            <div className="post_comments">
          {comments.map((comment) => (
            <p>
              <b>{comment.username}</b> {comment.text}
            </p>
          ))}
        </div>
            

        {user?.displayName ? (
        <form className="post_commentBox">
            <input
              className="post_input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              disabled={!comment}
              className="post_button"
              type="submit"
              onClick={postComment}
            >
                Post
                </button>

            </form>
         ) : (
            <form className="post_commentBox">
            <input 
                disabled
              className="post_input"
              type="text"
              placeholder="Login to add a comment..."
            />

            </form>
          )}


            
            </div>
        
    )
}

export default Post
