import React from 'react';
import styles from './button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

export function Button({ name, className, ...props }: Props) {
  return (
    <button className={`${styles.button} ${className || ''}`} {...props} type="button">
      {name}
    </button>
  );
}
