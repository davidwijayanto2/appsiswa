import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react';
import { Tooltip } from '@mui/material';

export default function scrollwithButton(props) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.pageYOffset > props.height ? setShowButton(true) : setShowButton(false);
    })
  }, []);

  const scrolltoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <Tooltip title="Pergi ke Atas">
        <button
          onClick={scrolltoTop}
          className="inline-block py-2 px-2 border-1 border-secondary color-secondary font-medium text-xs leading-tight uppercase rounded-md shadow-md hover:bg-secondary hover:color-primary hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5 fixed opacity-60 hover:opacity-100 xl:opacity-100"
        >
          <Icon icon="codicon:arrow-small-up" width="30" height="30" />
        </button>
      </Tooltip>
    </>
  )
}
