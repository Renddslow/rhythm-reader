import { Link, useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import { CaretLeft } from 'phosphor-react';

import { useProgress } from '../providers/Authentication';

const Footer = styled.footer`
  padding: 24px 0;
`;

const Copyright = styled.p`
  font-size: 14px;
  font-family: var(--sans-serif);
  margin-top: 16px;
`;

export const LinkButton = styled(Link)`
  font-size: 14px;
  padding: 12px 16px;
  font-weight: 600;
  font-family: var(--sans-serif);
  text-decoration: none;
  background: var(--purple);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 0;
  appearance: none;
  cursor: pointer;

  &:first-child {
    opacity: 0.8;
    background: var(--light-purple);
    padding: 12px 12px;
    color: #111;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  grid-gap: 4px;
`;

const MOVEMENT_MAX = {
  1: 4,
  2: 6,
  3: 3,
  4: 4,
};

const isComplete = (completions, page) => {
  const record = completions.find((c) => c.movement === page.movement && c.page === page.page);
  return !!record;
};

const AppFooter = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { completions, completePage } = useProgress();

  const handlePageCompletion = async () => {
    const payload = window.location.pathname.includes('intro')
      ? {
          movement: 0,
          page: 0,
        }
      : {
          movement: parseInt(params.week, 10),
          page: parseInt(params.item, 10),
        };

    if (!isComplete(completions, payload)) {
      return completePage(payload.movement, payload.page);
    }

    return Promise.resolve();
  };

  const completeAndRoute = () => {
    handlePageCompletion().then(() => {
      navigate('/read');
    });
  };

  return (
    <Footer>
      {!window.location.pathname.includes('intro') ? (
        <Row>
          {parseInt(params.item) !== 0 ? (
            <LinkButton to={`/read/week/${params.week}/${parseInt(params.item) - 1}`}>
              <CaretLeft weight="bold" size={18} />
            </LinkButton>
          ) : (
            <div />
          )}
          {/* TODO: Mark complete if not already completed otherwise, next page */}
          {MOVEMENT_MAX[parseInt(params.week)] !== parseInt(params.item) ? (
            <LinkButton
              to={`/read/week/${params.week}/${parseInt(params.item) + 1}`}
              onClick={handlePageCompletion}
            >
              Next Page
            </LinkButton>
          ) : (
            <LinkButton as="button" onClick={completeAndRoute}>
              Complete {parseInt(params.week) < 4 ? `Week ${params.week}` : `the Last Week`}
            </LinkButton>
          )}
        </Row>
      ) : (
        <Row>
          <div />
          <LinkButton as="button" onClick={completeAndRoute}>
            {(
              window.location.pathname.includes('intro')
                ? isComplete(completions, {
                    movement: 0,
                    page: 0,
                  })
                : isComplete(completions, {
                    movement: parseInt(params.week, 10),
                    page: parseInt(params.item, 10),
                  })
            )
              ? 'Return Home'
              : 'Mark as Read'}
          </LinkButton>
        </Row>
      )}
      <Copyright>
        Scripture quotations taken from the (NASB®) New American Standard Bible®, Copyright © 1960,
        1971, 1977, 1995, 2020 by The Lockman Foundation. Used by permission. All rights reserved.{' '}
        <a href="https://www.lockman.org" target="_blank" rel="noreferrer">
          www.lockman.org
        </a>
      </Copyright>
    </Footer>
  );
};

export default AppFooter;
