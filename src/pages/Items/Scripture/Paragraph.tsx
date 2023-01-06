import React from 'react';
import styled from 'styled-components';

import { Inline as InlineType } from './types';
import Inline from './Inline';

export type ParagraphBlock = {
  type: 'paragraph';
  children: InlineType[];
};

type Props = {
  content: ParagraphBlock;
};

const ParagraphStyled = styled.p`
  line-height: 2;
  &:not(:first-child) {
    margin-top: 24px;
  }
`;

const Paragraph = ({ content }: Props) => {
  return (
    <ParagraphStyled>
      <Inline content={content.children} />
    </ParagraphStyled>
  );
};

export default Paragraph;
