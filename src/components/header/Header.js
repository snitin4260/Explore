import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header (props) {
  return (
    <header className={styles.header}>
      <div className={styles['header__container']}>
        <div className={styles['header__logo']}>
          <Link className={styles['header__logo-item']} to='/'>
            Explore
          </Link>
        </div>
        <div>
          <Link className={styles['header__item']} to='/login'>
            Log in
          </Link>

          <Link className={styles['header__button']} to='/register'>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
