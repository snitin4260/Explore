import React from 'react'
import styles from './LogoHeader.module.css'

function Logoheader () {
  return (
    <div className={styles.design}>
      <div className={styles['design-logo']}>
        <div className={styles['design-logo-text']}>Explore</div>
      </div>
    </div>
  )
}

export default Logoheader
