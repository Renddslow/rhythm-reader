import React, { createRef, useEffect, useState } from 'react';
import { Triangle } from 'phosphor-react';

import ProgressWrapper from './styles/ProgressWrapper';
import ProgressContainer from './styles/ProgressContainer';
import ProgressTooltip from './styles/ProgressTooltip';
import { useProgress } from '../providers/Authentication';

const Progress = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = createRef();
  const { links: rawLinks } = useProgress();

  const links = rawLinks.reduce((acc, link) => {
    if (acc.find((l) => l.link === link.link)) return acc;
    acc.push(link);
    return acc;
  }, []);

  useEffect(() => {
    let cancel;
    if (showTooltip) {
      cancel = setTimeout(() => setShowTooltip(false), 5000);
    }

    return () => clearTimeout(cancel);
  }, [showTooltip]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      // @ts-ignore
      if (ref.current && !ref.current?.contains(e.target)) {
        setShowTooltip(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [ref]);

  return (
    <ProgressContainer>
      <ProgressWrapper
        // @ts-ignore
        ref={ref}
        role="button"
        aria-label="Tap to display current links collected count"
        onClick={() => setShowTooltip(true)}
      >
        <Triangle weight="bold" size="16" />
        <span>{links.length}/66</span>
      </ProgressWrapper>
      {showTooltip && (
        <ProgressTooltip>
          You have collected {links.length} links.
        </ProgressTooltip>
      )}
    </ProgressContainer>
  );
};

export default Progress;
