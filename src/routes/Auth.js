import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth();

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (newAccount) {
      // 회원가입
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorCode, errorMessage);
          setError(errorMessage);
        });
    } else {
      // 로그인
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorCode, errorMessage);
          setError(errorMessage);
        });
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onSocialClick = (e) => {
    const {
      target: { name },
    } = e;

    if (name === 'google') {
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
    } else if (name === 'github') {
      alert('준비중 입니다.');
      return false;

      // const provider = new GithubAuthProvider();

      // signInWithPopup(auth, provider)
      //   .then((result) => {
      //     const credential = GithubAuthProvider.credentialFromResult(result);
      //     const token = credential.accessToken;
      //     const user = result.user;
      //     console.log(token, user);
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     const email = error.customData.email;
      //     const credential = GithubAuthProvider.credentialFromError(error);
      //     console.log(errorCode, errorMessage, email, credential);
      //   });
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" value={email} placeholder="Email.." onChange={onChange} required />
        &nbsp;
        <input name="password" type="password" value={password} placeholder="Password.." onChange={onChange} required />
        <p>{error}</p>
        <button>{newAccount ? 'Create Account' : 'Log In'}</button>
      </form>
      <div className="btn_type" onClick={toggleAccount}>
        {newAccount ? '[Log In 버튼 전환]' : '[Create Account 버튼 전환]'}
      </div>
      <hr />
      <button name="google" onClick={onSocialClick}>
        Google Login
      </button>
      &nbsp;
      <button name="github" onClick={onSocialClick}>
        Github Login
      </button>
    </div>
  );
};

export default Auth;
