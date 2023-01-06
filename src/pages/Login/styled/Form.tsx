import styled from 'styled-components';

const Form = styled.form`
  display: grid;
  width: 100%;
  margin-top: 72px;
  position: relative;
  padding-bottom: 48px;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 12px;

  &::before {
    content: '';
    width: 120px;
    margin: 0 auto;
    height: 1px;
    display: block;
    background: #000;
    position: absolute;
    left: calc(50% - 60px);
    top: -36px;
  }

  fieldset {
    appearance: none;
    border: 0;
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 12px;
    display: grid;
  }
`;

export default Form;
