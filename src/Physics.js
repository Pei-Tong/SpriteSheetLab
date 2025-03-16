import Matter from "matter-js";
import Constants from './Constants';

// 调试帧计数器
let debugFrameCounter = 0;

// 检查函数 - 用于调试
const logTouchInfo = (touch, monster, isInBody) => {
  console.log(`Touch: x=${touch.pageX.toFixed(2)}, y=${touch.pageY.toFixed(2)}`);
  if (monster && monster.body && monster.body.bounds) {
    const b = monster.body.bounds;
    console.log(`Monster bounds: min(${b.min.x.toFixed(2)}, ${b.min.y.toFixed(2)}), max(${b.max.x.toFixed(2)}, ${b.max.y.toFixed(2)})`);
  }
  console.log(`Is touch inside monster: ${isInBody}`);
  if (monster && monster.animOptions) {
    console.log(`Monster animation type: ${monster.animOptions.animType}`);
  }
};

// 改进的点击检测函数 - 扩大点击范围
const isClickNearMonster = (x, y, monster) => {
  if (!monster || !monster.body || !monster.body.bounds) return false;
  
  const bounds = monster.body.bounds;
  const extraClickArea = 30; // 扩大点击区域的像素数
  
  return (
    x >= bounds.min.x - extraClickArea &&
    x <= bounds.max.x + extraClickArea &&
    y >= bounds.min.y - extraClickArea &&
    y <= bounds.max.y + extraClickArea
  );
};

const Physics = (entities, { touches, time }) => {
  let engine = entities.physics.engine;
  
  // 从实体中获取正确的位置信息
  const groundBody = entities.Ground.body;
  const groundY = groundBody.position.y;
  const groundHeight = entities.Ground.size.height;
  const groundTop = groundY - (groundHeight / 2);
  
  // 怪物高度和位置计算
  const monsterHeight = entities.Monster.size.height;
  const monsterGroundOffset = 48; // 与 entities/index.js 中的值保持一致
  const targetMonsterY = groundTop - (monsterHeight / 2) - monsterGroundOffset;
  
  // 获取右蜡烛位置
  const rightCandleX = entities.RightCandle.body.position.x;
  
  // 每隔60帧打印一次位置信息（约每1秒）
  if (debugFrameCounter % 60 === 0) {
    console.log("==== 物体位置信息 ====");
    console.log(`时间戳: ${Date.now()}`);
    
    // 打印右蜡烛信息
    if (entities.RightCandle && entities.RightCandle.body) {
      const candlePos = entities.RightCandle.body.position;
      console.log(`RightCandle: x=${candlePos.x.toFixed(2)}, y=${candlePos.y.toFixed(2)}`);
    }
    
    // 打印怪物位置和动画状态
    if (entities.Monster && entities.Monster.body) {
      const monsterPos = entities.Monster.body.position;
      console.log(`Monster: x=${monsterPos.x.toFixed(2)}, y=${monsterPos.y.toFixed(2)}, animation: ${entities.Monster.animOptions.animType}`);
      
      // 如果怪物在走路，显示速度信息
      if (entities.Monster.animOptions.animType === "walk") {
        console.log(`Monster velocity: x=${entities.Monster.body.velocity.x.toFixed(2)}, y=${entities.Monster.body.velocity.y.toFixed(2)}`);
      }
    }
  }
  
  // 增加帧计数器
  debugFrameCounter++;

  // 处理触摸事件
  touches
    .filter((t) => t.type === "press")
    .forEach((t) => {
      console.log(`Touch detected: ${t.event.pageX}, ${t.event.pageY}`);
      
      // 使用扩大的点击区域检测
      const touchInMonster = entities.Monster && 
                          isClickNearMonster(t.event.pageX, t.event.pageY, entities.Monster);
                          
      // 使用原始函数记录日志
      logTouchInfo(t.event, entities.Monster, touchInMonster);
      
      if (touchInMonster) {
        console.log("Monster clicked! Current state:", entities.Monster.animOptions.animType);
        
        // 当怪物处于闲置状态时，开始走路
        if (entities.Monster.animOptions.animType === "idle") {
          console.log("Starting walk animation toward right candle");
          entities.Monster.animOptions.animType = "walk";
          
          // 标记怪物已经开始走向右蜡烛
          entities.Monster.walkingToRightCandle = true;
        }
      }

      // 检查是否点击左蜡烛
      if (
        entities.LeftCandle && 
        isPointInBody(t.event.pageX, t.event.pageY, entities.LeftCandle.body)
      ) {
        console.log("Left candle clicked!");
        entities.LeftCandle.toggleLight();
      }

      // 检查是否点击右蜡烛
      if (
        entities.RightCandle && 
        isPointInBody(t.event.pageX, t.event.pageY, entities.RightCandle.body)
      ) {
        console.log("Right candle clicked!");
        entities.RightCandle.toggleLight();
      }
    });

  // 更新物理引擎
  Matter.Engine.update(engine, time.delta);

  // 立即检查怪物位置和状态
  if (entities.Monster && entities.Monster.body) {
    const monsterPos = entities.Monster.body.position;
    
    // 如果怪物在走路状态，确保它持续移动向右蜡烛
    if (entities.Monster.animOptions.animType === "walk" && entities.Monster.walkingToRightCandle) {
      // 不断应用向右的力，确保持续移动
      const moveSpeed = 3.0;
      Matter.Body.setVelocity(entities.Monster.body, {
        x: moveSpeed,
        y: 0
      });
      
      // 检查怪物是否已经到达或超过右蜡烛位置
      if (monsterPos.x >= rightCandleX - 30) {
        console.log("Monster reached right candle position!");
        
        // 触发死亡动画
        entities.Monster.animOptions.animType = "die";
        entities.Monster.walkingToRightCandle = false;
        
        // 停止怪物移动
        Matter.Body.setVelocity(entities.Monster.body, { x: 0, y: 0 });
      }
    }
    
    // 确保怪物保持在正确的高度
    if (monsterPos.y > targetMonsterY) {
      // 落到地面后变为闲置状态（如果当前是fall状态）
      if (entities.Monster.animOptions.animType === "fall") {
        entities.Monster.animOptions.animType = "idle";
        console.log("Monster reached ground - switching to idle");
      }
      
      // 处理垂直位置（保持水平速度不变）
      const currentXVelocity = entities.Monster.body.velocity.x;
      
      Matter.Body.setPosition(entities.Monster.body, {
        x: monsterPos.x,
        y: targetMonsterY
      });
      
      // 确保维持水平速度
      Matter.Body.setVelocity(entities.Monster.body, { 
        x: currentXVelocity, 
        y: 0 
      });
    }
  }

  // 处理碰撞
  if (engine.world.pairs && engine.world.pairs.list) {
    const pairs = engine.world.pairs.list;
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;
      
      // 检查怪物是否与右蜡烛碰撞
      if (
        (bodyA.label === "Monster" && bodyB.label === "RightCandle") ||
        (bodyA.label === "RightCandle" && bodyB.label === "Monster")
      ) {
        console.log("Monster collided with right candle!");
        
        if (entities.Monster && entities.Monster.animOptions) {
          // 触发死亡动画
          entities.Monster.animOptions.animType = "die";
          entities.Monster.walkingToRightCandle = false;
          
          // 停止怪物移动
          Matter.Body.setVelocity(entities.Monster.body, { x: 0, y: 0 });
        }
      }
    }
  }

  return entities;
};

// 原始点击检测函数
const isPointInBody = (x, y, body) => {
  if (!body || !body.bounds) return false;
  
  const bounds = body.bounds;
  return (
    x >= bounds.min.x &&
    x <= bounds.max.x &&
    y >= bounds.min.y &&
    y <= bounds.max.y
  );
};

export default Physics;