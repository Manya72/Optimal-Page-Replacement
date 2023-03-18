import React from 'react';

function RefreshButton(props) {
  return (
    <button onClick={props.onClick}>
      Refresh
    </button>
  );
}

export default RefreshButton;
