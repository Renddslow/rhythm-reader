import React, { useState } from 'react';
import styled from 'styled-components';

import SignUpForm, { SignUpPayload } from './SignUpForm';
import LoginForm from './LoginForm';
import Container from './styled/Container';
import FormWrapper from './styled/FormWrapper';
import Jumbotron from './styled/Jumbotron';

const Wrapper = styled.div`
  margin: 96px auto 0;
  width: 75%;
  padding: 24px;

  @media screen and (max-width: 1024px) {
    width: 95%;
  }

  @media screen and (min-width: 1440px) {
    width: 60%;
  }
`;

const Header = styled.header`
  p:first-child {
    font-size: 14px;
    font-weight: 600;
  }

  h1 {
    margin: 8px 0 24px;
  }

  p:not(:first-child) {
    font-size: 18px;
    line-height: 1.5;
    text-align: center;

    @media screen and (max-width: 480px) {
      font-size: 16px;
    }
  }
`;

const sleep = () => new Promise((res) => setTimeout(res, 3000));

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (payload: SignUpPayload) => {
    setSubmitting(true);

    await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    setSubmitted(true);
    setSubmitting(false);
  };

  const handleLogin = async (email: string) => {
    setSubmitting(true);
    await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <Container>
      <Jumbotron
        role="img"
        aria-label="A classic Orthodox icon depicting Jesus on Resurrection Sunday, harrowing Hades and bringing the righteous dead to life."
      />
      <FormWrapper>
        <Wrapper>
          <Header>
            <p>Flatland Church</p>
            <h1>Rhythm Reader</h1>
            <p>
              Read along with us on a six-week journey as we trace the theme of sacred rhythms
              throughout Scripture. Together we'll discover how Jesus invites us into rest and
              reflection of God's faithfulness.
            </p>
          </Header>
          {showSignUp ? (
            <SignUpForm
              onSwapForm={() => setShowSignUp(false)}
              onSubmit={handleCreate}
              submitting={submitting}
              submitted={submitted}
            />
          ) : (
            <LoginForm
              onSwapForm={() => setShowSignUp(true)}
              onSubmit={handleLogin}
              submitting={submitting}
              submitted={submitted}
            />
          )}
        </Wrapper>
      </FormWrapper>
    </Container>
  );
};

export default Login;
