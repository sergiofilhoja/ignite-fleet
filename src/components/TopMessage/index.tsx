import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Styles
import { useTheme } from "styled-components/native";
import { Container, Title } from "./styles";

// Components
import { IconBoxProps } from "@components/ButtonIcon";

type Props = {
  icon?: IconBoxProps;
  title: string;
};

export function TopMessage({ title, icon: Icon }: Props) {
  const { COLORS } = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 5;

  return (
    <Container style={{ paddingTop }}>
      {Icon && <Icon size={18} color={COLORS.GRAY_100} />}
      <Title>{title}</Title>
    </Container>
  );
}
