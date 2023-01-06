import React, { createRef, useEffect, useState } from 'react';
import { BookmarkSimple } from 'phosphor-react';

import ProgressWrapper from './styles/ProgressWrapper';
import ProgressContainer from './styles/ProgressContainer';
import ProgressTooltip from './styles/ProgressTooltip';
import { useProgress } from '../providers/Authentication';

// TODO: Figure out content
const affirmation = (completions: number) => {
  if (completions < 11) {
    return 'Keep it up!';
  }

  if (completions === 11) {
    return `You're half-way there!`;
  }

  if (completions < 16) {
    return `You're really stickin' with it!`;
  }

  if (completions < 22) {
    return `You're almost there!`;
  }

  return 'You did it!';
};

const Progress = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = createRef();
  const { completions } = useProgress();

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
        aria-label="Tap to display current progress count"
        onClick={() => setShowTooltip(true)}
      >
        <BookmarkSimple weight="bold" size="16" />
        <span>{completions.length}/22</span>
      </ProgressWrapper>
      {showTooltip && (
        <ProgressTooltip>
          {completions.length > 0
            ? `You have read through ${
                completions.length
              } pages so far for the Rhythm reading challenge. ${affirmation(
                completions.length,
              )}`
            : `You haven't read through any pages yet, complete this page to get your first!`}
        </ProgressTooltip>
      )}
    </ProgressContainer>
  );
};

export default Progress;
