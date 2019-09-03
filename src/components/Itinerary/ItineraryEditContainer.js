import React from "react";
import ItineraryEditItem from "./ItineraryEditItem";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import getItineraryData from "../../actions/getItineraryData";
import styles from "./ItineraryEditContainer.module.css";
const mapDispatchToprops = dispatch => {
  return {
    getItineraryData: () => dispatch(getItineraryData())
  };
};

const mapStateToProps = state => {
  const { itinerary } = state;
  return {
    itinerary
  };
};

class ItineraryEditContainer extends React.Component {
  state = {
    redirectToTrips: false
  };

  render() {
    if (this.state.redirectToTrips) {
      return <Redirect to="/trip" />;
    }

    if (!this.props.location.state) {
      this.setState({
        redirectToTrips: true
      });
      return null;
    }
    const { tripId } = this.props.location.state;
    console.log(this.props.itinerary[tripId]);
    const { error, isLoading, data } = this.props.itinerary[tripId];
    return (
      <>
        {error ? (
          <div className={styles.error}>
            <h1 className={styles["error__heading"]}>
              Looks like Something went wrong on our end. Try reloading the page
            </h1>
            <img
              className={styles["error__image"]}
              alt="server down"
              src="https://res.cloudinary.com/dyzlj4fxl/image/upload/v1565110994/undraw_server_down_s4lk_bbndsf.svg"
            />
          </div>
        ) : (
          <div className={styles["itineraryContainer"]}>
            <div
              style={{
                maxWidth: "80rem",
                margin: "0 auto"
              }}
            >
              <h1 className={styles["itineraryContainer__heading"]}>
                Edit Itinerary
              </h1>
              {isLoading ? (
                <>
                  <div
                    className="loadingDiv"
                    style={{
                      height: "200px"
                    }}
                  />
                  <div
                    className="loadingDiv"
                    style={{
                      height: "200px"
                    }}
                  />
                  <div
                    className="loadingDiv"
                    style={{
                      height: "200px"
                    }}
                  />
                </>
              ) : (
                <>
                  {data.map((data, index) => {
                    return (
                      <ItineraryEditItem key={data.day} itinerary={data} />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToprops
)(ItineraryEditContainer);
