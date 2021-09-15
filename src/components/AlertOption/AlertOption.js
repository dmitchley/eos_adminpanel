import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
    const { isOpen, alertTitle, alertDescription, okLabel, closeLabel } = props;
    const handleClickOpen = () => {
        // setOpen(true);
        props.handleClickOpen();
    };

    const handleClose = () => {
        // setOpen(false);
        props.handleClose()
    };

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{alertTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {alertDescription}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {closeLabel}
                    </Button>
                    <Button onClick={handleClickOpen} color="primary" autoFocus>
                        {okLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}