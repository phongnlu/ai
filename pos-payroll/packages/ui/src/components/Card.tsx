import { YStack, type YStackProps } from 'tamagui';

export interface CardProps extends YStackProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      {...props}
    >
      {children}
    </YStack>
  );
}
