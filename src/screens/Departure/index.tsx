import { useNavigation } from "@react-navigation/native";
import { useUser } from "@realm/react";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";

// Libs
import { useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

// Styles
import { Container, Content } from "./styles";

// Components
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { LicensePlateInput } from "@components/LicensePlateInput";
import { TextAreaInput } from "@components/TextAreaInput";

// Utils
import { licensePlateValidate } from "@utils/licensePlateValidate";

const KeyboardAvoidingViewBehaivor =
  Platform.OS === "android" ? "height" : "position";

export function Departure() {
  // Local States
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Refs
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  // Hooks
  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert(
          "Placa inválida",
          "A placa é inválida. Por favor, informe a placa correta do veículo."
        );
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert(
          "Finalidade",
          "Por favor, informe a finalidade da utilização do veículo."
        );
      }

      setIsRegistering(true);

      realm.write(() => {
        realm.create(
          "Historic",
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        );
      });

      Alert.alert("Saída", "Saída do veículo registrada com sucesso!");
      goBack();
    } catch (error) {
      setIsRegistering(false);
      console.log(error);
      Alert.alert("Erro", "Não foi possível registrar a saída do veículo.");
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehaivor}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyLabel="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registrar saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
