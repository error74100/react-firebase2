import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

function Post({ postObj, isOwener }) {
  const [edit, setEdit] = useState(false);
  const [newpost, setNewPost] = useState(postObj.content);

  const deletePost = async () => {
    const yes = window.confirm('정말 삭제할까요?');

    if (yes) {
      await deleteDoc(doc(db, 'posts', postObj.id));

      if (postObj.attachmentUrl.length !== 0) {
        const storage = getStorage();
        const storageRef = ref(storage, postObj.attachmentUrl);

        deleteObject(storageRef);
      }
    }
  };

  const toggleEditMode = () => {
    setEdit((prev) => !prev);
  };

  const onChange = (e) => {
    setNewPost(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const postRef = doc(db, 'posts', postObj.id);

    await updateDoc(postRef, {
      content: newpost,
    });

    setEdit(false);
  };

  return (
    <li>
      {edit ? (
        <>
          <form onSubmit={onSubmit}>
            <input value={newpost} onChange={onChange} required />
            <button>저장</button>
          </form>
          <button onClick={toggleEditMode}>취소</button>
        </>
      ) : (
        <>
          <h4>{postObj.content}</h4>
          <h5>- {postObj.name ? postObj.name : '(name)'} -</h5>

          {postObj.attachmentUrl && <img src={postObj.attachmentUrl} alt="" width="100px" />}

          {isOwener && (
            <p>
              <button onClick={deletePost}>삭제</button>&nbsp;
              <button onClick={toggleEditMode}>수정</button>
            </p>
          )}
        </>
      )}
    </li>
  );
}

export default Post;
