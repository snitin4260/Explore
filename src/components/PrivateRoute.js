import React from "react";
import { Route, Redirect } from "react-router-dom";
import {connect} from "react-redux"
import Login from "../components/Login/Login";
import { getUsernameLs } from "../util/index";


const mapStateToProps= (state) =>{
    return {
        user: state.user
    }
}

function PrivateRoute({ component: Component,user, ...rest }) {

  return (
    <Route
      {...rest}
      render={props => {
        return (getUsernameLs()||user.isLoggedIn === true )? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location ,showNothingUntilCheck: true}
            }}
          />
        );
      }}
    />
  );
}

export default connect(mapStateToProps)(PrivateRoute)
