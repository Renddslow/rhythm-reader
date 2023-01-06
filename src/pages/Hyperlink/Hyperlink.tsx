import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { X } from 'phosphor-react';

import { ButtonWrapper } from '../Read/ProfileButton';
import Markdown from '../Items/Markdown';
import { ParagraphBlock } from '../Items/Scripture/Paragraph';
import { PoetryBlock } from '../Items/Scripture/Poetry';
import Scripture from '../Items/Scripture';
import { LinkButton } from '../Footer';
import { useProgress } from '../../providers/Authentication';

const slideUp = keyframes`
  from {
    bottom: -90vh;
  }
  
  to {
    bottom: 0;
  }
`;

const HyperlinkWrapper = styled.article`
  --shadow-color: 0deg 0% 63%;
  height: 90vh;
  box-shadow: 0 -0.6px 0.8px hsl(var(--shadow-color) / 0.05),
    0 -3.3px 4.7px -0.1px hsl(var(--shadow-color) / 0.08),
    0 -5.7px 8px -0.1px hsl(var(--shadow-color) / 0.11),
    0 -8.2px 11.6px -0.2px hsl(var(--shadow-color) / 0.14),
    0 -11.3px 15.9px -0.3px hsl(var(--shadow-color) / 0.17),
    0 -15.3px 21.6px -0.4px hsl(var(--shadow-color) / 0.21),
    0 -20.7px 29.2px -0.4px hsl(var(--shadow-color) / 0.24),
    0 -27.9px 39.3px -0.5px hsl(var(--shadow-color) / 0.27),
    0 -37.4px 52.7px -0.6px hsl(var(--shadow-color) / 0.3);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  position: fixed;
  left: 4px;
  width: calc(100% - 8px);
  background: #fff;
  z-index: 1000;
  padding: 24px;
  animation-delay: 0.4s;
  animation-duration: 0.3s;
  animation-name: ${slideUp};
  animation-fill-mode: forwards;

  & > a {
    margin-left: auto;
    width: max-content;
  }
`;

const Wrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  overflow: scroll;
  height: 100%;
  padding: 0 4px 56px;

  h2 {
    margin-top: 24px;
  }

  ${LinkButton} {
    width: max-content;
    margin: 48px auto 0;
  }
`;

type HyperlinkReading = {
  ref: string;
  title: string;
  content: (ParagraphBlock | PoetryBlock)[];
};

type HyperlinkType = {
  title: string;
  description: string;
  readings: HyperlinkReading[];
};

const Hyperlink = () => {
  const params = useParams();
  const [data, setData] = useState<HyperlinkType>({} as HyperlinkType);
  const [loading, setLoading] = useState(true);
  const { links, collectLink } = useProgress();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/assets/hyperlink.${params.hyperlink}.json`)
      .then((d) => d.json())
      .then((d) => setData(d))
      .then(() => setLoading(false));
  }, [params]);

  const handleCollectLink = () => {
    if (!links.find(({ link }) => link === params.hyperlink)) {
      collectLink(params.hyperlink, parseInt(params.movement, 10), parseInt(params.item, 10));
    }
  };

  return (
    <HyperlinkWrapper>
      <ButtonWrapper to={`/read/movement/${params.movement}/${params.item}#${params.hyperlink}`}>
        <span>Close</span> <X />
      </ButtonWrapper>
      <Wrapper>
        {!loading && (
          <>
            <Markdown
              data={{
                title: data.title,
                content: data.description,
              }}
            />
            <div>
              {data.readings &&
                data.readings.map((reading) => (
                  <div key={reading.ref}>
                    <h2>{reading.title}</h2>
                    <Scripture data={{ content: reading.content }} includeTitle={false} />
                  </div>
                ))}
            </div>
          </>
        )}
        {!links.find(({ link }) => link === params.hyperlink) ? (
          <LinkButton
            to={`/read/movement/${params.movement}/${params.item}#${params.hyperlink}`}
            onClick={handleCollectLink}
          >
            Collect Link
          </LinkButton>
        ) : (
          <LinkButton to={`/read/movement/${params.movement}/${params.item}#${params.hyperlink}`}>
            Return to the Reading
          </LinkButton>
        )}
      </Wrapper>
    </HyperlinkWrapper>
  );
};

export default Hyperlink;
