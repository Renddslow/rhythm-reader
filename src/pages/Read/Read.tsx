import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isBefore from 'date-fns/isBefore';

import { useAuthenticatedUser, useProgress } from '../../providers/Authentication';
import Movement from './Movement';
import Item from './Item';
import Text from '../../components/Text';
import ProfileButton from './ProfileButton';
import CompletionTag from '../../components/CompletionTag';

const Wrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
`;

const IntroCard = styled.div`
  width: 100%;
  padding: 24px;
  background: #124032;
  color: #fff;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  display: grid;
  grid-gap: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    bottom: -24px;
    right: -24px;
  }

  a {
    font-size: 16px;
    display: block;
    width: fit-content;
    padding: 4px 8px;
    border-radius: 4px;
    background: #fff;
    color: #001b2e;
    font-family: var(--sans-serif);
    text-decoration: none;
    font-weight: 500;
    margin-top: 12px;
  }
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;

  h1 {
    font-size: 18px;
    font-weight: 900;
  }
`;

const isComplete = (completions, movement: number, page: number) =>
  completions.find((p) => p.movement === movement && p.page === page);

const Read = () => {
  const { user } = useAuthenticatedUser();
  const { completions } = useProgress();

  const introComplete = isComplete(completions, 0, 0);

  const today = new Date();

  return (
    <Wrapper>
      <Header>
        <h1>Rhythm Reader</h1>
        <ProfileButton />
      </Header>
      <div>
        <IntroCard>
          <div>
            <Text>Experience the rhythm of the cosmos in a whole new way.</Text>
            <Link to="/read/week/intro">See How it Works</Link>
            {introComplete && <CompletionTag completedAt={introComplete.read_at} />}
          </div>
          <img src="https://dma9sdczpu5q0.cloudfront.net/media/explore-v2/Themes/(No%20Series)/Sabbath/sabbath_standard.png?q=65&fit=max&w=600" />
        </IntroCard>
        <div className="movements">
          <Movement
            illustration="/sacred_rhythms.png"
            title="Sacred Rhythms"
            subtitle="In the beginning"
            first
            unlocks={new Date(2023, 0, 8)}
          >
            <Item
              title="The Throne Room of Heaven"
              type="essay"
              idx={0}
              movement={1}
              complete={isComplete(completions, 1, 0)}
            />
            <Item
              title="Apocalyptic Literature"
              type="video"
              idx={1}
              movement={1}
              complete={isComplete(completions, 1, 1)}
            />
            <Item
              title="Revelation Overview, pt 1"
              type="video"
              idx={2}
              movement={1}
              complete={isComplete(completions, 1, 2)}
            />
            <Item
              title="1:1-1:8"
              type="read"
              idx={3}
              movement={1}
              complete={isComplete(completions, 1, 3)}
            />
            <Item
              title="1:9-3:22"
              type="read"
              idx={4}
              movement={1}
              complete={isComplete(completions, 1, 4)}
            />
          </Movement>
          <Movement
            illustration="/seasonal.png"
            title="Seasonal Rhythms"
            subtitle="I will sing to YHWH"
            locked={isBefore(today, new Date(2023, 0, 15))}
            unlocks={new Date(2023, 0, 15)}
          >
            <Item
              title="The Judgement of Evil"
              type="essay"
              movement={2}
              idx={0}
              complete={isComplete(completions, 2, 0)}
            />
            <Item
              title="4:1-5:14"
              type="read"
              movement={2}
              idx={1}
              complete={isComplete(completions, 2, 1)}
            />
            <Item
              title="6:1-8:13"
              type="read"
              movement={2}
              idx={2}
              complete={isComplete(completions, 2, 2)}
            />
            <Item
              title="9:1-11:19"
              type="read"
              movement={2}
              idx={3}
              complete={isComplete(completions, 2, 3)}
            />
            <Item
              title="Revelation Overview, pt 2"
              type="video"
              movement={2}
              idx={4}
              complete={isComplete(completions, 2, 4)}
            />
            <Item
              title="12:1-14:20"
              type="read"
              movement={2}
              idx={5}
              complete={isComplete(completions, 2, 5)}
            />
            <Item
              title="15:1-16:21"
              type="read"
              movement={2}
              idx={6}
              complete={isComplete(completions, 2, 6)}
            />
          </Movement>
          <Movement
            illustration="/sabbath.png"
            title="Weekly Rhythms"
            subtitle="Remember the Sabbath"
            locked={isBefore(today, new Date(2023, 0, 22))}
            unlocks={new Date(2023, 0, 22)}
          >
            <Item
              title="The Day of the Lord"
              type="essay"
              movement={3}
              idx={0}
              complete={isComplete(completions, 3, 0)}
            />
            <Item
              title="Day of the Lord (video)"
              type="video"
              movement={3}
              idx={1}
              complete={isComplete(completions, 3, 1)}
            />
            <Item
              title="17:1-19:10"
              type="read"
              movement={3}
              idx={2}
              complete={isComplete(completions, 3, 2)}
            />
            <Item
              title="19:11-21:8"
              type="read"
              movement={3}
              idx={3}
              complete={isComplete(completions, 3, 3)}
            />
          </Movement>
          <Movement
            illustration="/daily.png"
            title="Daily Rhythms"
            subtitle="Seven times a day I praise you"
            locked={isBefore(today, new Date(2023, 0, 29))}
            unlocks={new Date(2023, 0, 29)}
          >
            <Item
              title="The Resurrection"
              type="essay"
              movement={4}
              idx={0}
              complete={isComplete(completions, 4, 0)}
            />
            <Item
              title="21:9-22:9"
              type="read"
              movement={4}
              idx={1}
              complete={isComplete(completions, 4, 1)}
            />
            <Item
              title="Heaven and Earth"
              type="video"
              movement={4}
              idx={2}
              complete={isComplete(completions, 4, 2)}
            />
            <Item
              title="22:10-22:21"
              type="read"
              movement={4}
              idx={3}
              complete={isComplete(completions, 4, 3)}
            />
            <Item
              title="Eternal Life"
              type="video"
              movement={4}
              idx={4}
              complete={isComplete(completions, 4, 4)}
            />
          </Movement>
          <Movement
            illustration="/jubilee.png"
            title="Intermittent Rhythms"
            subtitle="The Spirit of YHWH is upon me"
            locked={isBefore(today, new Date(2023, 1, 5))}
            unlocks={new Date(2023, 1, 5)}
          >
            <Item
              title="The Resurrection"
              type="essay"
              movement={4}
              idx={0}
              complete={isComplete(completions, 4, 0)}
            />
            <Item
              title="21:9-22:9"
              type="read"
              movement={4}
              idx={1}
              complete={isComplete(completions, 4, 1)}
            />
            <Item
              title="Heaven and Earth"
              type="video"
              movement={4}
              idx={2}
              complete={isComplete(completions, 4, 2)}
            />
            <Item
              title="22:10-22:21"
              type="read"
              movement={4}
              idx={3}
              complete={isComplete(completions, 4, 3)}
            />
            <Item
              title="Eternal Life"
              type="video"
              movement={4}
              idx={4}
              complete={isComplete(completions, 4, 4)}
            />
          </Movement>
          <Movement
            illustration="/exiles.png"
            title="Maintaining Rhythms"
            subtitle="Be Awake, Be Sober"
            locked={isBefore(today, new Date(2023, 1, 12))}
            unlocks={new Date(2023, 1, 12)}
          >
            <Item
              title="The Resurrection"
              type="essay"
              movement={4}
              idx={0}
              complete={isComplete(completions, 4, 0)}
            />
            <Item
              title="21:9-22:9"
              type="read"
              movement={4}
              idx={1}
              complete={isComplete(completions, 4, 1)}
            />
            <Item
              title="Heaven and Earth"
              type="video"
              movement={4}
              idx={2}
              complete={isComplete(completions, 4, 2)}
            />
            <Item
              title="22:10-22:21"
              type="read"
              movement={4}
              idx={3}
              complete={isComplete(completions, 4, 3)}
            />
            <Item
              title="Eternal Life"
              type="video"
              movement={4}
              idx={4}
              complete={isComplete(completions, 4, 4)}
            />
          </Movement>
        </div>
      </div>
    </Wrapper>
  );
};

export default Read;
