import React from 'react';
import styled, { keyframes } from 'styled-components';

import Scripture from './Scripture';
import Markdown from './Markdown';
import withData from './withData';
import AppFooter from '../Footer';
import Video from './Video';

const Wrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px 24px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  
  to {
    opacity: 1;
  }
`;

export const FadeInWrapper = styled.div`
  width: 100%;
  display: block;
  opacity: 0;
  animation-name: ${fadeIn};
  animation-duration: 1.2s;
  animation-fill-mode: forwards;
  animation-delay: 0.3s;
`;

const Item = ({ loading, data }) => {
  return (
    <Wrapper>
      {!loading && (
        <FadeInWrapper>
          {data.type === 'markdown' && <Markdown data={data} />}
          {data.type === 'scripture' && <Scripture data={data} />}
          {data.type === 'video' && <Video data={data} />}
          <AppFooter />
        </FadeInWrapper>
      )}
    </Wrapper>
  );
};

export default withData(Item);
