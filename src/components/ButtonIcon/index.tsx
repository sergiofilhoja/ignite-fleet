import { IconProps } from "phosphor-react-native";
import React from "react";
import { TouchableOpacityProps } from "react-native";
import { useTheme } from "styled-components/native";

// Styles
import { Container } from "./styles";

export type IconBoxProps = (props: IconProps) => JSX.Element;
type Props = TouchableOpacityProps & {
  icon: IconBoxProps;
};

export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container activityOpacity={0.7} {...rest}>
      <Icon size={24} color={COLORS.BRAND_MID} />
    </Container>
  );
}
