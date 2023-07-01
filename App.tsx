import { useNetInfo } from "@react-native-community/netinfo";
import { WifiSlash } from "phosphor-react-native";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/libs/dayjs";

// Screens
import { SignIn } from "./src/screens/SignIn";

// Theme
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { ThemeProvider } from "styled-components/native";
import theme from "./src/theme";

// Components
import { Loading } from "@components/Loading";
import { TopMessage } from "@components/TopMessage";
import { StatusBar } from "react-native";

// Configs
import { REALM_APP_ID } from "@env";
import { AppProvider, UserProvider } from "@realm/react";

// libs
import { RealmProvider, syncConfig } from "./src/libs/realm";

// Routes
import { Routes } from "@routes/index";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const netInfo = useNetInfo();

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          <StatusBar
            barStyle={"light-content"}
            backgroundColor={"transparent"}
            translucent
          />
          {!netInfo.isConnected && (
            <TopMessage title="Você está offline." icon={WifiSlash} />
          )}

          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
