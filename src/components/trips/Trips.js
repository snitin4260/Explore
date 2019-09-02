import React from 'react'
import { connect } from 'react-redux'
import getTripsCount from '../../actions/getTripsCount'
import Header from '../header/Header'
import styles from './Trips.module.css'
import {withRouter}from "react-router-dom"
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer"

class Trips extends React.Component {
  componentDidMount() {
    this.props.getTripCount();
  }

  routeToCreateTripPage = () => {
    const { history, location } = this.props;
    history.push(`${location.pathname}/create`);
  };

  routeToShowAllTripsPage = () => {
    const { history, location } = this.props;
    history.push(`${location.pathname}/all`);

  }

  render() {
    const { isLoading, tripCount, error } = this.props.tripCountDetails;

    return (
      <>
        <Header />
        <BackgroundContainer>
          <div
            style={{
              maxWidth: "80rem",
              margin: "0 auto"
            }}
          >
            {isLoading ? (
              <div>
                <div
                  style={{
                    height: "200px"
                  }}
                  className="loadingDiv"
                />
                <div
                  style={{
                    height: "200px"
                  }}
                  className="loadingDiv"
                />
              </div>
            ) : error ? (
              <div>{error.message}</div>
            ) : (
              <div className={styles["button-container"]}>
                <button
                  onClick={this.routeToCreateTripPage}
                  className={styles["button_item"]}
                >
                  Create a Trip
                </button>
                {tripCount ? (
                  <button
                    onClick={this.routeToShowAllTripsPage}
                    className={styles["button_item"]}
                  >
                    See all Trips
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </BackgroundContainer>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTripCount: () => { dispatch(getTripsCount()) }
  }
}

const mapStateToProps = state => {
  return {
    tripCountDetails: state.inititalTripCountDetail
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Trips))
