import { Text as TamaguiText, type TextProps } from 'tamagui';

export { TextProps };

export function Text(props: TextProps) {
  return <TamaguiText {...props} />;
}
