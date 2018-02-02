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
  }

  state = {
    messages: [
      { author: 'foobar', body: 'Hello how is it going?', sid: 'sdaf' },
      { author: 'bla', body: 'Something else', sid: 'asfdsdf' }
    ],
    disconnected: true,
    error: false,
    members: []
  };

  async componentWillMount() {
    // try {
    //   await this.initialize();
    // } catch (err) {
    //   console.error(err);
    //   this.setState({ error: 'Something failed with establishing the chat' });
    // }
  }

  async initialize() {
    const { token, channelName } = await this.props.fetch();
    const client = await ChatClient.create(token);

    this.registerListeners(client);

    const channel = await client.getChannelByUniqueName({
      uniqueName: channelName
    });
    return channel.join();
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
    this.setState({ messages: [...page.items] });
  }

  handleNewMessage(message) {
    this.setState({ messages: [...this.state.messages, message] });
  }

  handleNewMember(member) {
    this.setState({ members: [...this.state.members, member] });
  }

  sendMessage(evt) {
    const message = evt.target.message ? evt.target.message.value : '';
    this.channel.sendMessage(message);
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
            placeholder="Type your message..."
            name="message"
          />
          <Button type="submit">Send</Button>
        </form>
      </Fragment>
    );
  }
}
