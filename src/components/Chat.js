import React, { Component, Fragment } from 'react';
import ChatClient from 'twilio-chat';
import styled from 'styled-components';
import { BounceLoader } from 'react-spinners';

import { TwilioRed, TwilioCerulean, TwilioDusk } from '../utils/colors';
import { Input, Button, SmallText, ErrorMessage } from './common';
import ChatMessageList from './ChatMessageList';

const MessageInput = styled(Input)`
  flex: 1;
  max-width: none;
  margin-right: 20px;
`;

const MessageForm = styled.form`
  display: flex;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingTitle = styled.h3`
  font-family: 'Open Sans Condensed', sans-serif;
  color: TwilioDusk;
  font-weight: 200;
`;

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateCurrentMessage = this.updateCurrentMessage.bind(this);
  }

  userMap = new Map();
  client = null;

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
      if (err.message.indexOf('token is expired') !== -1) {
        this.setState({
          error: 'Your session timed out. Please create a new one.'
        });
      } else {
        this.setState({
          error:
            'Something failed with establishing the chat. Try creating a new request.'
        });
      }
    }
  }

  async initialize() {
    const { token, channelName } = this.props;
    const client = await ChatClient.create(token);
    this.client = client;

    const channel = await client.getChannelByUniqueName(channelName);
    await this.registerListeners(channel);
    return channel;
  }

  async registerListeners(channel) {
    this.channel = channel;

    channel.on('messageAdded', this.handleNewMessage.bind(this));
    channel.on('memberJoined', this.handleNewMember.bind(this));

    this.fetchInitialMessages(channel);
  }

  async getFriendlyName(name) {
    if (this.userMap.has(name)) {
      return this.userMap.get(name);
    } else {
      const { friendlyName } = await this.client.getUserDescriptor(name);
      this.userMap.set(name, friendlyName);
      return friendlyName;
    }
  }

  async parseMessageInfo(message) {
    const { sid, body, author, timestamp } = message;
    const friendlyName = await this.getFriendlyName(author);
    console.log(message);
    return {
      sid,
      body,
      author: { identity: author, friendlyName },
      timestamp
    };
  }

  async fetchInitialMessages(channel) {
    const page = await channel.getMessages();
    const items = await Promise.all(
      page.items.map(m => this.parseMessageInfo(m))
    );
    this.setState({ disconnected: false, messages: [...items] });
  }

  async handleNewMessage(message) {
    message = await this.parseMessageInfo(message);
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
    } else if (this.state.disconnected) {
      return this.renderLoading();
    } else {
      return this.renderChat();
    }
  }

  renderError() {
    return <ErrorMessage>{this.state.error}</ErrorMessage>;
  }

  renderLoading() {
    return (
      <Center>
        <LoadingTitle>Contacting Developer Evangelists...</LoadingTitle>
        <BounceLoader color={TwilioCerulean} />
      </Center>
    );
  }

  renderChat() {
    return (
      <Fragment>
        <SmallText>
          A developer evangelist has been contacted and will message you here
          soon!
        </SmallText>
        <ChatMessageList messages={this.state.messages} />
        <MessageForm onSubmit={this.sendMessage}>
          <MessageInput
            type="text"
            value={this.state.currentMessage}
            placeholder="Type your message..."
            name="message"
            onChange={this.updateCurrentMessage}
          />
          <Button type="submit" disabled={this.state.disconnected}>
            Send
          </Button>
        </MessageForm>
      </Fragment>
    );
  }
}
