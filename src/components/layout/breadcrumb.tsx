'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string;
  textColor?: string;
  activeTextColor?: string;
  separatorColor?: string;
  hoverColor?: string;
}

export default function Breadcrumb({
  items,
  className = '',
  separator = '/',
  textColor = 'text-gray-300',
  activeTextColor = 'text-white',
  separatorColor = 'text-gray-500',
  hoverColor = 'hover:text-white'
}: BreadcrumbProps) {
  const router = useRouter();

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.href && !item.isActive) {
      router.push(item.href);
    }
  };

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className={separatorColor}>{separator}</span>
          )}
          {item.isActive ? (
            <span className={`${activeTextColor} truncate`}>
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => handleItemClick(item)}
              className={`${textColor} ${hoverColor} transition-colors truncate`}
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 