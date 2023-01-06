import React, { useState } from 'react';
import styled from 'styled-components';

import Input from '../../components/Input';
import Button from '../../components/Button';
import LoginRow from './styled/LoginRow';
import Form from './styled/Form';

const NameRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 12px;
`;

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
};

type Props = {
  onSwapForm: () => void;
  submitted: boolean;
  submitting?: boolean;
  onSubmit: (payload: SignUpPayload) => void;
};

const SignUpForm = ({ onSwapForm, onSubmit, submitting, submitted }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handle = (cb) => (e) => cb(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      email,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <>
        {!submitted ? (
          <>
            <fieldset disabled={submitting}>
              <NameRow>
                <Input
                  required
                  label="First Name"
                  id="first-name"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={handle(setFirstName)}
                />
                <Input
                  required
                  label="Last Name"
                  id="last-name"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={handle(setLastName)}
                />
              </NameRow>
              <Input
                required
                label="Email"
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handle(setEmail)}
              />
            </fieldset>
            <Button type="submit">{submitting ? 'Sending...' : 'Sign Up'}</Button>
            {!submitting && (
              <LoginRow>
                <p>Already have an account?</p>
                <button type="button" onClick={onSwapForm}>
                  Login
                </button>
              </LoginRow>
            )}
          </>
        ) : (
          <div>
            <p>
              Thank you! A magic sign in link is on it's way to your inbox. We're so excited to read
              the Bible with you.
            </p>
          </div>
        )}
      </>
    </Form>
  );
};

export default SignUpForm;
