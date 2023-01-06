import styled from 'styled-components';

const Jumbotron = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  background-color: var(--red);
  position: relative;
  background-blend-mode: multiply;
  background-image: url('/harrowing_of_hell.png');
  background-size: cover;

  @media screen and (max-width: 820px) {
    height: 0;
    padding-bottom: 50%;
  }

  @media screen and (max-width: 480px) {
    padding-bottom: 100%;
  }
`;

export default Jumbotron;
