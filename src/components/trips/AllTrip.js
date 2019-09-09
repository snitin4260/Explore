import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Header from "../header/Header";
import getTripsData from "../../actions/getTripsData";
import BackgroundContainer from "../BackgroundContainer/BackgroundContainer";
import styles from "./AllTrip.module.css";

const mapStateToProps = state => {
  return {
    tripsData: state.tripNamesData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTripsData: () => dispatch(getTripsData())
  };
};

const ListContainer = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const List = styled.li`
  display: inline-block;
  font-size: 1.6rem;
  max-width: 450px;
  width: 100%;
  overflow-wrap: break-word;
  margin-bottom: 2rem;
  text-align: center;
  font-family: "Roboto", sans-serif;
  background: white;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  /* padding: 1rem; */
`;

const Title = styled.h2`
margin-bottom: 2.5rem;
font-family: "Roboto",sans-serif;
font-size: 3rem;
color: #2874f0;
`;

class AllTrip extends React.Component {
  componentDidMount() {
    this.props.getTripsData();
  }

  render() {
    const { trips, isLoading, error } = this.props.tripsData;
    console.log(trips);
    return (
      <>
        <Header />
        <BackgroundContainer>
          <div className={styles.inner_container}>
            {!isLoading ? (
              <ListContainer>
                <Title>All Trips</Title>
                {trips.map(data => {
                  return (
                    <List className={styles.content} key={data._id}>
                      <Link
                        className={styles.link}
                        to={`/trip/itinerary/${data._id}`}
                      >
                        {data.tripName} ({data.createdAt})
                      </Link>
                    </List>
                  );
                })}
              </ListContainer>
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
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllTrip);
