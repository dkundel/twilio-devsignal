import React, { Component } from 'react';
import styled from 'styled-components';

const Message = styled.div``;
const MessageAuthor = styled.p``;
const MessageBody = styled.p``;

export default class ChatMessage extends Component {
  render() {
    const { children: body, author } = this.props;

    return (
      <Message>
        <MessageAuthor>
          <strong>{author}</strong> wrote...
        </MessageAuthor>
        <MessageBody>{body}</MessageBody>
      </Message>
    );
  }
}
