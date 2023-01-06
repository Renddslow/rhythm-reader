import React from 'react';
import styled from 'styled-components';

import Markdown, { ContentWrapper } from './Items/Markdown/Markdown';
import { FadeInWrapper } from './Items';
import Video from './Items/Video';
import Footer from './Footer';

const Wrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px 24px;
`;

const Intro = () => {
  return (
    <Wrapper>
      <FadeInWrapper>
        <>
          <ContentWrapper>
            <p>Welcome to our reader.</p>
            <p>
              Throughout this sermon series we're exploring the theme of sacred rhythms which help
              us to experience God's rest and rejoice in his faithfulness.
            </p>
            <p>
              In this introduction we want to introduce to a few concepts that have informed the way
              this reader will work. You'll watch a few videos and read a little bit about how we
              put this together and what we hope for you to learn.
            </p>
            <p>
              Any time we explore a theme in the Bible, it can be easy to lose the thread that
              you've been following. We want to help you stay on track. This theme isn't overly
              complex, but you'll find it appear in some unusual, and often unexplored places.
            </p>
          </ContentWrapper>
          <Video
            data={{
              title: 'The Bible is Ancient Jewish Meditation Literature',
              src: 'https://www.youtube.com/embed/VhmlJBUIoLk',
              description:
                "The Bible isn't like a novel, a textbook, or a secret magical tome. It's literature designed for a lifetime of reading and study. Check out this video from BibleProject on just what it means for the Bible to be meditation literature.",
            }}
            titleSize="h2"
          />
          <Markdown
            data={{
              title: 'Progress',
              content: `<p>As you go you'll be rewarded with <strong>progress</strong> markers.</p><p>Progress markers indicate that you've read or otherwise engaged with one of the pages in the reader. Some pages have videos, some have a short explainer essay, and most have the words of Scripture (it is a Bible reader, after all). There are 37x pages in total, and you'll be able to track your progress in the header at the top of each page.</p><p>Remember, the goal isn't just to collect progress markers, but to actively read the Bible as a unified story that leads to Jesus in an unhurried and thoughtful way.</p><p>We hope that this will help you on the journey.</p>`,
            }}
            titleSize="h2"
          />
          <Footer />
        </>
      </FadeInWrapper>
    </Wrapper>
  );
};

export default Intro;
