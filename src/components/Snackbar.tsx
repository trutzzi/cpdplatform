import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import React, { FC, useEffect } from 'react';

type SnackBarProps = {
    message: string;
}

const SnackbarComponent: FC<SnackBarProps> = ({ message }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(true);
    }, [message])

    const handleClose: any = (event: any, reason: any) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={action}
        />
    );
}

export default SnackbarComponent;