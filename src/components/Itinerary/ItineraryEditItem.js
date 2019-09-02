import React from "react";
import styles from "./ItineraryEditItem.module.css";

class ItineraryEdititem extends React.Component {
  
  state = {
    day: this.props.itinerary.day,
    isExpand: false,
    location: this.props.itinerary.location,
    activity: this.props.itinerary.activity,
    addActivityButtonClicked: false,
    newActivityValue: ""
  };

  toggleClick = () => {
    this.setState(prevState => ({
      isExpand: !prevState.isExpand
    }));
  };

  checkZeroActivity() {
    if(this.state.activity.length === 0) return true
    return false

  }

  render() {
    const {
      day,
      isExpand,
      location,
      activity,
    } = this.state;

    const contentClass = isExpand? styles.show: ''
    return (
      <div>
        <div
          onClick={this.toggleClick}
          id={day}
          style={{
            cursor: "pointer"
          }}
          className={styles["accordion__day"]}
        >
          <h3>DAY {day}</h3>
          <div>
            {isExpand ? (
              <span className={styles["accordion__line"]} />
            ) : (
              <svg
                className={styles["accordion__icon"]}
                viewBox="0 0 14 5.94"
              >
                <path d="M14 1.002a1 1 0 0 0-1.546-.836L6.97 3.742 1.55.167a1 1 0 0 0-1.1 1.67l5.967 3.936a1 1 0 0 0 1.097.002l6.032-3.935A.998.998 0 0 0 14 1.002z" />
              </svg>
            )}
          </div>
        </div>
        {isExpand && (
          <div
            className={`${styles["accordion__content"]} ${contentClass} `}
          >
            <div className={styles["accordion__location"]}>
              <h4
                className={`${styles["label_header"]} 
              `}
              >
                Location:
              </h4>
              <div className={styles["location_input_container"]}>
                <input
                  className={styles["accordion__location_input"]}
                  value={location}
                  onChange={this.handleChange}
                  type="text"
                />
              </div>
            </div>
            <div className={styles["accordion__activity"]}>
              <h4
                className={`${styles["label_header"]} ${
                  styles["accordion__activity_header"]
                }`}
              >
                Activity
              </h4>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ItineraryEdititem;
