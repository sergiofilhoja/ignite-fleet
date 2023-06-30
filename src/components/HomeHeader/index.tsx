import { useApp, useUser } from "@realm/react";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Styles
import { Container, Greeting, Message, Name, Picture } from "./styles";

// Assets
import { Power } from "phosphor-react-native";
import theme from "../../theme";

export function HomeHeader() {
  const insets = useSafeAreaInsets();
  const user = useUser();
  const app = useApp();

  const paddingTop = insets.top + 32;

  function handleLogout() {
    app.currentUser?.logOut();
  }

  return (
    <Container style={{ paddingTop }}>
      <Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9kCbIof00ay~qj[ayj@"
      />

      <Greeting>
        <Message>Olá</Message>

        <Name>{user?.profile.name}</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}
