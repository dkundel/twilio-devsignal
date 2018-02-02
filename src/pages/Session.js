import React, { Component, Fragment } from 'react';

import Chat from '../components/Chat';

export default class Session extends Component {
  constructor(props) {
    super(props);
    this.fetchToken = this.fetchToken.bind(this);
  }

  fetchToken() {}

  render() {
    return (
      <Fragment>
        <p>Session</p>
        <Chat fetch={this.fetchToken} />
      </Fragment>
    );
  }
}
