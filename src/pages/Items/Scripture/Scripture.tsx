import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { ContentWrapper } from '../Markdown/Markdown';
import Poetry from './Poetry';
import hash from '../../../utils/hash';
import Paragraph from './Paragraph';

type ChapterRef = `rev${number}`;
type Ref = {
  chapter: ChapterRef;
  verse: number;
};

const getChapter = (ref: ChapterRef) => {
  const [, ch] = /(\d+)$/.exec(ref);
  return ch;
};

const getReference = (ref: Ref) => {
  return `${getChapter(ref.chapter)}:${ref.verse}`;
};

const Scripture = ({ data, includeTitle = true }) => {
  const location = useLocation();
  const title = includeTitle
    ? `Revelation ${getReference(data.start)}-${getReference(data.end)}`
    : '';

  useEffect(() => {
    let cancel;
    if (location.hash) {
      cancel = setTimeout(() => {
        document.getElementById(location.hash.replace('#', '')).scrollIntoView({
          block: 'center',
        });
      }, 400);
    }

    return () => clearTimeout(cancel);
  }, [location.hash]);

  return (
    <>
      {title && <h1>{title}</h1>}
      <ContentWrapper>
        {data.content.map((block) =>
          block.type === 'poetry' ? (
            <Poetry key={hash(JSON.stringify(block))} content={block} />
          ) : (
            <Paragraph key={hash(JSON.stringify(block))} content={block} />
          ),
        )}
        <Outlet />
      </ContentWrapper>
    </>
  );
};

export default Scripture;
