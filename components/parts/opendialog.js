import React from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const HeaderDialogTitle = (props) => {
    const {children, onClose,  ...other} = props;
    return (
        <DialogTitle sx={{m:0, p:2}} {...other}>
        {children}
        {onClose ? (
            <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            >
            <Icon icon="ci:close-big" width="24" height="24" />
            </IconButton>
        ): null}
        </DialogTitle>
    )
}

HeaderDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function opendialog({children, handleClose, isOpen, title, fullWidthStatus, maxValue}) {
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isOpen}
            fullWidth={fullWidthStatus}
            maxWidth={maxValue}
        >
        <HeaderDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {title}
        </HeaderDialogTitle>
        <DialogContent dividers>
            {children}
        </DialogContent>
        </BootstrapDialog>
    )
}
