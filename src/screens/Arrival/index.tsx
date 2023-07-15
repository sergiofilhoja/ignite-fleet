import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { X } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { LatLng } from "react-native-maps";
import { BSON } from "realm";

// Libs
import { getStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { getLastAsyncTimestamp } from "../../libs/asyncStorage/syncStorage";
import { useObject, useRealm } from "../../libs/realm/";
import { Historic } from "../../libs/realm/schemas/Historic";

// Styles
import {
  AsyncMessage,
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";

// Components
import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Header } from "@components/Header";
import { Loading } from "@components/Loading";
import { LocationInfoProps } from "@components/LocationInfo";
import { Locations } from "@components/Locations";
import { Map } from "@components/Map";

// Task
import { stopLocationTask } from "../../tasks/backgroundLocationTask";

// Utils
import { getAddressLocation } from "@utils/getAddressLocation";

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();
  const { goBack } = useNavigation();
  const { id } = route.params as RouteParamsProps;

  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);
  const realm = useRealm();

  const title = historic?.status === "departure" ? "Chegada" : "Detalhes";

  function handleRemoveVehicleUsege() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo ?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => removeVehicleUsage() },
    ]);
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();
    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Error",
          "Não foi possível obter os dados para registrar a chegada do veículo."
        );
      }

      const locations = await getStorageLocations();

      realm.write(() => {
        (historic.status = "arrival"),
          (historic.updated_at = new Date()),
          historic.coords.push(...locations);
      });

      await stopLocationTask();

      Alert.alert("Chegada", "Chegada registrada com sucesso!");
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível registrar a chegada do veículo.");
    }
  }

  async function getLocationsInfo() {
    if (!historic) return;

    const lastSync = getLastAsyncTimestamp();
    const updatedAt = historic!.updated_at.getTime();

    setDataNotSynced(updatedAt > (await lastSync));

    if (historic?.status === "departure") {
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      setCoordinates(historic?.coords ?? []);
    }

    if (historic?.coords[0]) {
      const departureSteetName = await getAddressLocation(historic?.coords[0]);

      setDeparture({
        label: `Saindo em ${departureSteetName ?? ""}`,
        description: dayjs(new Date(historic?.coords[0].timestamp)).format(
          "DD/MM/YYYY [às] HH:mm"
        ),
      });
    }

    if (historic?.status === "arrival") {
      const lastLocation = historic.coords[historic.coords.length - 1];

      const arrivalSteetName = await getAddressLocation(lastLocation);

      setArrival({
        label: `Chegando em ${arrivalSteetName ?? ""}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          "DD/MM/YYYY [às] HH:mm"
        ),
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getLocationsInfo();
  }, [historic]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Locations departure={departure} arrival={arrival} />

        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === "departure" && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsege} />
          <Button title={"Registrar chegada"} onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da
          {historic?.status === "departure" ? " partida " : " chegada "}
          pendente
        </AsyncMessage>
      )}
    </Container>
  );
}
