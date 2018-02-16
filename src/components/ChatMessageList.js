import React, { Component } from 'react';
import styled from 'styled-components';

import { TwilioChalk } from '../utils/colors';
import ChatMessage from './ChatMessage';

const MessageList = styled.div`
  background: ${TwilioChalk};
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px 20px;
`;

export default class ChatMessageList extends Component {
  render() {
    const { messages } = this.props;
    const allMessages = messages.map(msg => {
      const isTwilio = msg.author.identity === 'devangel';
      return (
        <ChatMessage
          author={msg.author.friendlyName}
          date={msg.timestamp}
          key={msg.sid}
          isTwilio={isTwilio}
        >
          {msg.body}
        </ChatMessage>
      );
    });
    return <MessageList>{allMessages}</MessageList>;
  }
}
