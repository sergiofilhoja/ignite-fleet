import { Realm, useApp } from "@realm/react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

// Styles
import { Container, Slogan, Title } from "./styles";

// Components
import { Button } from "@components/Button";

// Assets
import BackgroundImg from "@assets/background.png";

// Configs
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Hooks
  const app = useApp();
  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: `${ANDROID_CLIENT_ID}`,
    iosClientId: `${IOS_CLIENT_ID}`,
    scopes: ["profile", "email"],
  });

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    googleSignIn().then((response) => {
      if (response.type !== "success") {
        setIsAuthenticating(false);
      }
    });
  }

  useEffect(() => {
    if (response?.type === "success") {
      if (response.authentication?.idToken) {
        const credentials = Realm.Credentials.jwt(
          response.authentication.idToken
        );
        app.logIn(credentials).catch((error) => {
          console.log(error);
          Alert.alert(
            "Entrar",
            "Não foi possível conectar-se a sua conta Google."
          );
        });
      } else {
        Alert.alert(
          "Entrar",
          "Não foi possível conectar-se a sua conta Google."
        );
        setIsAuthenticating(false);
      }
    }
  }, [response]);

  return (
    <Container source={BackgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        onPress={handleGoogleSignIn}
        title={"Entrar com o google"}
        isLoading={isAuthenticating}
      />
    </Container>
  );
}
