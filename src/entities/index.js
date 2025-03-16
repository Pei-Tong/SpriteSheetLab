import Matter from 'matter-js';
import Candle from '../components/Candle';
import Monster from '../components/Monster';
import Edge from '../components/Edges';
import Constants from '../Constants';

// 打印窗口尺寸进行调试
console.log("==== 设备信息 ====");
console.log("Window dimensions:", Constants.WINDOW_HEIGHT, Constants.WINDOW_WIDTH);

export default () => {
  // 创建物理引擎
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;

  // 减小重力，让怪物下落更慢
  engine.gravity.y = 0.3;

  // 学生姓名
  const studentName = "Pei-Tong Tsai";

  // 根据窗口底部数据进行调整
  const windowBottom = Constants.WINDOW_HEIGHT;
  
  // 安全偏移量
  const safetyOffset = 20; 
  const groundBottomOffset = 5 + safetyOffset; 
  const groundHeight = 20; 
  
  // 计算地面中心位置
  const groundY = windowBottom - groundBottomOffset - (groundHeight / 2);
  
  // 蜡烛高度和偏移量
  const candleHeight = 90;
  const candleY = groundY - (groundHeight / 2) - (candleHeight / 2);
  
  // 怪物高度和位置计算
  const monsterHeight = 90;
  
  // *** 关键修改：使用指定的48像素间距 ***
  const monsterGroundOffset = 48; // 怪物底部与地面顶部的额外间距
  const monsterY = groundY - (groundHeight / 2) - (monsterHeight / 2) - monsterGroundOffset;

  // 定义碰撞分类
  const collisionCategories = {
    ground: 0x0001,
    monster: 0x0002,
    candle: 0x0004,
    wall: 0x0008
  };

  // 记录设置的位置
  console.log("==== 布局设置（提高怪物位置）====");
  console.log(`Safety Offset: ${safetyOffset}`);
  console.log(`Monster-Ground Offset: ${monsterGroundOffset}`);
  console.log(`Window Bottom: ${windowBottom}`);
  console.log(`Ground Y position: ${groundY}, top: ${groundY - (groundHeight/2)}`);
  console.log(`Candle Y position: ${candleY}`);
  console.log(`Monster Y position: ${monsterY}`);

  return {
    physics: { engine, world },

    // 怪物 - 放在上方，让它有足够的空间下落
    Monster: Monster(
      world,
      { x: Constants.WINDOW_WIDTH / 2, y: 500 },
      { width: 90, height: monsterHeight },
      studentName,
      collisionCategories
    ),

    // 左蜡烛 - 位于左下角
    LeftCandle: Candle(
      world,
      { x: 50, y: candleY },
      { width: 60, height: candleHeight },
      false
    ),

    // 右蜡烛 - 位于右下角
    RightCandle: Candle(
      world,
      { x: Constants.WINDOW_WIDTH - 50, y: candleY },
      { width: 60, height: candleHeight },
      true
    ),

    // 地面 - 靠近屏幕底部，但考虑安全区域
    Ground: Edge(
      world,
      { x: Constants.WINDOW_WIDTH / 2, y: groundY },
      { width: Constants.WINDOW_WIDTH, height: groundHeight },
      { 
        label: 'Ground', 
        color: 'rgba(255, 0, 0, 0.5)',
        collisionFilter: {
          category: collisionCategories.ground,
          mask: collisionCategories.monster | collisionCategories.candle
        }
      }
    ),

    // 左边界
    LeftWall: Edge(
      world,
      { x: 0, y: Constants.WINDOW_HEIGHT / 2 },
      { width: 20, height: Constants.WINDOW_HEIGHT },
      { 
        label: 'Wall', 
        color: 'rgba(0, 0, 255, 0.2)',
        collisionFilter: {
          category: collisionCategories.wall,
          mask: collisionCategories.monster
        }
      }
    ),

    // 右边界
    RightWall: Edge(
      world,
      { x: Constants.WINDOW_WIDTH, y: Constants.WINDOW_HEIGHT / 2 },
      { width: 20, height: Constants.WINDOW_HEIGHT },
      { 
        label: 'Wall', 
        color: 'rgba(0, 0, 255, 0.2)',
        collisionFilter: {
          category: collisionCategories.wall,
          mask: collisionCategories.monster
        }
      }
    ),

    // 底部边界 - 确保怪物不会掉出屏幕
    BottomSafety: Edge(
      world,
      { x: Constants.WINDOW_WIDTH / 2, y: Constants.WINDOW_HEIGHT + 10 },
      { width: Constants.WINDOW_WIDTH, height: 20 },
      { 
        label: 'BottomSafety', 
        color: 'rgba(255, 255, 0, 0.2)',
        collisionFilter: {
          category: collisionCategories.ground,
          mask: collisionCategories.monster
        }
      }
    ),
  };
};