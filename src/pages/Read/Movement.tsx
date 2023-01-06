import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CaretDown, Lock } from 'phosphor-react';

type Props = {
  illustration?: string; // TODO: remove optional before flight
  first?: boolean;
  subtitle: string;
  title: string;
  children: React.ReactElement[];
  locked?: boolean;
  unlocks: Date;
};

const resize = keyframes`
  from {
    overflow-y: hidden;
  }
  
  to {
    overflow-y: auto;
  }
`;

const MovementContainer = styled.div<{ open: boolean }>`
  width: 100%;
  font-family: var(--sans-serif);
  font-size: var(--fz-body);
  position: relative;
  z-index: 300;
  transition: max-height 0.5s ease-out;
  max-height: ${(props) => (props.open ? '1000px' : '108px')};
  animation-duration: 0.5s;
  animation-name: ${(props) => (props.open ? resize : '')};
  cursor: pointer;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 4px;
    left: calc(24px + 30px - 2px);
    top: calc(24px + 60px);
    bottom: -24px;
    display: block;
    background: hsl(240deg, 14%, 85%);
    z-index: 1;
  }

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    width: calc(100% - (60px + 24px + 24px + 12px));
    right: 24px;
    background: hsl(240deg, 14%, 88%);
    bottom: 0;
    height: ${(props) => (props.open ? 0 : '1px')};
    display: block;
  }
`;

const Wrapper = styled.div<{ first: boolean }>`
  padding: 24px;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(0, 1fr) minmax(0, max-content);
  grid-gap: 12px;
  align-items: center;

  &::before {
    content: ${(props) => !props.first && '""'};
    top: 0;
    height: 24px;
    width: 4px;
    left: calc(24px + 30px - 2px);
    display: block;
    background: hsl(240deg, 14%, 85%);
    position: absolute;
  }
`;

const Illustration = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  position: relative;
`;

const Title = styled.p`
  font-weight: 600;
  margin-bottom: 6px;
`;

const Reference = styled.p`
  font-size: 16px;
`;

const Rotator = styled.div<{ up: boolean }>`
  transition: 0.3s ease-out;
  transform-origin: center;
  height: max-content;
  line-height: 0;
  ${(props) => props.up && 'transform: rotate(180deg);'}
`;

const Panel = styled.div`
  padding: 0 24px;
  width: 100%;
  display: block;
  transform-origin: top;
  background: hsl(var(--purple-hue), 12%, 20%);
`;

const UnlockTag = styled.span`
  font-size: 14px;
  font-weight: 600;
  background: #efefef;
  color: #666;
  border-radius: 4px;
  padding: 4px;
  width: max-content;
`;

const fmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const Movement = ({
  illustration,
  subtitle,
  title,
  children,
  first = false,
  locked = false,
  unlocks,
}: Props) => {
  const [open, setOpen] = useState(false);

  const props = locked
    ? { tabIndex: -1 }
    : {
        role: 'button',
        'aria-label':
          'Click/tap to expand the movement to see activities and readings associated with this movement',
        onClick: () => setOpen((s) => !s),
        tabIndex: 0,
      };

  return (
    <MovementContainer open={open}>
      <Wrapper {...props} first={first}>
        <Illustration
          src={illustration || '/dragon.png'}
          alt={`Movement illustration of ${title}`}
        />
        <div>
          <Title>{title}</Title>
          <Reference>
            {locked ? <UnlockTag>Unlocks {fmt.format(unlocks)}</UnlockTag> : subtitle}
          </Reference>
        </div>
        <Rotator up={open}>{locked ? <Lock size={24} /> : <CaretDown size={24} />}</Rotator>
      </Wrapper>
      {open && <Panel>{children}</Panel>}
    </MovementContainer>
  );
};

export default Movement;
