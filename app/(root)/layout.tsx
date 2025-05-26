import React, { ReactNode } from 'react'

export  const RootLayout = ({children} : {children : ReactNode}) => {
  return (
    <div>{children}</div>
  )
};

export default RootLayout;