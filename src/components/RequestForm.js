import React, { Component } from 'react';

import {
  Button,
  FormGroup,
  Label,
  TextArea,
  Input,
  Select,
  Link,
  Headline,
  SmallText,
  Ruler
} from '../components/common';
import { SupportedLanguages, SupportedProducts } from '../shared/consts';

export default class RequestForm extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.state = {
      form: {
        username: '',
        lang: undefined,
        product: undefined,
        message: '',
        eventCode: '',
        accountSid: ''
      }
    };
  }

  submitForm(evt) {
    evt.preventDefault();
    this.props.onSubmit(this.state.form);
  }

  updateValue(evt) {
    const { name, value } = evt.target;
    const form = { ...this.state.form, [name]: value };
    this.setState({ form });
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <FormGroup>
          <Label htmlFor="eventCodeInput">Event Code</Label>
          <Input
            type="text"
            name="eventCode"
            id="eventCodeInput"
            onChange={this.updateValue}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="nameInput">What's your name?</Label>
          <Input
            type="text"
            name="username"
            id="nameInput"
            onChange={this.updateValue}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="accountSidInput">
            What's your Account SID? You can find it in the{' '}
            <Link
              href="https://www.twilio.com/console"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twilio Console
            </Link>
          </Label>
          <Input
            type="text"
            name="accountSid"
            id="accountSidInput"
            onChange={this.updateValue}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="programmingLanguage">
            What programming language are you using?
          </Label>
          <Select
            id="programmingLanguage"
            name="lang"
            onChange={this.updateValue}
          >
            {SupportedLanguages.map(lang => (
              <option key={lang.key} value={lang.key}>
                {lang.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="twilioProduct">
            Which Twilio Product do you need help with?
          </Label>
          <Select id="twilioProduct" name="product" onChange={this.updateValue}>
            {SupportedProducts.map(lang => (
              <option key={lang.key} value={lang.key}>
                {lang.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="message">Please describe your issue briefly.</Label>
          <TextArea
            rows="5"
            name="message"
            id="message"
            onChange={this.updateValue}
          />
        </FormGroup>
        <Button disabled={this.props.disabled} type="submit">
          {this.props.disabled ? 'Requesting...' : 'Request Help'}
        </Button>
      </form>
    );
  }
}
