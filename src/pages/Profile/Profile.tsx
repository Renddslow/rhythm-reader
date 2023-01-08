import React from 'react';
import { Info } from 'phosphor-react';
import styled from 'styled-components';

import { useAuthenticatedUser, useProgress } from '../../providers/Authentication';
import { FadeInWrapper } from '../Items';
import { Header } from '../ReadHeader';
import Home from '../Home';
import withData from '../Items/withData';
import Empty from './Empty';
import ProgressCard from './ProgressCard';

const GridHeader = styled.div`
  margin-top: 32px;
`;

const Wrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px 24px;
`;

const Information = styled.p`
  position: relative;
  margin: 12px 0 24px;

  svg {
    position: relative;
    margin-right: 4px;
    bottom: -3px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 8px;
`;

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

const isComplete = (completions, movement: number, page: number) =>
  completions.find((p) => p.movement === movement && p.page === page);

const getChapter = (ch: string) => {
  const [, chapter] = /([\d]+)$/.exec(ch);
  return parseInt(chapter, 10);
};

const Profile = ({ loading, data }) => {
  const { completions, links } = useProgress();
  const { user } = useAuthenticatedUser();

  const filteredCompletions = !loading
    ? [{ title: 'Introduction', movement: 0, item: 0 }, ...data.plan].filter((item) =>
        isComplete(completions, item.movement, item.item),
      )
    : [];

  return (
    <>
      <Header>
        <Home />
      </Header>
      <Wrapper>
        {!loading && (
          <FadeInWrapper>
            <h2 style={{ marginBottom: 12 }}>Shalom, {user.firstName}!</h2>
            <p>
              This is your profile. Every page you've read and link you've collected is tracked
              below.
            </p>
            <GridHeader>
              <h2>Links</h2>
              <Information>
                <Info weight="bold" />
                These are all the links you've collected from the readings so far. There are{' '}
                <strong>{Object.keys(data.hyperlinks).length}</strong> collectable links unlocked.
                If you missed one, head back into the readings and look for the missing link so you
                can experience the Bible as unified, meditation literature.
              </Information>
            </GridHeader>
            {!links.length ? (
              <Empty label="You haven't collected any links yet." />
            ) : (
              <Grid>
                {links
                  .reduce((acc, link) => {
                    if (acc.find((l) => l.link === link.link)) return acc;
                    acc.push(link);
                    return acc;
                  }, [])
                  .map((link) => (
                    <ProgressCard
                      key={link.link}
                      movement={link.movement}
                      page={link.page}
                      title={data.hyperlinks[link.link].title}
                      done={link.collected_at}
                      type="link"
                    />
                  ))}
              </Grid>
            )}
            <GridHeader>
              <h2>Pages</h2>
              <Information>
                <Info weight="bold" />
                All of the pages you've completed are kept here. Don't be afraid to revisit a
                Scripture reading in order to{' '}
                <a
                  href="https://www.youtube.com/watch?v=VhmlJBUIoLk"
                  target="_blank"
                  rel="noreferrer"
                >
                  meditate
                </a>{' '}
                on it.
              </Information>
            </GridHeader>

            {!filteredCompletions.length ? (
              <Empty label="You haven't read any pages yet." />
            ) : (
              <Grid>
                {filteredCompletions.map((asset) => (
                  <ProgressCard
                    key={`${asset.movement}-${asset.item}`}
                    type="progress"
                    movement={asset.movement}
                    page={asset.page}
                    title={
                      asset.title ||
                      `Revelation ${getChapter(asset.start.chapter)}:${
                        asset.start.verse
                      }-${getChapter(asset.end.chapter)}:${asset.end.verse}`
                    }
                    done={isComplete(completions, asset.movement, asset.item).read_at}
                  />
                ))}
              </Grid>
            )}
          </FadeInWrapper>
        )}
      </Wrapper>
    </>
  );
};

export default withData(Profile, true);
