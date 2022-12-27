import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Title2(props) {
  return (
    <Typography component="h6" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title2.propTypes = {
  children: PropTypes.node,
};
