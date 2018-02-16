import React, { Component, Fragment } from 'react';

import {
  Button,
  FormGroup,
  Label,
  TextArea,
  Input,
  Select,
  Link,
  Headline,
  SmallText,
  Ruler
} from '../components/common';
import RequestForm from '../components/RequestForm';
import { TwilioCerulean } from '../utils/colors';
import { BarLoader } from 'react-spinners';

export default class RequestHelp extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      loading: false,
      error: undefined
    };
  }

  async submitForm(info) {
    console.log(info);
    this.setState({ loading: true });
    try {
      const resp = await fetch('/api/request', {
        method: 'POST',
        body: JSON.stringify(info),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });

      if (!resp.ok) {
        throw new Error(await resp.text());
      }

      const { token, channelName } = await resp.json();
      localStorage.setItem(channelName, token);
      this.props.history.push(`/session/${channelName}`);
    } catch (err) {
      console.error(err);
      this.setState({ loading: false, error: err.message });
    }
  }
  render() {
    return (
      <Fragment>
        <Headline>Request for Help</Headline>
        <SmallText>
          Before we can assist you, we'll need a few pieces of information from
          you.
        </SmallText>
        <SmallText>
          If you are wondering what your Event Code is, you should have gotten
          this from the Twilio represenatative at your event. When in doubt, ask
          one of your fellow attendees or the organizer.
        </SmallText>
        <Ruler />
        {this.renderError()}
        <RequestForm onSubmit={this.submitForm} disabled={this.state.loading} />
        {this.renderLoader()}
      </Fragment>
    );
  }

  renderError() {
    if (!this.state.error) {
      return <Fragment />;
    }
    return <p>{this.state.error}</p>;
  }

  renderLoader() {
    if (!this.state.loading) {
      return <Fragment />;
    }
    return <BarLoader color={TwilioCerulean} width={140} />;
  }
}
