import styled from 'styled-components';

import { TwilioRed, TwilioWhite } from '../utils/colors';

export const Button = styled.button`
  background: ${TwilioRed};
  color: ${TwilioWhite};
  border: none;
  padding: 10px 20px;

  &:hover {
    cursor: pointer;
  }
`;

export const FormGroup = styled.div``;
export const Label = styled.label``;
export const TextArea = styled.textarea``;
export const Input = styled.input``;
