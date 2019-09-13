import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import styles from "./Header.module.css";
import { getUsernameLs,clearUsername } from "../../util/index";
import { getUsername } from "../../actions/userData";
import {API_URL} from '../../api/index'



const PageHeader = styled.header`
  background-color: black;
  color: white;
  padding: 0 0.6rem;
  height: 6rem;
`;
const Container = styled.div`
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  height: 100%;
`;

const LogoContainer = styled.div`
  display: inline-block;
  padding-top: 0.5rem;
`;

const IconContainer = styled.div`
  margin-right: 3rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-left: auto;
  padding-top: 0.5rem;

  &:hover .option {
    display: block;
  }
`;

const UserSvg = styled.svg`
  width: 4rem;
  height: 4rem;
`;

const Name = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 1.6rem;
  margin-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100px;
`;

const LoginSignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;

const OptionItem = styled.div`
  font-size: 1.6rem;
  font-family: "Roboto", sans-serif;
  margin-bottom: 0.5rem;
  cursor: pointer;
  padding: 1rem 0 1rem 1rem;
  &:hover {
    background: #4786ff;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SpecialOptionItem = styled(OptionItem)`
  padding: 0;
`;
const OptionContainer = styled.div`
  display: none;
  position: absolute;
  top: 60px;
  right: 0;
  width: 200px;
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 500;
  background: #21252d;
`;

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  getUsername: _ => {
    dispatch(getUsername());
  }
});

class Header extends React.Component {
  state = {
    logOutError: false,
    logOutErrorMessage: ""
  };
  componentDidMount() {
    const { user, getUsername } = this.props;
    if (user.userName) {
      return;
    }
    if (getUsernameLs()) {
      return;
    }

    getUsername();
  }

  handleLogOut = async _ => {
    //make api request
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "GET"
      });
      const responseObject = await response.json();
      if (response.status !== 200) {
        this.setState({
          logOutError: true,
          logOutErrorMessage: responseObject.msg
        });
             return;
      }
 
    } catch (e) {
      this.setState({
        logOutError: true,
        logOutErrorMessage: "Server is down. Please try after some time"
      });
      return;
    }

    // delete from local storage
    clearUsername();
    // refresh and redirect to login
    window.location.reload();
  };
  render() {
    const userFromLs = getUsernameLs();
    const { userName, isFetchingData, fetchError } = this.props.user;
    const { error, status } = fetchError;
    return (
      <PageHeader>
        <Container>
          <LogoContainer>
            <Link className={styles["header__logo-item"]} to="/">
              Explore
            </Link>
          </LogoContainer>
          {error && status === 401 && (
            <LoginSignupContainer>
              <Link className={styles["header__item"]} to="/login">
                Log in
              </Link>

              <Link className={styles["header__button"]} to="/register">
                Sign up
              </Link>
            </LoginSignupContainer>
          )}
          {(userName || userFromLs) && (
            <IconContainer>
              <Name>{(userName || userFromLs.userName).slice(0, 10)}...</Name>
              <UserSvg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"
                ></path>
              </UserSvg>
              <OptionContainer className="option">
                <SpecialOptionItem>
                  {" "}
                  <Link className={styles.option_link} to="/profile">
                    Profile
                  </Link>
                </SpecialOptionItem>
                <SpecialOptionItem>
                  <Link className={styles.option_link} to="/trip/all">
                    See trips
                  </Link>
                </SpecialOptionItem>
                <SpecialOptionItem>
                  <Link className={styles.option_link} to="/trip/create">
                    Create a Trip
                  </Link>
                </SpecialOptionItem>
                <OptionItem onClick={this.handleLogOut}>Log Out</OptionItem>
              </OptionContainer>
            </IconContainer>
          )}
        </Container>
      </PageHeader>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
