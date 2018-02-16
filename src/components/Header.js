import React, { Component } from 'react';
import styled from 'styled-components';

import { TwilioBlue, TwilioWhite } from '../utils/colors';

const HeaderContainer = styled.header`
  width: 100%;
  padding: 20px;
  background: ${TwilioBlue};
  color: ${TwilioWhite};
  display: flex;
  justify-content: center;
`;

const HeaderGroup = styled.hgroup`
  width: 100%;
  max-width: 800px;
  img {
    display: block;
  }

  a {
    &,
    &:hover,
    &:focus,
    &:visited {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
    }
  }
`;

const Title = styled.h1`
  font-family: 'Open Sans Condensed', sans-serif;
  text-transform: uppercase;
  font-size: 4em;
  font-weight: 200;
  margin: 0;
`;

export default class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <HeaderGroup>
          <a href="/">
            <img
              src="https://www.twilio.com/marketing/bundles/company-brand/img/logos/white/twilio-logo-white.svg"
              alt="Twilio Logo"
            />{' '}
            <Title>Devsignal</Title>
          </a>
        </HeaderGroup>
      </HeaderContainer>
    );
  }
}
