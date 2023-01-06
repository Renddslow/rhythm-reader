import React from 'react';
import styled from 'styled-components';

import { Inline as InlineType } from './types';
import hash from '../../../utils/hash';
import Inline from './Inline';

type PoetryLine = {
  type: 'poetry_line';
  indent: number;
  children: InlineType[];
};

export type PoetryBlock = {
  type: 'poetry';
  children: PoetryLine[];
};

type Props = {
  content: PoetryBlock;
};

const PoetryWrapper = styled.div`
  padding-left: 16px;

  &:not(:first-child) {
    margin-top: 24px;
  }
`;

const IndentableParagraph = styled.p<{ indent: number }>`
  margin-left: ${(props) => (props.indent - 1) * 24}px;
  margin-top: 4px !important;
`;

const Poetry = ({ content }: Props) => {
  return (
    <PoetryWrapper>
      {content.children.map((line) => (
        <IndentableParagraph indent={line.indent} key={hash(JSON.stringify(line))}>
          <Inline content={line.children} />
        </IndentableParagraph>
      ))}
    </PoetryWrapper>
  );
};

export default Poetry;
