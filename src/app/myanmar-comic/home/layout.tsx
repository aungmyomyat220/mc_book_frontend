import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Myanmar Comic',
  description: 'Myanmar Comic',
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
    </>
  );
}
