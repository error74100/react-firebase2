import React, { useEffect, useState, useTransition } from 'react';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../profile_icon.png';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, onSnapshot, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Post from '../components/Post';

function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const nav = useNavigate();
  const [profileImg, setProfileImg] = useState(profileIcon);
  const [posts, setPosts] = useState([]);

  const onLogoutClick = () => {
    signOut(auth)
      .then(() => {
        alert('로그아웃 되었습니다.');
        nav('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserPost = () => {
    // getPosts();
    const q = query(collection(db, 'posts'), where('uid', '==', user.uid), orderBy('date', 'desc'), limit(10));

    onSnapshot(q, (querySnapshot) => {
      const postArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPosts(postArr);
    });
  };

  useEffect(() => {
    if (user.photoURL !== null) {
      user.photoURL.includes('firebase') && setProfileImg(user.photoURL);
    }
    getUserPost();
  }, []);

  const updateLogo = async (e) => {
    const {
      target: { files },
    } = e;
    const file = files[0];
    const storage = getStorage();
    const profileLogoeRef = ref(storage, `profiles/${user.uid}`);
    const result = await uploadBytes(profileLogoeRef, file);
    const profileUrl = await getDownloadURL(result.ref);

    setProfileImg(profileUrl);

    await updateProfile(user, {
      photoURL: profileUrl,
    });
  };

  return (
    <>
      <div className="profile">
        <div>
          <img src={profileImg} alt="profile" />
          <h4>[사용자 정보]</h4>
          <p>- name : {user.displayName}</p>
          <p>- email : {user.email}</p>
        </div>
        <input type="file" className="hidden" accept="image/*" id="profile" onChange={updateLogo} />
        <label htmlFor="profile">Update profile</label>&nbsp;
        <button onClick={onLogoutClick}>Logout</button>
      </div>

      <hr />

      <h3>My Post List</h3>
      <ul className="postlist">
        {posts.map((item) => (
          <Post key={item.id} postObj={item} isOwener={item.uid === user.uid} />
        ))}
      </ul>
    </>
  );
}

export default Profile;
