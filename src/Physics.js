import Matter from "matter-js";

const Physics = (entities, { touches, time }) => {
  let engine = entities.physics.engine;

  // 处理触摸事件
  touches
    .filter((t) => t.type === "press")
    .forEach((t) => {
      const touchX = t.event.pageX;
      const touchY = t.event.pageY;

      // 检查是否点击怪物
      if (
        entities.Monster && 
        entities.Monster.animOptions && 
        entities.Monster.animOptions.animType === "idle" &&
        isPointInBody(touchX, touchY, entities.Monster.body)
      ) {
        // 开始走路动画
        entities.Monster.animOptions.animType = "walk";
        
        // 向右蜡烛方向移动
        Matter.Body.setVelocity(entities.Monster.body, {
          x: 1,
          y: 0,
        });
      }

      // 检查是否点击左蜡烛
      if (
        entities.LeftCandle && 
        isPointInBody(touchX, touchY, entities.LeftCandle.body)
      ) {
        entities.LeftCandle.toggleLight();
      }

      // 检查是否点击右蜡烛
      if (
        entities.RightCandle && 
        isPointInBody(touchX, touchY, entities.RightCandle.body)
      ) {
        entities.RightCandle.toggleLight();
      }
    });

  // 更新物理引擎
  Matter.Engine.update(engine, time.delta);

  // 处理碰撞 - 修复部分
  // 确保 pairs 和 list 存在
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
        if (entities.Monster && entities.Monster.animOptions) {
          // 触发死亡动画
          entities.Monster.animOptions.animType = "die";
          
          // 停止怪物移动
          Matter.Body.setVelocity(entities.Monster.body, { x: 0, y: 0 });
        }
      }

// 在 Physics.js 中的碰撞检测部分
if (engine.world.pairs && engine.world.pairs.list) {
    const pairs = engine.world.pairs.list;
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;
      
      // 打印碰撞信息以进行调试
      console.log(`Collision between: ${bodyA.label} and ${bodyB.label}`);
      
      // 检查怪物是否与地面碰撞
      if (
        (bodyA.label === "Monster" && bodyB.label === "Ground") ||
        (bodyA.label === "Ground" && bodyB.label === "Monster")
      ) {
        if (
          entities.Monster && 
          entities.Monster.animOptions && 
          entities.Monster.animOptions.animType === "fall"
        ) {
          console.log("Monster hit ground - stopping fall");
          // 落到地面后变为闲置状态
          entities.Monster.animOptions.animType = "idle";
          
          // 停止垂直移动
          Matter.Body.setVelocity(entities.Monster.body, { x: 0, y: 0 });
          
          // 防止怪物穿过地面
          Matter.Body.setPosition(entities.Monster.body, {
            x: entities.Monster.body.position.x,
            y: groundY - (entities.Monster.size.height / 2 + 10) // 将怪物放在地面上方
          });
        }
      }
    }
  }
    }
  } else {
    // 如果 pairs 或 list 不存在，可以采用其他方式检测碰撞
    // 例如：使用 Matter.Query.collides() 或自定义碰撞检测逻辑
  }

  return entities;
};

// 辅助函数：检查点是否在物体内
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