import { useNavigate } from 'react-router-dom';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const withRouter = (Component) => {
  function Wrapper(props) {
    const navigate = useNavigate();
    return <Component navigate={navigate} {...props} />;
  }
  return Wrapper;
};
