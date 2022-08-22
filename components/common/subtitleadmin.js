import React,{ useState } from 'react'
import OpenDialog from '../parts/opendialog';
import { Icon } from '@iconify/react';
import { Stepper, Step, StepLabel, StepContent, Paper, Box, Button, Typography } from '@mui/material';

const steps = [
    {
        label: 'Select campaign settings',
        description: `For each ad campaign that you create, you can control how much
                you're willing to spend on clicks and conversions, which networks
                and geographical locations you want your ads to show on, and more.`,
    },
    {
        label: 'Create an ad group',
        description:
        'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
        label: 'Create an ad',
        description: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
    },
];

export default function subtitleadmin({subtitle}) {
    const [isOpen, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const handleClickOpen = () =>{
        setOpen(true);
    }
    const handleClickClose = () => {
        setOpen(false);
    }

    // stepper
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setActiveStep(0);
    }
    // end stepper
    return (
        <div className="flex flex-row items-center justify-between w-full h-auto border-b-2 border-slate-300 border-dashed md:px-0 px-4 z-30">
            <p className="text-3xl capitalize py-2 font-semibold text-black">{subtitle}</p>
            

            {/* TODO: custom stepper */}
            
            
        </div>
    )
}
