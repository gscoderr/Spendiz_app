import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#0D0D2B",
          borderTopWidth: 0,
            
        },
          tabBarLabelStyle: {
          fontSize: 11,            // ✅ Shrinks label font
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,            // ✅ Reduce top margin
        },
        sceneContainerStyle: {
          backgroundColor: "#0D0D2B",  // same as your screen bg
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="creditcards"
        options={{
          tabBarLabel: "Cards",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="loyalty"
        options={{
          tabBarLabel: "Loyalty",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="consult"
        options={{
          tabBarLabel: "Consult",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
