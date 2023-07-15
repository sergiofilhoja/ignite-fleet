import { useNavigation } from "@react-navigation/native";
import { useUser } from "@realm/react";
import {
  LocationAccuracy,
  LocationObjectCoords,
  LocationSubscription,
  requestBackgroundPermissionsAsync,
  useForegroundPermissions,
  watchPositionAsync,
} from "expo-location";
import { Car } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Libs
import { useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

// Styles
import { Container, Content, Message } from "./styles";

// Components
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { LicensePlateInput } from "@components/LicensePlateInput";
import { Loading } from "@components/Loading";
import { LocationInfo } from "@components/LocationInfo";
import { Map } from "@components/Map";
import { TextAreaInput } from "@components/TextAreaInput";

// Utils
import { getAddressLocation } from "@utils/getAddressLocation";
import { licensePlateValidate } from "@utils/licensePlateValidate";
import { startLocationTask } from "../../tasks/backgroundLocationTask";

export function Departure() {
  // Local States
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null);

  // Refs
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  // Hooks
  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();
  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();

  async function handleDepartureRegister() {
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

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert(
          "Localização!",
          "Não foi possível obter a localização atual, tente novamente."
        );
      }

      setIsRegistering(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();

      if (!backgroundPermissions.granted) {
        setIsRegistering(false);

        return Alert.alert(
          "Localização",
          "É preciso que o App tenha acessso a localização em segundo plano. Acesse as configuracoes do dispositivo e permite o tempo todo."
        );
      }

      await startLocationTask();

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

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }
    let subscription: LocationSubscription | undefined;
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords);
        getAddressLocation(location.coords)
          .then((address) => {
            if (address) {
              setCurrentAddress(address);
            }
          })
          .finally(() => setIsLoadingLocation(false));
      }
    ).then((response) => (subscription = response));

    return () => subscription?.remove();
  }, [locationForegroundPermission]);

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para
          utilizar essa funcionalidade. Por favor acesse as configurações do seu
          dispostivo para conceder essa permissão ao aplicativo.
        </Message>
      </Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}

          <Content>
            {currentAddress && (
              <LocationInfo
                icon={Car}
                label="Localização atual"
                description={currentAddress}
              />
            )}

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
      </KeyboardAwareScrollView>
    </Container>
  );
}
