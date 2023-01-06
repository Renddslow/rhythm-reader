import styled from 'styled-components';

const Button = styled.button`
  font-size: inherit;
  appearance: none;
  background: var(--purple);
  color: #fff;
  border-radius: 4px;
  border: 0;
  width: 100%;
  padding: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out;

  &:hover,
  &:focus,
  &:active {
    background: hsl(var(--purple-hue), var(--purple-sat), 37%);
  }
`;

export default Button;
