import React from "react";
import { TouchableOpacityProps } from "react-native";

// style
import { Container, Title } from "./styles";

// Components
import { Loading } from "@components/Loading";

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <Container activeOpacity={0.7} disabled={isLoading} {...rest}>
      {isLoading ? <Loading /> : <Title>{title}</Title>}
    </Container>
  );
}
