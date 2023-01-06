import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Hyperlink = styled(Link)`
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding: 0 6px;
  border-radius: 4px;
  width: fit-content;
  background: linear-gradient(0deg, var(--light-purple) 50%, #fff0);
  display: inline-block;
  cursor: pointer;
  font-weight: 400;
  color: #000;

  &::after {
    content: '';
    width: calc(100% - 12px);
    height: 0;
    border-bottom: 3px dashed var(--purple);
    position: absolute;
    bottom: 3px;
    left: 6px;
  }
`;

export default Hyperlink;
