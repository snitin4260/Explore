import React from 'react'
import styles from './Video.module.css'
function Video (props) {
  return (
    <>
      <div className={styles['video-container']}>
        <video className={styles.video} autoPlay muted loop>
          <source src={props.src} type='video/mp4' />
        </video>
      </div>
    </>
  )
}

export default Video
