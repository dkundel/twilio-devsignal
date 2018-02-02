import React, { Component, Fragment } from 'react';

import {
  Button,
  FormGroup,
  Label,
  TextArea,
  Input
} from '../components/common';
import { SupportedLanguages, SupportedProducts } from '../shared/consts';

export default class RequestHelp extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(evt) {
    evt.preventDefault();
    const form = evt.target;
    const { username, lang, product, message } = form;
    const info = {
      username: username.value,
      lang: lang.value,
      product: product.value,
      message: message.value
    };
    console.log(info);
  }
  render() {
    return (
      <Fragment>
        <p>Hello</p>
        <form onSubmit={this.submitForm}>
          <FormGroup>
            <Label for="nameInput">What's your name?</Label>
            <Input type="text" name="username" id="nameInput" />
          </FormGroup>
          <FormGroup>
            <Label for="programmingLanguage">
              What programming language are you using?
            </Label>
            <select id="programmingLanguage" name="lang">
              {SupportedLanguages.map(lang => (
                <option key={lang.key} value={lang.key}>
                  {lang.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <Label for="twilioProduct">
              Which Twilio Product do you need help with?
            </Label>
            <select id="twilioProduct" name="product">
              {SupportedProducts.map(lang => (
                <option key={lang.key} value={lang.key}>
                  {lang.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <Label for="message">Please describe your issue briefly.</Label>
            <TextArea name="message" id="message" />
          </FormGroup>
          <Button type="submit">Request Help</Button>
        </form>
      </Fragment>
    );
  }
}
