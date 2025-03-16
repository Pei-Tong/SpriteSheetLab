import Matter from 'matter-js';
import Candle from '../components/Candle';
import Monster from '../components/Monster';
import Edge from '../components/Edges';
import Constants from '../Constants';

export default () => {
  // 创建物理引擎
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;

  // 增加重力，使怪物下落更快
  engine.gravity.y = 0.4;

  // 学生姓名
  const studentName = "Pei-Tong Tsai";

  // 设置地面高度
  const groundY = Constants.WINDOW_HEIGHT - 35;

  return {
    physics: { engine, world },

    // 怪物 - 放在上方，让它有足够的空间下落
    Monster: Monster(
      world,
      { x: Constants.WINDOW_WIDTH / 2, y: 100 },
      { width: 90, height: 90 },
      studentName
    ),

    // 左蜡烛 - 位于左下角
    LeftCandle: Candle(
      world,
      { x: 50, y: groundY - 45 },
      { width: 60, height: 90 },
      false
    ),

    // 右蜡烛 - 位于右下角
    RightCandle: Candle(
      world,
      { x: Constants.WINDOW_WIDTH - 50, y: groundY - 45 },
      { width: 60, height: 90 },
      true
    ),

    // 地面 - 阻止怪物下落，增加碰撞宽度
    Ground: Edge(
      world,
      { x: Constants.WINDOW_WIDTH / 2, y: groundY },
      { width: Constants.WINDOW_WIDTH, height: 30 },
      { label: 'Ground', color: 'rgba(255, 0, 0, 0.5)' }
    ),

    // 左边界
    LeftWall: Edge(
      world,
      { x: 10, y: Constants.WINDOW_HEIGHT / 2 },
      { width: 20, height: Constants.WINDOW_HEIGHT },
      { label: 'Wall', color: 'rgba(0, 0, 255, 0.5)' }
    ),

    // 右边界
    RightWall: Edge(
      world,
      { x: Constants.WINDOW_WIDTH - 10, y: Constants.WINDOW_HEIGHT / 2 },
      { width: 20, height: Constants.WINDOW_HEIGHT },
      { label: 'Wall', color: 'rgba(0, 0, 255, 0.5)' }
    ),
  };
};