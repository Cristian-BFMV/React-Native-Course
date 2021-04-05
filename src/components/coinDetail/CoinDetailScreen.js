import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, SectionList, FlatList, Pressable, Alert } from 'react-native';
import CoinMarketItem from './CoinMarketItem';
import colors from '../../res/colors';
import Http from '../../libs/http';
import Storage from '../../libs/storage';

class CoinDetailScreen extends Component {
  state = {
    coin: {},
    markets: [],
    isFavorite: false,
  };

  componentDidMount() {
    // Getting the coin from the router
    const { coin } = this.props.route.params;
    // Changing the title of the screen
    this.props.navigation.setOptions({ title: coin.symbol });

    this.getMarkets(coin.id);
    this.setState({ coin }, () => {
      this.getFavorite();
    });
  }

  getSymbolIcon = coinNameId => {
    if (coinNameId) {
      return `https://c1.coinlore.com/img/25x25/${coinNameId}.png`;
    }
  };

  getSections = coin => {
    const data = [
      {
        title: 'Market cap',
        data: [coin.market_cap_usd],
      },
      {
        title: 'Volume 24h',
        data: [coin.volume24],
      },
      {
        title: 'Change 24h',
        data: [coin.percent_change_24h],
      },
    ];
    return data;
  };

  getMarkets = async coinId => {
    const url = `https://api.coinlore.net/api/coin/markets/?id=${coinId}`;
    const markets = await Http.instance.get(url);
    this.setState({ markets });
  };

  toggleFavorite = () => {
    const { isFavorite } = this.state;
    if (isFavorite) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  };

  addFavorite = async () => {
    const coin = JSON.stringify(this.state.coin);
    const key = `favorite-${this.state.coin.id}`;
    const stored = await Storage.instance.store(key, coin);
    if (stored) {
      this.setState({ isFavorite: true });
    }
  };

  getFavorite = async () => {
    try {
      const key = `favorite-${this.state.coin.id}`;
      const favStr = await Storage.instance.get(key);
      if (favStr !== null) {
        this.setState({ isFavorite: true });
      }
    } catch (error) {
      console.log('Get favorite error', error);
    }
  };

  removeFavorite = async () => {
    Alert.alert('Remove favorite', 'Are u sure?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: async () => {
          const key = `favorite-${this.state.coin.id}`;
          await Storage.instance.remove(key);
          this.setState({ isFavorite: false });
        },
        style: 'destructive',
      },
    ]);
  };

  render() {
    const { coin, markets, isFavorite } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <View style={styles.row}>
            <Image style={styles.iconImg} source={{ uri: this.getSymbolIcon(coin.nameid) }} />
            <Text style={styles.titleText}>{coin.name}</Text>
          </View>
          <Pressable
            style={[styles.buttonFavorite, isFavorite ? styles.buttonFavoriteRemove : styles.buttonFavoriteAdd]}
            onPress={this.toggleFavorite}
          >
            <Text style={styles.buttonFavoriteText}>{isFavorite ? 'Remove Favorite' : 'Add to favorite'} </Text>
          </Pressable>
        </View>
        <SectionList
          sections={this.getSections(coin)}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <View style={styles.sectionItem}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionText}>{section.title}</Text>
            </View>
          )}
          style={styles.section}
        />
        <Text style={styles.marketsTitle}>Markets</Text>
        <FlatList
          style={styles.list}
          data={markets}
          renderItem={({ item }) => <CoinMarketItem item={item} />}
          horizontal={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.charade,
    flex: 1,
  },
  subHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  iconImg: {
    width: 25,
    height: 25,
  },
  sectionHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 8,
  },
  sectionItem: {
    padding: 8,
  },
  itemText: {
    color: colors.white,
    fontSize: 14,
  },
  sectionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    maxHeight: 220,
  },
  list: {
    maxHeight: 100,
    paddingLeft: 16,
  },
  marketsTitle: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 16,
    paddingLeft: 16,
    fontWeight: 'bold',
  },
  buttonFavorite: {
    padding: 8,
    borderRadius: 8,
  },
  buttonFavoriteText: {
    color: colors.white,
  },
  buttonFavoriteAdd: {
    backgroundColor: colors.picton,
  },
  buttonFavoriteRemove: {
    backgroundColor: colors.carmine,
  },
  row: {
    flexDirection: 'row',
  },
});

export default CoinDetailScreen;
