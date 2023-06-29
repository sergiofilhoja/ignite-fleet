import styled from "styled-components/native";
import theme from "../../theme";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoadIndicator = styled.ActivityIndicator.attrs(() => ({
  color: theme.COLORS.BRAND_LIGHT,
}))``;
