import React from 'react'
import styles from './ImgwithTitle.module.css'

function ImgwithTitle (props) {
  return (
    <div className={styles['img-container']}>
      <div className={`${styles.blackBox} ${styles.top}`}>
        <h1 className={styles['image-header']}>{props.mainTitle}</h1>
        <p className={styles['image-para']}>{props.extraInfo}</p>
      </div>
      <img className={styles.image} loading='lazy' src={props.imgUrl} alt={props.name} />
      <div className={`${styles.blackBox} ${styles.bottom}`} />
    </div>
  )
}
export default ImgwithTitle
