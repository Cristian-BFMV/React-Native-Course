import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CoinsStack from './src/components/coins/CoinsStack';
import FavoritesStack from './src/components/favorites/FavoritesStack';
import colors from './src/res/colors';

const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator
        tabBarOptions={{
          tintColor: '#fefefe',
          activeTintColor: '#fff',
          style: {
            backgroundColor: colors.blackPearl,
          },
        }}
      >
        <Tabs.Screen
          component={CoinsStack}
          name="Coins"
          options={{
            tabBarIcon: ({ size, color }) => {
              return (
                <Image
                  style={{ tintColor: color, width: size, height: size }}
                  source={require('./src/assets/bank.png')}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          component={FavoritesStack}
          name="Favorites"
          options={{
            tabBarIcon: ({ size, color }) => {
              return (
                <Image
                  style={{ tintColor: color, width: size, height: size }}
                  source={require('./src/assets/star.png')}
                />
              );
            },
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
