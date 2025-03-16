import Matter from 'matter-js';
import React from 'react';
import { View } from 'react-native';

const Edge = (props) => {
  const width = props.size.width;
  const height = props.size.height;
  const xPos = props.body.position.x - width / 2;
  const yPos = props.body.position.y - height / 2;

  const color = props.color || 'transparent';

  return (
    <View
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: width,
        height: height,
        backgroundColor: color,
      }}
    />
  );
};

export default (world, pos, size, options = {}) => {
  const initialEdge = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {
      isStatic: true,
      label: options.label || 'Edge',
      ...options,
    }
  );

  Matter.World.add(world, initialEdge);

  return {
    body: initialEdge,
    size,
    color: options.color || 'transparent',
    renderer: <Edge />,
  };
};