import { ArrowLeft } from 'phosphor-react';
import { Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  grid-gap: 4px;
  align-items: center;
  text-decoration: none;
  margin-right: auto;
  margin-left: 16px;

  span {
    text-decoration: none;
    font-family: var(--sans-serif);
    color: #000;
  }
`;

const Home = () => (
  <StyledLink to="/read">
    <ArrowLeft />
    <span>Home</span>
  </StyledLink>
);

export default Home;
