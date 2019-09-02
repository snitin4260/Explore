import React from 'react'
import Header from '../header/Header'
import getTripsData from '../../actions/getTripsData'
import BackgroundContainer from '../BackgroundContainer/BackgroundContainer'
import { connect } from 'react-redux'
import styles from './AllTrip.module.css'
import { Link } from 'react-router-dom'

const mapStateToProps = state => {
  return {
    tripsData: state.tripNamesData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTripsData: () => dispatch(getTripsData())
  }
}

class AllTrip extends React.Component {
  componentDidMount () {
    this.props.getTripsData()
  }

  render () {
    const { trips, isLoading, error } = this.props.tripsData
    console.log(trips)
    return (
      <>
        <Header />
        <BackgroundContainer>
          <div className={styles.inner_container}>
            {!isLoading ? (
              <>
                {trips.map(data => {
                  return (
                    <div className={styles.content} key={data._id}>
                      <Link className={styles.link} to={`/trip/itinerary/${data._id}`}>
                        {data.tripName} ({data.createdAt})
                      </Link>
                    </div>
                  )
                })}
              </>
            ) : (
              <div>
                <div className={`loadingDiv ${styles.block}`} />
                <div className={`loadingDiv ${styles.block}`} />
                <div className={`loadingDiv ${styles.block}`} />
                <div className={`loadingDiv ${styles.block}`} />
              </div>
            )}
          </div>
        </BackgroundContainer>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTrip)
