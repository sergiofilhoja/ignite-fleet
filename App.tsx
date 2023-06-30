import { SafeAreaProvider } from "react-native-safe-area-context";

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
import { StatusBar } from "react-native";
import { Loading } from "./src/components/Loading";

// Configs
import { REALM_APP_ID } from "@env";
import { AppProvider, UserProvider } from "@realm/react";

// libs
import { RealmProvider } from "./src/libs/realm";

// Routes
import { Routes } from "@routes/index";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

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

          <UserProvider fallback={SignIn}>
            <RealmProvider>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
