import styled from 'styled-components';

const FormWrapper = styled.div`
  h1,
  p {
    font-family: var(--sans-serif);
    z-index: 200;
    position: relative;
    font-size: 18px;
    text-align: center;
  }

  p {
    color: hsl(240deg, 14%, 45%);
  }

  h1 {
    font-weight: 800;
    font-size: 34px;
  }
`;

export default FormWrapper;
