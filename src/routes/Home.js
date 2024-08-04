import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Post from '../components/Post';

import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
  const [post, setPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [attachment, setAttachment] = useState();
  let attachmentUrl = '';

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  // const getPosts = async () => {
  //   const querySnapshot = await getDocs(collection(db, 'posts'));
  //   querySnapshot.forEach((doc) => {
  //     const postObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     setPosts((prev) => [postObj, ...prev]);
  //   });
  // };

  useEffect(() => {
    // getPosts();
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'));

    onSnapshot(q, (querySnapshot) => {
      const postArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPosts(postArr);
    });
  }, []);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setPost(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);

    if (post.length < 1) {
      alert('내용을 입력해주세요.');
      return false;
    }

    const makePost = async (url) => {
      try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, 'posts'), {
          content: post,
          date: serverTimestamp(),
          uid: userObj.uid,
          attachmentUrl: url,
          name: userObj.displayName,
        });
        setAttachment('');
        setPost('');
        myForm.reset();
      } catch (e) {
        console.error('error= ', e);
      }
    };

    if (attachment) {
      uploadString(storageRef, attachment, 'data_url').then(async (snapshot) => {
        // console.log('Uploaded a data_url string!');
        attachmentUrl = await getDownloadURL(storageRef);

        makePost(attachmentUrl);
      });
    } else {
      makePost(attachmentUrl);
    }
  };

  let myForm = document.querySelector('form');

  const onFileChange = (e) => {
    // const theFile = e.target.files[0];
    const {
      target: { files },
    } = e;
    const theFile = files[0];

    if (theFile.size > 2 * 1024 * 1024) {
      alert('2MB 이상 이미지는 업로드 불가!');
      myForm.reset();
    } else {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        const {
          target: { result },
        } = e;

        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
    }
  };

  const onClearFile = () => {
    setAttachment(null);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>
          <input type="text" value={post} placeholder="새 포스트를 입력하세요" onChange={onChange} />
          <input type="file" accept="image/*" onChange={onFileChange} />
        </p>
        {attachment && (
          <>
            <img src={attachment} alt="" width="100px" />
            <button type="button" onClick={onClearFile}>
              업로드 취소
            </button>
          </>
        )}
        <p>
          <button type="submit">글 등록</button>
        </p>
      </form>
      <hr />
      <h3>Post List</h3>
      <ul className="postlist">
        {posts.map((item) => (
          <Post key={item.id} postObj={item} isOwener={item.uid === userObj.uid} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
