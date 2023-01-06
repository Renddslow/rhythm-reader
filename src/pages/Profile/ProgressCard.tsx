import { BookmarkSimple, Triangle } from 'phosphor-react';
import React from 'react';
import styled from 'styled-components';
import { default as ColorHash } from 'color-hash';

import CompletionTag from '../../components/CompletionTag';

const Card = styled.div`
  --shadow-color: 0deg 0% 73%;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 1.4px hsl(var(--shadow-color) / 0.04),
    0 4px 5.8px -0.1px hsl(var(--shadow-color) / 0.14),
    0 8.1px 11.7px -0.2px hsl(var(--shadow-color) / 0.25),
    0 16.7px 24.2px -0.4px hsl(var(--shadow-color) / 0.36);
  padding: 8px;

  svg {
    margin: 0 auto;
  }

  h3 {
    text-align: center;
  }
`;

const ProgressCard = ({ title, movement, page, done, type = 'progress' }) => {
  const color = new ColorHash.default();

  const Icon = type === 'progress' ? BookmarkSimple : Triangle;

  return (
    <Card>
      <Icon
        weight="duotone"
        size={48}
        color={color.hex(JSON.stringify({ title, movement, page }))}
      />
      <div>
        <h3>{title}</h3>
        <CompletionTag completedAt={done} />
      </div>
    </Card>
  );
};

export default ProgressCard;
