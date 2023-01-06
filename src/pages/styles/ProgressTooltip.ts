import styled from 'styled-components';

const ProgressTooltip = styled.div`
  background: #111;
  color: #fff;
  position: absolute;
  width: max-content;
  max-width: 250px;
  line-height: 1.6;
  font-size: 14px;
  font-family: var(--sans-serif);
  border-radius: 8px;
  right: 0;
  top: 50px;
  z-index: 100;
  padding: 12px;

  &::before {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    position: absolute;
    transform: rotate(45deg);
    top: -6px;
    right: 35px;
    z-index: 1000;
    background: #111;
  }
`;

export default ProgressTooltip;
