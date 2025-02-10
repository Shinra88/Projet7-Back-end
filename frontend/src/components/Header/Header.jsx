import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import Logo from '../../images/Logo.png';
import FeatherIcon from '../../images/feather.png';

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const disconnect = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <header className={styles.Header}>
      <div className={styles.container}>
        <img className={styles.logo} src={Logo} alt="logo WonderBook" />
        <div className={styles.navBar}>
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/Ajouter" className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                Catégories
              </NavLink>
            </li>
            <li>
              <NavLink to="/Ajouter" className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                Années
              </NavLink>
            </li>
            <li>
              <NavLink to="/Ajouter" className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                Forum
              </NavLink>
            </li>
            <li>
              <NavLink to="/Ajouter" className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                Ma collection
              </NavLink>
            </li>
            <li>
              {/* <Link to="/Ajouter" className="button">+ Ajouter un livre</Link> */}
              <button type="button" onClick={!user ? () => navigate('/Connexion') : disconnect} onKeyUp={!user ? () => navigate('/Connexion') : disconnect} className={styles.activeLink} aria-label={!user ? 'Se connecter' : 'Se déconnecter'}>
                {!user ? 'Ajouter un livre' : 'Se déconnecter'}
                <img src={FeatherIcon} alt="Feather Icon" className={styles.icon} />
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.content}>
          <div className={styles.Button}>
            <button type="button" onClick={!user ? () => navigate('/Connexion') : disconnect} onKeyUp={!user ? () => navigate('/Connexion') : disconnect} className={styles.activeLink} aria-label={!user ? 'Se connecter' : 'Se déconnecter'}>
              {!user ? 'Se connecter' : 'Se déconnecter'}
              <img src={FeatherIcon} alt="Feather Icon" className={styles.icon} />
            </button>
            <button type="button" onClick={!user ? () => navigate('/Connexion') : disconnect} onKeyUp={!user ? () => navigate('/Connexion') : disconnect} className={styles.activeLink} aria-label={!user ? 'Se connecter' : 'Se déconnecter'}>
              {!user ? 'Inscription' : 'Se déconnecter'}
              <img src={FeatherIcon} alt="Feather Icon" className={styles.icon} />
            </button>
          </div>
          <div className={styles.searchBar}>
            <div className={styles.inputSearch}>
              <input type="text" />
              <button type="button">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    token: PropTypes.string,
  }),
  setUser: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};

export default Header;
