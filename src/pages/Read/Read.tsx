import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import isBefore from 'date-fns/isBefore';

import { useAuthenticatedUser, useProgress } from '../../providers/Authentication';
import Movement from './Movement';
import Item from './Item';
import Text from '../../components/Text';
import CompletionTag from '../../components/CompletionTag';
import { getReference } from '../Items/Scripture/Scripture';
import Progress from '../Progress';

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
  const [assets, setAssets] = useState([]);
  const { completions } = useProgress();

  const introComplete = isComplete(completions, 0, 0);

  const today = new Date();

  useEffect(() => {
    fetch('/assets/asset-plan.json')
      .then((r) => r.json())
      .then((r) => setAssets(r));
  }, []);

  const getItems = (movement) => (item, idx) => {
    return (
      <Item
        key={`${movement}-${idx}`}
        idx={idx}
        movement={movement}
        complete={isComplete(completions, movement, idx)}
        type={item.type}
        title={
          item.type === 'scripture'
            ? `${item.book} ${getReference(item.start)}-${getReference(item.end)}`
            : item.title
        }
      />
    );
  };

  return (
    <Wrapper>
      <Header>
        <h1>Rhythm Reader</h1>
        <Progress />
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
        {assets.length && (
          <div className="movements">
            <Movement
              illustration="/sacred_rhythms.png"
              title="Sacred Rhythms"
              subtitle="In the beginning"
              first
              unlocks={new Date(2023, 0, 8)}
            >
              {assets.filter((a) => a.movement === 1).map(getItems(1))}
            </Movement>
            <Movement
              illustration="/seasonal.png"
              title="Seasonal Rhythms"
              subtitle="I will sing to YHWH"
              locked={isBefore(today, new Date(2023, 0, 15))}
              unlocks={new Date(2023, 0, 15)}
            >
              {assets.filter((a) => a.movement === 2).map(getItems(2))}
            </Movement>
            <Movement
              illustration="/sabbath.png"
              title="Weekly Rhythms"
              subtitle="Remember the Sabbath"
              locked={isBefore(today, new Date(2023, 0, 22))}
              unlocks={new Date(2023, 0, 22)}
            >
              {assets.filter((a) => a.movement === 3).map(getItems(3))}
            </Movement>
            <Movement
              illustration="/daily.png"
              title="Daily Rhythms"
              subtitle="Seven times a day I praise you"
              locked={isBefore(today, new Date(2023, 0, 29))}
              unlocks={new Date(2023, 0, 29)}
            >
              {assets.filter((a) => a.movement === 4).map(getItems(4))}
            </Movement>
            <Movement
              illustration="/jubilee.png"
              title="Intermittent Rhythms"
              subtitle="The Spirit of YHWH is upon me"
              locked={isBefore(today, new Date(2023, 1, 5))}
              unlocks={new Date(2023, 1, 5)}
            >
              {assets.filter((a) => a.movement === 5).map(getItems(5))}
            </Movement>
            <Movement
              illustration="/exiles.png"
              title="Maintaining Rhythms"
              subtitle="Be Awake, Be Sober"
              locked={isBefore(today, new Date(2023, 1, 12))}
              unlocks={new Date(2023, 1, 12)}
            >
              {assets.filter((a) => a.movement === 6).map(getItems(6))}
            </Movement>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Read;
