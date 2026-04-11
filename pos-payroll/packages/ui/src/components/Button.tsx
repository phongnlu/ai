import { Button as TamaguiButton, type ButtonProps as TamaguiButtonProps } from 'tamagui';

export interface ButtonProps extends TamaguiButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  const themeMap = {
    primary: 'blue',
    secondary: 'gray',
    danger: 'red',
  } as const;

  return <TamaguiButton theme={themeMap[variant]} borderRadius="$3" {...props} />;
}
