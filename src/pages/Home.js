import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { Headline, ActionLink, Text } from '../components/common';

const CenterParagraph = styled.p`
  text-align: center;
  padding: 40px;
`;

const DevSignalImage = styled.img`
  width: 140px;
`;

export default class Home extends Component {
  render() {
    return (
      <Fragment>
        <CenterParagraph style={{ padding: 0 }}>
          <DevSignalImage
            src={process.env.PUBLIC_URL + '/images/devsignal-image.png'}
            alt=""
          />
        </CenterParagraph>
        <Headline>Welcome to the Twilio Devsignal</Headline>
        <Text>
          Are you currently at a hackathon and can't find any Twilio
          representative around or need additional help with your Twilio
          project?
        </Text>
        <Text>
          Here you can request help from the Twilio Developer Evangelism team.
          The system will ping the team for you and one of our team members is
          going to try to get back to you as soon as possible!
        </Text>
        <CenterParagraph>
          <ActionLink href="/request">Request Help</ActionLink>
        </CenterParagraph>
      </Fragment>
    );
  }
}
