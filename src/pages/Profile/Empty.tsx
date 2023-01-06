import React from 'react';
import styled from 'styled-components';
import { Egg } from 'phosphor-react';

type Props = {
  label: string;
};

const Wrapper = styled.div`
  width: 100%;
  padding: 14px 0;
  display: block;
  box-sizing: border-box;
  margin-bottom: 32px;

  svg {
    margin: 0 auto;
    display: block;
    width: 56px;
    height: 56px;
  }

  h4 {
    text-align: center;
    font-size: 18px;
    max-width: 300px;
    display: block;
    margin: 18px auto 0;
    color: #5a5a5f;
  }
`;

const Empty = ({ label }: Props) => {
  return (
    <Wrapper>
      <Egg weight="duotone" color="#999" />
      <h4>{label}</h4>
    </Wrapper>
  );
};

export default Empty;
