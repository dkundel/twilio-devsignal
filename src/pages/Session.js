import React, { Component, Fragment } from 'react';
import { parse } from 'query-string';

import Chat from '../components/Chat';

export default class Session extends Component {
  constructor(props) {
    super(props);
    this.fetchToken = this.fetchToken.bind(this);
  }

  fetchToken() {}

  render() {
    let token;
    const id = this.props.match.params.id;
    const query = parse(this.props.location.search);
    if (query.token) {
      token = query.token;
    } else {
      token = localStorage.getItem(id);
    }

    if (!token) {
      this.props.history.push('/request');
    }

    return (
      <Fragment>
        <p>Session</p>
        <Chat token={token} channelName={id} />
      </Fragment>
    );
  }
}
