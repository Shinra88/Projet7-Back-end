import React, { useState } from 'react';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../../utils/constants';
import { useUser } from '../../lib/customHooks';
import { storeInLocalStorage } from '../../lib/common';
import styles from './SignIn.module.css';

function SignIn({ setUser }) {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();

  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, message: '' });

  const handleClickOutside = (event) => {
    if (event.target.classList.contains(styles.SignIn)) {
      navigate('/'); // Redirige vers la page d'accueil
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(API_ROUTES.SIGN_IN, { email, password });
      if (!response?.data?.token) {
        setNotification({ error: true, message: 'Une erreur est survenue' });
      } else {
        storeInLocalStorage(response.data.token, response.data.userId);
        setUser(response.data);
        navigate('/');
      }
    } catch (err) {
      setNotification({ error: true, message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // const signUp = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.post(API_ROUTES.SIGN_UP, { email, password });
  //     if (!response?.data) return;
  //     setNotification({
  //       error: false,
  //       message: 'Votre compte a bien été créé, vous pouvez vous connecter',
  //     });
  //   } catch (err) {
  //     setNotification({ error: true, message: err.message });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const errorClass = notification.error ? styles.Error : null;

  return (
    <div
      className={styles.SignIn}
      onClick={handleClickOutside}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClickOutside(e);
        }
      }}
    >
      <div className={`${styles.Notification} ${errorClass}`}>
        {notification.message.length > 0 && <p>{notification.message}</p>}
      </div>
      <div className={styles.Form}>
        <h2>S&apos;identifier</h2>
        <label htmlFor={email}>
          <p>Adresse email</p>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          <p>Mot de passe</p>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className={styles.Option}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>Mot de passe oublié ?</NavLink>
          <p>ou</p>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>Créer un compte</NavLink>
        </div>
        <div className={styles.Submit}>
          <button type="button" onClick={() => navigate('/')} className={styles.Cancel}>
            <span>Annuler</span>
          </button>
          <button type="submit" onClick={signIn} className={styles.Validate}>
            {isLoading ? <div className="" /> : null}
            <span>Valider</span>
          </button>
        </div>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default SignIn;
