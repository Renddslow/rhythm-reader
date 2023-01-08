import React from 'react';
import styled from 'styled-components';
import {
  BookOpen,
  ArticleMedium,
  YoutubeLogo,
  CaretRight,
  CheckCircle,
  Gift,
} from 'phosphor-react';
import { Link } from 'react-router-dom';

const icons = {
  scripture: BookOpen,
  video: YoutubeLogo,
  markdown: ArticleMedium,
  bonus: Gift,
};

const ItemStyled = styled.div<{ complete: boolean; isNext: boolean }>`
  color: #fff;
  margin-left: calc(60px + 12px);
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(0, 1fr) minmax(0, max-content);
  grid-gap: 12px;
  align-items: center;
  padding: 32px 0;
  font-size: 16px;
  font-weight: ${(props) => (props.complete ? 300 : 500)};

  &:not(:last-child) {
    border-bottom: 1px solid hsl(240deg, 14%, 75%);
  }

  p {
    color: ${(props) => (props.complete ? '#dfdfef' : '#fff')};
    text-decoration: none !important;
  }

  svg {
    opacity: ${(props) => (props.isNext ? 1 : 0.8)};
  }
`;

type Props = {
  title: string;
  type: 'read' | 'video' | 'essay' | 'bonus';
  complete?: boolean;
  isNext?: boolean;
  idx: number;
  movement: number;
};

const Item = ({ title, type, complete = false, isNext = false, idx, movement }: Props) => {
  const Icon = icons[type];

  return (
    <Link to={`/read/movement/${movement}/${idx}`} style={{ textDecoration: 'none' }}>
      <ItemStyled complete={complete} isNext={isNext}>
        {complete ? <CheckCircle size={24} color="#47FFE7" /> : <Icon size={24} />}
        <p>{title}</p>
        <CaretRight size={24} weight={isNext ? 'bold' : 'regular'} />
      </ItemStyled>
    </Link>
  );
};

export default Item;
