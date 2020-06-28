import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  dialog: {
  },
  dialogContent: {
    backgroundColor: "#424242",
  },
  dialogContentText: {
    color: 'white',
    fontSize: 16,
  },
  dialogTitle: {
    color: 'white',
    backgroundColor: "#424242",
  },
  dialogActions: {
    color: "lightgrey",
    backgroundColor: "#424242",
  },
  inputLabel: {
    color: 'lightgrey !important',
    borderWidth: '1px',
    fontSize: 18,
  },
  input: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    margin: 10,
  },
  iconButton: {
    color: 'white',
  }
}));

export default function SourceFormDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(props.open);
  const [urlError, setUrlError] = useState('');
  const [sourceName, setSourceName] = useState(props.source.name);
  const [sourceUrl, setSourceUrl] = useState(props.source.url);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const isEmpty = (str) => {
    return (!str || 0 === str.length);
  }

  const validURL = (str) => {
    let url;

    try {
      url = new URL(str);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

  const handleCancel = () => {
    setSourceName(props.source.name);
    setSourceUrl(props.source.url);
    props.onSourceCancel();
    setOpen(false);
  };

  const handleSave = () => {
    if (!validURL(sourceUrl)) {
      setUrlError('Vul een geldige URL in.');
      return;
    }

    const source = {
      url: sourceUrl,
      name: sourceName
    };

    props.onSourceUpdate(source, props.index);
    setOpen(false);
  };

  const handleUrlChange = (e) => {
    setUrlError('');
    setSourceUrl(e.target.value);
  }

  const handleNameChange = (e) => {
    setSourceName(e.target.value);
  }

  return (
    <span>
      <Tooltip title="Wijzigen">
        <IconButton color="primary" className={classes.iconButton} onClick={handleClickOpen} >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleCancel} BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' } }} aria-labelledby="form-dialog-title" className={classes.dialog}>
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Bron bewerken</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText className={classes.dialogContentText}>
            Om een bron aan te passen kun je de url van de bron en de naam van de bron toevoegen. Wil je dat de url ook getoond wordt, vul deze dan ook bij de naam in.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="url"
            label="URL bron"
            error={!isEmpty(urlError)}
            helperText={urlError}
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              classes: {
                input: classes.input,
                underline: classes.underline,
              }
            }}
            fullWidth
            value={sourceUrl}
            onChange={handleUrlChange}
          />
          <TextField
            required
            margin="dense"
            id="name"
            label="Naam bron"
            InputLabelProps={{
              className: classes.inputLabel
            }}
            InputProps={{
              classes: {
                input: classes.input,
                underline: classes.underline,
              }
            }}
            fullWidth
            value={sourceName}
            onChange={handleNameChange}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={handleCancel} variant="contained" color="primary" className={classes.button}>
            Annuleren
          </Button>
          <Button onClick={handleSave} disabled={!isEmpty(urlError) || sourceName === '' || sourceUrl === ''} variant="contained" color="primary" className={classes.button}>
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
