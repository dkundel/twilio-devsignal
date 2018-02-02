import React, { Component } from 'react';
import styled from 'styled-components';

import ChatMessage from './ChatMessage';

const MessageList = styled.div``;

export default class ChatMessageList extends Component {
  render() {
    const { messages } = this.props;
    const allMessages = messages.map(msg => {
      return (
        <ChatMessage author={msg.author} key={msg.sid}>
          {msg.body}
        </ChatMessage>
      );
    });
    return <MessageList>{allMessages}</MessageList>;
  }
}
