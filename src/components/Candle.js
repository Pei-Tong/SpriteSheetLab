import Matter from 'matter-js';
import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

const Candle = (props) => {
  const candle = useRef(null);
  const [isLit, setIsLit] = useState(false);

  const width = props.size?.width || 60;
  const height = props.size?.height || 90;
  const xPos = props.body?.position?.x - width / 2;
  const yPos = props.body?.position?.y - height / 2;

  // 新增這個 useEffect 來設置初始狀態
  useEffect(() => {
    if (candle.current) {
      // 初始顯示熄滅狀態
      candle.current.play({
        type: "extinguish",
        fps: 16,
        loop: false,
      });
    }
  }, []);

  const toggleCandle = () => {
    if (!candle.current) return;
    
    if (isLit) {
      // 播放熄滅動畫
      candle.current.play({
        type: "extinguish",
        fps: 16,
        loop: false,
      });
    } else {
      // 播放點亮動畫
      candle.current.play({
        type: "light",
        fps: 16,
        loop: true,
      });
    }
    
    setIsLit(!isLit);
    
    // 通知父組件
    if (props.onToggle) {
      props.onToggle(!isLit);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: width,
        height: height,
      }}
    >
      <SpriteSheet
        ref={candle}
        source={require('../../assets/candle.png')}
        columns={7}
        rows={2}
        height={height}
        width={width}
        imageStyle={{ marginTop: 0 }}
        animations={{
          light: [0, 1, 2, 3, 4, 5, 6],
          extinguish: [7],
        }}
      />
      <TouchableWithoutFeedback onPress={toggleCandle}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default (world, pos, size, isRight = false) => {
  const candleBody = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      label: isRight ? 'RightCandle' : 'LeftCandle',
      isStatic: true,
    }
  );

  Matter.World.add(world, candleBody);

  return {
    body: candleBody,
    size,
    isLit: false,
    toggleLight: function() {
      this.isLit = !this.isLit;
    },
    renderer: <Candle />,
  };
};