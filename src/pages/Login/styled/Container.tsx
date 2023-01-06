import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media screen and (max-width: 820px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, max-content) minmax(0, 1fr);
  }

  @media screen and (min-width: 1440px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  }
`;

export default Container;
