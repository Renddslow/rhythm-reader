import React from 'react';
import { CheckCircle } from 'phosphor-react';
import styled from 'styled-components';

const fmt = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
});

const Tag = styled.div`
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
  grid-gap: 4px;
  background: #9ba5ac;
  color: #111;
  border-radius: 8px;
  padding: 4px 8px 4px 4px;
  font-family: var(--sans-serif);
  font-size: 12px;
  font-weight: 600;
  align-items: center;
  margin-top: 12px;
`;

type Props = {
  completedAt: string;
  type?: 'read' | 'collect';
};

const CompletionTag = ({ completedAt, type = 'read' }: Props) => {
  return (
    <Tag>
      <CheckCircle weight="bold" size={18} />
      <span>
        You {type === 'read' ? 'finished reading' : 'collected'} this on{' '}
        {fmt.format(new Date(completedAt))}
      </span>
    </Tag>
  );
};

export default CompletionTag;
