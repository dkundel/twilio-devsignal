import React from 'react';
import styled from 'styled-components';

import {
  TwilioBlue,
  TwilioRed,
  TwilioWhite,
  TwilioCerulean,
  TwilioDusk
} from '../utils/colors';

export const Button = styled.button`
  background: ${TwilioRed};
  color: ${TwilioWhite};
  border: none;
  padding: 10px 20px;

  &:hover {
    cursor: pointer;
  }

  &[disabled] {
    cursor: not-allowed;
    background: ${TwilioDusk};
  }
`;

export const ActionLink = styled.a`
  background: ${TwilioCerulean};
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(148, 151, 155, 0.65);
  text-decoration: none;
  color: ${TwilioWhite};
  outline: 0;
  text-decoration: none;
  padding: 20px 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  transition: background-color 200ms linear;
  &:hover,
  &:focus {
    background: #059;
    box-shadow: 0 10px 25px rgba(148, 151, 155, 0.9);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.8em;
  color: ${TwilioDusk};
  margin-bottom: 10px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  max-width: 400px;
  background: none;
  border: 0;
  border-bottom: 1px solid ${TwilioDusk};
  border-radius: none;
  padding: 10px;
  outline: 0;
  &:focus {
    border-bottom-color: ${TwilioCerulean};
  }
`;

export const Select = styled.select`
  width: 100%;
  max-width: 400px;
  background: none;
  border: 0;
  border-bottom: 1px solid ${TwilioDusk};
  border-radius: none;
  padding: 10px;
`;

export const Input = styled.input`
  margin-top: 0px;
  padding: 10px;
  padding-top: 0;
  border: 0;
  border-bottom: 1px solid ${TwilioDusk};
  outline: 0;
  width: 100%;
  max-width: 400px;
  &:focus {
    border-bottom-color: ${TwilioCerulean};
  }
`;

export const Link = styled.a`
  text-decoration: underline;
  text-decoration-color: ${TwilioRed};
  &,
  &:visited {
    color: inherit;
  }

  &:hover,
  &:focus {
    color: ${TwilioRed};
  }
`;

export const SmallText = styled.p`
  color: ${TwilioDusk};
  font-size: 0.8em;
`;

export const Headline = styled.h2`
  font-family: 'Open Sans', sans-serif;
  font-weight: 200;
  color: ${TwilioBlue};
`;

export const Text = styled.p`
  line-height: 1.5em;
`;

export const Ruler = styled.hr`
  color: ${TwilioCerulean};
  border: 0;
  border-bottom: 1px solid;
  margin: 25px;
`;

const ErrorContent = styled.p`
  font-size: 0.8em;
  align-self: center;
`;
const ErrorImage = styled.img`
  height: 40px;
`;
const ErrorContainer = styled.div`
  margin-bottom: 20px;
  border-left: 3px solid ${TwilioRed};
  padding: 10px 20px;
  padding-left: 0;
  display: flex;
`;

export const ErrorMessage = ({ children }) => {
  return (
    <ErrorContainer>
      <ErrorImage
        src={process.env.PUBLIC_URL + '/images/error-sign.svg'}
        alt="Error Symbol"
      />
      <ErrorContent>{children}</ErrorContent>
    </ErrorContainer>
  );
};
