import React from 'react'
import Header from '../header/Header'
import ImgwithTitle from '../ImagewithHeading/ImgwithTitle'
import Video from '../video/Video'

class MainPage extends React.Component {
  render () {
    console.log(this.props)
    return (
      <>
        <Header />
        <Video
          src={
            'https://res.cloudinary.com/dyzlj4fxl/video/upload/v1563632135/explore_pmijtf.mp4'
          }
        />
        <ImgwithTitle
          mainTitle={'Explore the unexplored'}
          extraInfo={
            'Be fearless in the pursuit of what sets your soul on fire'
          }
          name='operaing in 700+cities'
          imgUrl={
            'https://res.cloudinary.com/dyzlj4fxl/image/upload/v1563632133/mountain_sb7blj.jpg'
          }
        />
        <ImgwithTitle
          mainTitle={'To Travel is to Live'}
          extraInfo={
            'Better to see something once than hear about it a thousand times'
          }
          name='safety'
          imgUrl={
            'https://res.cloudinary.com/dyzlj4fxl/image/upload/v1563632139/bridge-water_ebgbcv.jpg'
          }
        />
      </>
    )
  }
}

export default MainPage
