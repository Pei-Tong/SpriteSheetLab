import Matter from 'matter-js';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

const Monster = (props) => {
  const monster = useRef(null);
  const nameRef = useRef(props.name || "學生姓名");
  const [currentAnim, setCurrentAnim] = useState('fall');

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
      setCurrentAnim('fall');
    }
  }, []);

  // 處理動畫變化
  useEffect(() => {
    if (!monster.current) return;
    
    const animType = props.animOptions?.animType;
    
    // 避免重複播放相同動畫
    if (animType === currentAnim) return;
    
    console.log("Monster animation changing from", currentAnim, "to", animType);
    setCurrentAnim(animType);
    
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
          onComplete: () => {
            console.log("Death animation completed");
            // 死亡動畫完成後保持最後一幀
            monster.current.play({
              type: 'die',
              fps: 1,
              loop: false,
              frames: [44] // 使用死亡動畫的最後一幀
            });
          }
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
          idle: [30, 31],
          walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          die: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
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

export default (world, pos, size, name, collisionCategories = {}) => {
    // 使用適當的碰撞框大小 - 縮小碰撞框以適應視覺大小
    const collisionWidth = size.width * 0.7;
    const collisionHeight = size.height * 0.7;
    
    // 獲取碰撞分類或使用默認值
    const categories = collisionCategories || {
        ground: 0x0001,
        monster: 0x0002
    };

    const initialMonster = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        collisionWidth,
        collisionHeight,
        {
            label: 'Monster',
            frictionAir: 0.05,    // 空氣摩擦力
            friction: 1.0,        // 地面摩擦力
            restitution: 0.0,     // 無反彈
            density: 0.0005,      // 密度
            collisionFilter: {
                category: categories.monster,
                mask: categories.ground | categories.candle | categories.wall
            },
            isStatic: false,
        }
    );

    // 添加調試信息
    console.log('Monster created with collision category:', categories.monster);
    console.log('Monster collision mask:', 
        categories.ground | categories.candle | categories.wall);
    console.log('Monster initial position:', pos.x, pos.y);

    Matter.World.add(world, initialMonster);

    return {
        body: initialMonster,
        size,
        name,
        collisionWidth,
        collisionHeight,
        animOptions: {
            animType: 'fall',
        },
        renderer: <Monster />
    };
};