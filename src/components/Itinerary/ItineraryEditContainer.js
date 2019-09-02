import React from 'react'
import ItineraryEditItem from './ItineraryEditItem'
import { connect } from 'react-redux'
import getItineraryData from '../../actions/getItineraryData'
import styles from './ItineraryEditContainer.module.css'

class ItineraryEditContainer extends React.Component {
  componentDidMount () {
    this.props.getItineraryData()
  }

  render () {
    console.log(this.props.itineraryData)
    const { error, isLoading, itinerary } = this.props.itineraryData
    return (
      <>
        {error ? (
          <div className={styles.error}>
            <h1 className={styles['error__heading']}>
              Looks like Something went wrong on our end. Try reloading the page
            </h1>
            <img
              className={styles['error__image']}
              alt='server down'
              src='https://res.cloudinary.com/dyzlj4fxl/image/upload/v1565110994/undraw_server_down_s4lk_bbndsf.svg'
            />
          </div>
        ) : (
          <div className={styles['itineraryContainer']}>
            <div
              style={{
                maxWidth: '80rem',
                margin: '0 auto'
              }}
            >
              <h1 className={styles['itineraryContainer__heading']}>
                Edit Itinerary
              </h1>
              {isLoading ? (
                <>
                  <div
                    className='loadingDiv'
                    style={{
                      height: '200px'
                    }}
                  />
                  <div
                    className='loadingDiv'
                    style={{
                      height: '200px'
                    }}
                  />
                  <div
                    className='loadingDiv'
                    style={{
                      height: '200px'
                    }}
                  />
                </>
              ) : (
                <>
                  {itinerary.map((data, index) => {
                    return (
                      <ItineraryEditItem key={data.day} itinerary={data} />
                    )
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </>
    )
  }
}

const mapDispatchToprops = dispatch => {
  return {
    getItineraryData: () => dispatch(getItineraryData())
  }
}

const mapStateToProps = state => {
  const { itineraryData } = state
  return {
    itineraryData
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToprops
)(ItineraryEditContainer)
