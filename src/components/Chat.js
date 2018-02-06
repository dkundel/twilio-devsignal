import React, { Component, Fragment } from 'react';
import ChatClient from 'twilio-chat';
import styled from 'styled-components';

import { TwilioRed } from '../utils/colors';
import { Input, Button } from './common';
import ChatMessageList from './ChatMessageList';

const ErrorMessage = styled.p`
  color: ${TwilioRed};
  font-weight: bold;
`;

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateCurrentMessage = this.updateCurrentMessage.bind(this);
  }

  userMap = new Map();

  state = {
    messages: [],
    disconnected: true,
    error: false,
    members: [],
    currentMessage: ''
  };

  async componentWillMount() {
    try {
      await this.initialize();
    } catch (err) {
      console.error(err);
      this.setState({ error: 'Something failed with establishing the chat' });
    }
  }

  async initialize() {
    const { token, channelName } = this.props;
    const client = await ChatClient.create(token);

    this.registerListeners(client);

    const channel = await client.getChannelByUniqueName(channelName);
    return channel;
  }

  registerListeners(client) {
    client.on('channelJoined', channel => {
      this.channel = channel;

      channel.on('messageAdded', this.handleNewMessage.bind(this));
      channel.on('memberJoined', this.handleNewMember.bind(this));

      this.fetchInitialMessages(channel);
    });
  }

  async fetchInitialMessages(channel) {
    const page = await channel.getMessages();
    this.setState({ disconnected: false, messages: [...page.items] });
  }

  handleNewMessage(message) {
    this.setState({ messages: [...this.state.messages, message] });
  }

  handleNewMember(member) {
    this.setState({ members: [...this.state.members, member] });
  }

  updateCurrentMessage(evt) {
    const value = evt.target.value;
    this.setState({ currentMessage: value });
  }

  sendMessage(evt) {
    evt.preventDefault();
    const message = evt.target.message ? evt.target.message.value : '';
    this.channel.sendMessage(message);
    this.setState({ currentMessage: '' });
  }

  render() {
    if (this.state.error) {
      return this.renderError();
    } else {
      return this.renderChat();
    }
  }

  renderError() {
    return <ErrorMessage>{this.state.error}</ErrorMessage>;
  }

  renderChat() {
    return (
      <Fragment>
        <ChatMessageList messages={this.state.messages} />
        <form onSubmit={this.sendMessage}>
          <Input
            type="text"
            value={this.state.currentMessage}
            placeholder="Type your message..."
            name="message"
            onChange={this.updateCurrentMessage}
          />
          <Button type="submit" disabled={this.state.disconnected}>
            Send
          </Button>
        </form>
      </Fragment>
    );
  }
}
