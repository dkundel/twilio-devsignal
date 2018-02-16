import React, { Component } from 'react';
import styled from 'styled-components';

import { TwilioDusk } from '../utils/colors';
import { Link } from '../components/common';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 10px 20px;
  text-align: center;
`;

const Small = styled.p`
  color: ${TwilioDusk};
  font-size: 0.6em;
`;

export default class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <img
          src="https://www.twilio.com/marketing/bundles/company-brand/img/logos/red/twilio-mark-red.svg"
          alt="Twilio Logo"
        />
        <Small>
          Created by{' '}
          <Link href="https://github.com/dkundel/about-me">Dominik Kundel</Link>.
          Code available on{' '}
          <Link href="https://github.com/dkundel/twilio-devsignal">GitHub</Link>
        </Small>
      </FooterContainer>
    );
  }
}
