import React, { useState } from 'react';
import styled from 'styled-components';

import LoginRow from './styled/LoginRow';
import Form from './styled/Form';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ExplainerText = styled.p`
  text-align: left !important;
  font-size: 14px !important;
`;

type Props = {
  onSwapForm: () => void;
  submitted: boolean;
  submitting?: boolean;
  onSubmit: (email: string) => void;
};

const LoginForm = ({ onSwapForm, onSubmit, submitting, submitted }: Props) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {!submitted ? (
        <>
          <ExplainerText>
            If you already have an account, put in your email address and we'll send you a{' '}
            <span role="img" aria-label="sparkle">
              ✨
            </span>{' '}
            magic{' '}
            <span role="img" aria-label="sparkle">
              ✨
            </span>{' '}
            login link.
          </ExplainerText>
          <fieldset disabled={submitting}>
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>
          <Button type="submit">{submitting ? 'Sending...' : 'Get Magic Link'}</Button>
          {!submitting && (
            <LoginRow>
              <p>Don't have an account yet?</p>
              <button type="button" onClick={onSwapForm}>
                Sign Up
              </button>
            </LoginRow>
          )}
        </>
      ) : (
        <div>
          <p>Thank you! A magic sign in link is on it's way to your inbox. Keep at it!</p>
        </div>
      )}
    </Form>
  );
};

export default LoginForm;
