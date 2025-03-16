import { Dimensions } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

export default {
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  GROUND_HEIGHT: WINDOW_HEIGHT * 0.6, // 調整到螢幕 60% 的高度，讓怪物更往上
  MONSTER_SIZE: {
    width: 100,
    height: 100
  }
};