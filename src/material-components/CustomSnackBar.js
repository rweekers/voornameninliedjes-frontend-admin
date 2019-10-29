import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  snackbar: {
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
    minWidth: 900,
  },
  success: {
    backgroundColor: green[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

export default function CustomSnackBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.open}
        onClose={props.handleClose}
        onClick={props.handleClose}
        autoHideDuration={3000}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{
          classes: {
            root: `${clsx(classes[props.variant], props.className)} ${classes.snackbar}`
          }
        }}
        message={
          <span id="success-snackbar">
            {props.messageText}
          </span>
        }
      />
    </div>
  );
}