import { Car, FlagCheckered } from "phosphor-react-native";
import React from "react";

// Styles
import { LocationInfo, LocationInfoProps } from "@components/LocationInfo";
import { Container, Line } from "./styles";

type Props = {
  departure: LocationInfoProps;
  arrival?: LocationInfoProps | null;
};

export function Locations({ departure, arrival = null }: Props) {
  return (
    <Container>
      <LocationInfo
        icon={Car}
        label={departure.label}
        description={departure.description}
      />

      {arrival && (
        <>
          <Line />
          <LocationInfo
            icon={FlagCheckered}
            label={departure.label}
            description={departure.description}
          />
        </>
      )}
    </Container>
  );
}
