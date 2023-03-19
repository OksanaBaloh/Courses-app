import React from 'react';

type Props = {
  hasLoader: boolean;
};

export const Loader: React.FC<Props> = ({ hasLoader }) => {
  return (
    <>
      {!hasLoader && (
        <div className="Loader">
          <div className="Loader__content" />
        </div>
      )}
    </>
  );
};
