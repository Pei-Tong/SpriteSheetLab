import Matter from 'matter-js';
import React, { useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

const Monster = (props) => {
  const monster = useRef(null);
  const nameRef = useRef(props.name || "學生姓名");

  const width = props.size?.width || 100;
  const height = props.size?.height || 100;
  const xPos = props.body?.position?.x - width / 2;
  const yPos = props.body?.position?.y - height / 2;

  useEffect(() => {
    // 播放初始下落動畫
    if (monster.current) {
      monster.current.play({
        type: 'fall',
        fps: 16,
        loop: true,
      });
    }
  }, []);

  // 處理動畫變化
  useEffect(() => {
    if (!monster.current) return;
    
    const animType = props.animOptions?.animType;
    switch (animType) {
      case 'fall':
        monster.current.play({
          type: 'fall',
          fps: 16,
          loop: true,
        });
        break;
      case 'idle':
        monster.current.play({
          type: 'idle',
          fps: 12,
          loop: true,
        });
        break;
      case 'walk':
        monster.current.play({
          type: 'walk',
          fps: 16,
          loop: true,
        });
        break;
      case 'die':
        monster.current.play({
          type: 'die',
          fps: 16,
          loop: false,
        });
        break;
    }
  }, [props.animOptions?.animType]);

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
        ref={monster}
        source={require('../../assets/monster.png')}
        columns={9}
        rows={6}
        height={height}
        width={width}
        imageStyle={{ marginTop: 0 }}
        animations={{
          fall: [18, 19, 20, 21, 22, 23, 24, 25, 26],
          idle: [27, 28, 29, 30],
          walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          die: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
        }}
      />
      <Text 
        style={{
          position: 'absolute',
          top: -20,
          width: '100%',
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 2,
          fontSize: 12,
        }}
      >
        {nameRef.current}
      </Text>
    </View>
  );
};

export default (world, pos, size, name) => {
    const initialMonster = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width * 0.8, // 稍微缩小碰撞器
        size.height * 0.8,
        {
            label: 'Monster',
            frictionAir: 0.01, // 减少空气摩擦力
            friction: 0.1,     // 增加地面摩擦力
            restitution: 0.1,  // 减少反弹
            density: 0.002,    // 降低密度，减轻重量
        }
    );

  Matter.World.add(world, initialMonster);

  return {
    body: initialMonster,
    size,
    name,
    animOptions: {
      animType: 'fall', // 初始動畫類型
    },
    renderer: <Monster />,
  };
};