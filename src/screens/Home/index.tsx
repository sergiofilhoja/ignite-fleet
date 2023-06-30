import { useNavigation } from "@react-navigation/native";
import React from "react";

// Style
import { Container, Content } from "./styles";

// Components
import { CarStatus } from "@components/CarStatus";
import { HomeHeader } from "@components/HomeHeader";

export function Home() {
  const { navigate } = useNavigation();

  function handleRegisterMoviment() {
    navigate("departure");
  }

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus onPress={handleRegisterMoviment} />
      </Content>
    </Container>
  );
}
