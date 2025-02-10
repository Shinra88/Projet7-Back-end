import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import BookItem from '../../components/Books/BookItem/BookItem';
import BestRateBooks from '../../components/Books/BestRatedBooks/BestRatedBooks';
import Banner from '../../images/library.png';
import styles from './Home.module.css';
import { getBooks } from '../../lib/common';

function Home() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line max-len
  const displayBooks = () => (books ? books.map((book) => <BookItem size={2} book={book} key={book.id} />) : <h1>Vide</h1>);

  useEffect(() => {
    async function getBooksList() {
      const data = await getBooks();
      if (data) {
        setBooks(data);
        setLoading(false);
      }
    }
    getBooksList();
  }, []);
  const backgroundImageStyle = { backgroundImage: `url(${Banner})` };
  return (
    <div className={styles.Home}>
      <div className={styles.banner} style={backgroundImageStyle} />
      <main className={styles.main}>
        <header className={styles.head}>
          <p>
            <NavLink to="/Ajouter" className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
              Dernier ajout
            </NavLink>
          </p>
          <p>
            <NavLink to="/Ajouter" className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
              Mieux noté
            </NavLink>
          </p>
        </header>
        <BestRateBooks />
        <section className={styles.bookList}>
          {loading ? <h1>Chargement</h1> : displayBooks()}
        </section>
      </main>
    </div>

  );
}

export default Home;
