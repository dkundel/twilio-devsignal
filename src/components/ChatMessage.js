import React, { Component } from 'react';
import styled from 'styled-components';
import * as moment from 'moment';
import { emojify } from 'node-emoji';

import { TwilioDusk, TwilioRed, TwilioCerulean } from '../utils/colors';

const Message = styled.div`
  border-left: 5px solid
    ${props => (props.isTwilio ? TwilioRed : TwilioCerulean)};

  padding: 10px;
  margin-bottom: 10px;
`;
const MessageDetails = styled.p`
  color: ${TwilioDusk};
  font-size: 0.8em;
  margin-top: 0;
`;
const MessageBody = styled.p`
  margin-bottom: 0;
`;
const MessageAuthor = styled.span`
  flex: 1;
`;

export default class ChatMessage extends Component {
  render() {
    const { children: body, author, date, isTwilio } = this.props;
    const timeInfo = moment(date).fromNow();

    return (
      <Message isTwilio={isTwilio}>
        <MessageDetails>
          <MessageAuthor>
            <strong>{author}</strong> wrote {timeInfo}...
          </MessageAuthor>
        </MessageDetails>
        <MessageBody>{emojify(body)}</MessageBody>
      </Message>
    );
  }
}
