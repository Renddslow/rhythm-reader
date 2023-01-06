import React from 'react';
import styled from 'styled-components';

export const ContentWrapper = styled.div`
  font-size: 18px;
  line-height: 1.5;
  margin-top: 32px;

  p {
    margin-top: 14px;
  }

  img {
    display: block;
    width: calc(100% + 24px);
    margin: 24px -24px;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  a.has-sup {
    text-decoration: none;
  }

  sup {
    font-size: 14px;
    font-weight: 400;
    color: #000;
    background: #ccc;
    border-radius: 4px;
    padding: 2px 6px;
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }

  hr {
    width: 45%;
    margin: 0 auto;
    display: block;
    margin-top: 24px;
    margin-bottom: 24px;
    appearance: none;
    border: 1px solid #d3d1d2;
  }
`;

const Title = styled.h1`
  margin-top: 32px;
`;

const Markdown = ({ data, titleSize = 'h1' }) => (
  <>
    {/* @ts-ignore */}
    {data.title && <Title as={titleSize}>{data.title}</Title>}
    <ContentWrapper dangerouslySetInnerHTML={{ __html: data.content }} />
  </>
);

export default Markdown;
