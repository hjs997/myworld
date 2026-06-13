const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Docker Bot is running strong!'); 
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Web 服务已在容器端口 ${port} 启动`);
});

let actionInterval = null; 

function createBot() {
  const bot = mineflayer.createBot({
    host: '15.235.212.121', 
    port: 11826,               
    username: 'myworldhappy',  
    version: false
    // 删除了这里的 physics: false，恢复默认配置
  });

  bot.on('spawn', () => {
    console.log('✅ 假人已成功进服！正在等待脚下方块加载...');
    
    // 1. 进服的瞬间强制闭气，变成木头人，防止被服务端误判踢出
    bot.physicsEnabled = false; 

    // 2. 等待 5 秒钟（5000毫秒），让周围的地图完全加载出来
    setTimeout(() => {
      console.log('🌍 环境加载完毕，激活物理引擎！假人可以移动了。');
      bot.physicsEnabled = true; // 唤醒物理引擎！

      if (actionInterval) clearInterval(actionInterval);

      actionInterval = setInterval(() => {
        try {
          // 移动逻辑：往前走并跳跃
          bot.setControlState('forward', true);
          bot.setControlState('jump', true);
          
          // 走 1 秒钟后停下来
          setTimeout(() => {
            bot.setControlState('forward', false);
            bot.setControlState('jump', false);
          }, 1000);

          console.log('Bot 执行了物理移动（前行 + 跳跃）。');
        } catch (err) {
          console.log('执行动作失败，可能已掉线。');
        }
      }, 300000); // 每 5 分钟动一次

    }, 5000); // 这里的 5000 就是缓冲时间
  });

  bot.on('error', err => console.log('❌ 内部错误:', err));
  
  bot.on('end', () => {
    console.log('⚠️ 连接断开，10秒后尝试重连...');
    if (actionInterval) {
      clearInterval(actionInterval);
      actionInterval = null;
    }
    setTimeout(createBot, 10000);
  });
}

createBot();
