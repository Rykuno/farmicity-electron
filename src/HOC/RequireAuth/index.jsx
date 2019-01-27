import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import * as Queries from '../../queries';
import { withRouter } from 'react-router-dom';

export default WrappedComponent => {
  class RequireAuth extends Component {
    componentWillUpdate = nextProps => {
      const { loading, user } = nextProps.currentUser;
      if (!user && !loading) {
        this.props.history.push('/login');
      }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const userOptions = {
    name: 'currentUser'
  };

  return compose(
    graphql(Queries.currentUser, userOptions),
    withRouter
  )(RequireAuth);
};
