import React, { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "styled-components/native";

// Styles
import { Container, Input, Label } from "./styles";

type Props = TextInputProps & {
  label: string;
};

const TextAreaInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme();

    return (
      <Container>
        <Label>{label}</Label>

        <Input
          ref={ref}
          placeholderTextColor={COLORS.GRAY_400}
          multiline
          autocapitalize="sentences"
          {...rest}
        />
      </Container>
    );
  }
);

export { TextAreaInput };
