window.RochePlugin.register({
  id: "roche-plugin-little-theater",
  name: "小剧场 Pro Max",
  version: "1.4.0",
  description: "基于莫兰迪美学的沉浸式小剧场生成与共读插件。新增：专属世界书、精细化记忆写入、仿微信长按引用/撤回/重Roll功能。",
  author: "Roche Creator",
  apps: [
    {
      id: "little-theater-app",
      name: "小剧场",
      icon: "theater_comedy",
      async mount(container, roche) {
        
        // --- 1. 样式定义 (支持 CSS 变量换肤 + 新增长按菜单样式) ---
        const styleId = "style-roche-little-theater";
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            :root {
              --lt-bg: #f5f7fa; --lt-panel: #fff; --lt-text-main: #4a5560; --lt-text-sub: #8a9ea8;
              --lt-primary: #b1c2d4; --lt-primary-hover: #9db2c7; --lt-input-bg: #eef2f6;
              --lt-border: #eef2f6; --lt-user-msg: #d0dce8; --lt-char-msg: #fff;
            }
            .theme-pink { --lt-bg: #fff0f5; --lt-panel: #fff; --lt-text-main: #5c434a; --lt-text-sub: #b5929c; --lt-primary: #f4b8c8; --lt-primary-hover: #e3a3b4; --lt-input-bg: #ffe4eb; --lt-border: #ffe4eb; --lt-user-msg: #ffd1dc; }
            .theme-dark { --lt-bg: #1a1a2e; --lt-panel: #16213e; --lt-text-main: #e0e0e0; --lt-text-sub: #8a9ea8; --lt-primary: #0f3460; --lt-primary-hover: #1a4b85; --lt-input-bg: #1a1a2e; --lt-border: #0f3460; --lt-user-msg: #0f3460; --lt-char-msg: #16213e; }

            .roche-lt-container { display: flex; flex-direction: column; height: 100%; background-color: var(--lt-bg); color: var(--lt-text-main); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position: relative; overflow: hidden; box-sizing: border-box; transition: background-color 0.3s; }
            .roche-lt-container * { box-sizing: border-box; }
            
            .roche-lt-topbar { display: flex; justify-content: space-between; padding: 15px 20px 5px 20px; align-items: center; }
            .roche-lt-tabs { display: flex; gap: 15px; }
            .roche-lt-tab { font-size: 18px; font-weight: 600; color: var(--lt-text-sub); cursor: pointer; transition: 0.2s; }
            .roche-lt-tab.active { color: var(--lt-text-main); border-bottom: 2px solid var(--lt-primary); padding-bottom: 2px; }
            .roche-lt-icons { display: flex; gap: 10px; font-size: 20px; color: var(--lt-text-sub); cursor: pointer; }
            
            .roche-lt-filter-bar { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
            .roche-lt-search { width: 100%; padding: 10px 15px; border-radius: 20px; border: none; background: var(--lt-panel); color: var(--lt-text-main); outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
            .roche-lt-categories { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; -webkit-overflow-scrolling: touch; }
            .roche-lt-categories::-webkit-scrollbar { display: none; }
            .roche-lt-cat-btn { padding: 4px 12px; border-radius: 12px; background: var(--lt-input-bg); color: var(--lt-text-sub); font-size: 12px; white-space: nowrap; cursor: pointer; }
            .roche-lt-cat-btn.active { background: var(--lt-primary); color: #fff; }

            .roche-lt-config-area { padding: 10px 20px 80px 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; height: 100%; }
            .roche-lt-config-area.hidden { display: none; }
            
            .roche-lt-select-group { display: flex; gap: 12px; width: 100%; align-items: center; }
            .roche-lt-select-wrapper { flex: 1; position: relative; }
            .roche-lt-select-wrapper select { width: 100%; appearance: none; -webkit-appearance: none; background-color: var(--lt-input-bg); border: 1px solid transparent; border-radius: 20px; padding: 12px 35px 12px 18px; font-size: 14px; color: var(--lt-text-main); outline: none; transition: 0.3s; }
            .roche-lt-select-wrapper::after { content: "▼"; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 10px; color: var(--lt-text-sub); pointer-events: none; }
            
            .roche-lt-icon-btn { background: var(--lt-input-bg); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: var(--lt-text-main); font-size: 18px; transition: 0.2s; flex-shrink: 0; }
            .roche-lt-icon-btn:hover { background: var(--lt-border); }

            .roche-lt-prompt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: -5px; }
            .roche-lt-prompt-header-title { font-size: 13px; font-weight: 500; color: var(--lt-text-sub); }
            .roche-lt-prompt-scroll { display: flex; overflow-x: auto; gap: 12px; padding: 4px 0 16px 0; scroll-snap-type: x mandatory; }
            .roche-lt-prompt-scroll::-webkit-scrollbar { display: none; }
            
            .roche-lt-prompt-item { flex: 0 0 calc(45% - 6px); min-width: 140px; background: var(--lt-panel); border-radius: 16px; padding: 16px; scroll-snap-align: start; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 2px solid transparent; transition: 0.3s; display: flex; flex-direction: column; justify-content: space-between; position: relative; user-select: none; -webkit-user-select: none; }
            .roche-lt-prompt-item.active { border-color: var(--lt-primary); }
            .roche-lt-prompt-title { font-size: 15px; font-weight: 600; color: var(--lt-text-main); margin-bottom: 8px; line-height: 1.3; }
            .roche-lt-prompt-cat { font-size: 11px; color: var(--lt-text-sub); background: var(--lt-input-bg); padding: 3px 8px; border-radius: 10px; align-self: flex-start; }
            
            .roche-lt-collection-area { padding: 10px 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; height: 100%; }
            .roche-lt-collection-area.hidden { display: none; }
            .roche-lt-col-item { background: var(--lt-panel); padding: 15px; border-radius: 16px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); cursor: pointer; border: 1px solid transparent; transition: 0.2s;}
            .roche-lt-col-item:active { transform: scale(0.98); border-color: var(--lt-primary); }
            .roche-lt-col-title { font-size: 15px; font-weight: 600; color: var(--lt-text-main); }
            .roche-lt-col-desc { font-size: 13px; color: var(--lt-text-sub); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .roche-lt-col-meta { font-size: 11px; color: var(--lt-text-sub); text-align: right; }

            .roche-lt-btn { padding: 12px 24px; background: var(--lt-primary); color: #fff; border: none; border-radius: 25px; font-size: 15px; font-weight: 500; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
            .roche-lt-btn:hover { background: var(--lt-primary-hover); }
            .roche-lt-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .roche-lt-btn-outline { background: transparent; border: 1px solid var(--lt-primary); color: var(--lt-text-sub); padding: 6px 14px; font-size: 13px; border-radius: 15px; cursor: pointer;}
            .roche-lt-btn-outline:hover { background: var(--lt-input-bg); }
            .roche-lt-generate-btn { width: 100%; padding: 16px; font-size: 16px; letter-spacing: 2px; border-radius: 16px; margin-top: 10px; }
            
            .roche-lt-theater-area { display: flex; flex-direction: column; height: 100%; background: var(--lt-bg); border-radius: 24px 24px 0 0; padding: 20px; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); overflow: hidden; position: absolute; top: 0; left: 0; width: 100%; z-index: 10; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); transform: translateY(100%); }
            .roche-lt-theater-area.active { transform: translateY(0); }
            .roche-lt-theater-area.fullscreen { border-radius: 0; padding-bottom: 20px; z-index: 9999; }
            
            .roche-lt-theater-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--lt-border); flex-shrink: 0; }
            .roche-lt-theater-title { font-size: 16px; font-weight: 600; color: var(--lt-text-main); }
            .roche-lt-theater-tools { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;}
            
            .roche-lt-theater-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; padding-bottom: 20px; scroll-behavior: smooth; }
            .roche-lt-vignette-content { font-size: 15px; line-height: 1.8; color: var(--lt-text-main); white-space: pre-wrap; padding: 15px; background: var(--lt-panel); border-radius: 16px; flex-shrink: 0; }
            
            .roche-lt-chat-box { background: var(--lt-panel); border-radius: 16px; padding: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px; margin-bottom: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
            .roche-lt-chat-history { display: flex; flex-direction: column; gap: 12px; max-height: 350px; overflow-y: auto; scroll-behavior: smooth; }
            
            .roche-lt-msg { display: flex; flex-direction: column; max-width: 85%; animation: fadeIn 0.3s; position: relative; user-select: none; -webkit-user-select: none; }
            .roche-lt-msg.user { align-self: flex-end; align-items: flex-end; }
            .roche-lt-msg.char { align-self: flex-start; align-items: flex-start; }
            .roche-lt-msg-name { font-size: 11px; color: var(--lt-text-sub); margin-bottom: 4px; padding: 0 4px; }
            .roche-lt-msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; color: var(--lt-text-main); word-break: break-all; cursor: pointer; transition: filter 0.2s; }
            .roche-lt-msg-bubble:active { filter: brightness(0.95); }
            .roche-lt-msg.user .roche-lt-msg-bubble { background: var(--lt-user-msg); border-bottom-right-radius: 4px; }
            .roche-lt-msg.char .roche-lt-msg-bubble { background: var(--lt-char-msg); border: 1px solid var(--lt-border); border-bottom-left-radius: 4px; }

            .roche-lt-input-group { display: flex; flex-direction: column; gap: 10px; }
            .roche-lt-input-row { display: flex; gap: 10px; }
            .roche-lt-input-row input { flex: 1; padding: 12px 16px; border: 1px solid var(--lt-border); border-radius: 20px; outline: none; background: var(--lt-input-bg); font-size: 14px; color: var(--lt-text-main); transition: 0.2s; }
            .roche-lt-input-row input:focus { border-color: var(--lt-primary); }
            .roche-lt-chat-hint { font-size: 11px; color: var(--lt-text-sub); text-align: center; }

            .roche-lt-fab-back { position: fixed; bottom: 20px; left: 20px; background: var(--lt-panel); border: 1px solid var(--lt-border); color: var(--lt-text-sub); border-radius: 50%; width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); cursor: pointer; z-index: 1000; font-size: 20px; }
            
            .roche-lt-modal-bg { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); display: flex; justify-content: center; align-items: center; z-index: 2000; opacity: 0; pointer-events: none; transition: 0.3s; padding: 20px; }
            .roche-lt-modal-bg.show { opacity: 1; pointer-events: auto; }
            .roche-lt-modal { background: var(--lt-panel); padding: 24px; border-radius: 20px; width: 100%; max-width: 380px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transform: translateY(20px); transition: 0.3s; }
            .roche-lt-modal-bg.show .roche-lt-modal { transform: translateY(0); }
            
            .roche-lt-modal label { font-size: 13px; color: var(--lt-text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
            .roche-lt-modal input[type="text"], .roche-lt-modal input[type="password"], .roche-lt-modal input[type="number"], .roche-lt-modal textarea, .roche-lt-modal select { width: 100%; margin-bottom: 16px; padding: 12px; border: 1px solid var(--lt-border); border-radius: 12px; background: var(--lt-input-bg); font-size: 14px; color: var(--lt-text-main); outline: none; }
            .roche-lt-modal textarea { height: 90px; resize: none; font-family: inherit; }
            .roche-lt-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
            .roche-lt-delete-text { color: #d98888; font-size: 13px; align-self: center; cursor: pointer; margin-right: auto; }
            
            /* 复选框样式 */
            .roche-lt-checkbox-list { display: flex; flex-direction: column; gap: 8px; background: var(--lt-input-bg); padding: 12px; border-radius: 12px; overflow-y: auto; margin-bottom: 16px; }
            .roche-lt-checkbox-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--lt-text-main); cursor: pointer; }
            
            /* 气泡长按菜单 */
            .roche-lt-action-menu { position: absolute; z-index: 100; background: var(--lt-panel); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; top: 50%; transform: translateY(-50%); width: 100px;}
            .roche-lt-action-menu.user-menu { right: 105%; }
            .roche-lt-action-menu.char-menu { left: 105%; }
            .roche-lt-action-item { padding: 10px 15px; font-size: 13px; color: var(--lt-text-main); cursor: pointer; text-align: center; border-bottom: 1px solid var(--lt-border); }
            .roche-lt-action-item:last-child { border-bottom: none; }
            .roche-lt-action-item:hover { background: var(--lt-bg); }
            .roche-lt-action-item.danger { color: #d98888; }

            /* 新增：多选与重录工具栏样式 */
            .roche-lt-msg-checkbox { margin-right: 10px; width: 16px; height: 16px; accent-color: var(--lt-primary); flex-shrink: 0; display: none; margin-top: 20px;}
            .roche-lt-msg-wrap { display: flex; align-items: flex-start; width: 100%; }
            .roche-lt-msg-wrap.user { flex-direction: row-reverse; }
            .roche-lt-msg-wrap.user .roche-lt-msg-checkbox { margin-right: 0; margin-left: 10px; }
            .roche-lt-msg-wrap.show-checkbox .roche-lt-msg-checkbox { display: block; }
            .roche-lt-multiselect-bar { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: var(--lt-input-bg); border-radius: 12px; margin-bottom: 10px; }
            .roche-lt-bottom-tools { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; }
            .roche-lt-reroll-wrap { display: flex; align-items: center; gap: 5px; }
            
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .roche-lt-hidden { display: none !important; }
          `;
          document.head.appendChild(style);
        }

        // --- 2. 状态与数据管理 ---
        let prompts = (await roche.storage.get("prompts")) || [
          { id: "1", title: "雨天避雨", category: "日常", content: "一场突如其来的大雨，两人在屋檐下避雨的温馨时刻。" },
          { id: "2", title: "平行世界相遇", category: "科幻", content: "在赛博朋克设定的平行世界里，两人作为宿敌的初次交锋。" },
          { id: "3", title: "修罗场", category: "虐心", content: "原本约好的纪念日，却发生了误会。" }
        ];
        
        let savedCollections = (await roche.storage.get("collections")) || [];
        
        // [修改1.3] 剧场专属设定存储（升级为数组对象结构）
        let customWorldbooks = (await roche.storage.get("lt_custom_wbs")) || [];
        // 兼容老版本空壳的数据结构转换
        if (customWorldbooks.length > 0 && typeof customWorldbooks[0].keyword === 'undefined' && customWorldbooks[0].content) {
             customWorldbooks = [{ id: crypto.randomUUID(), keyword: "未命名专属设定", content: customWorldbooks[0].content }];
        }

        let settings = (await roche.storage.get("lt_settings")) || {
          theme: "default",
          wbCatIds: [],      // [修改1.2] 改为数组以支持多选分组
          wbEntryIds: [],    
          useCustomWb: false, 
          apiBase: "", 
          apiKey: "", 
          chatStyle: "mixed",
          memIncludeCore: true,
          memIncludeFacts: true,
          memIncludeChat: true,
          memChatLimit: 50
        };
        // 兼容老版本单选分组的升级
        if(settings.wbCatId && !settings.wbCatIds) { settings.wbCatIds = [settings.wbCatId]; }

        let characters = await roche.character.list();
        let conversations = await roche.conversation.list({ isGroup: false });
        let worldbookCategories = await roche.worldbook.list(); 
        
        let activePrompt = null;
        let vignetteText = "";
        let chatMessages = [];
        let isGenerating = false;
        let currentCollectionId = null; 
        
        let searchKeyword = "";
        let activeCategory = "全部";
        let activeMenuIndex = -1; // 当前激活的菜单索引
        
        // [修改2] 多选模式相关状态
        let isMultiSelectMode = false;
        let selectedMsgs = new Set();

        // --- 3. 初始结构渲染 ---
        container.innerHTML = `
          <div class="roche-lt-container roche-plugin-little-theater" id="lt-main-wrap">
            
            <div id="lt-back-btn" class="roche-lt-fab-back">←</div>

            <div class="roche-lt-topbar">
              <div class="roche-lt-tabs">
                <div id="tab-home" class="roche-lt-tab active">灵感创作</div>
                <div id="tab-col" class="roche-lt-tab">📚 收藏馆</div>
              </div>
              <div class="roche-lt-icons">
                <span id="lt-settings-btn" title="全局与世界书设置">⚙️</span>
              </div>
            </div>

            <div class="roche-lt-config-area" id="lt-config-area">
              
              <div class="roche-lt-select-group">
                <div class="roche-lt-select-wrapper">
                  <select id="lt-char-select">
                    <option value="" disabled selected>选择共读角色</option>
                    ${characters.map(c => `<option value="${c.id}">${c.name || c.handle}</option>`).join('')}
                  </select>
                </div>
                <div class="roche-lt-select-wrapper">
                  <select id="lt-conv-select">
                    <option value="" selected>不挂载记忆 (可选)</option>
                    ${conversations.map(c => `<option value="${c.id}">${c.name || c.title}</option>`).join('')}
                  </select>
                </div>
                <button id="lt-mem-config-btn" class="roche-lt-icon-btn" title="记忆挂载设置">🧠</button>
              </div>

              <div class="roche-lt-filter-bar">
                <input type="text" id="lt-search-input" class="roche-lt-search" placeholder="搜索小剧场灵感...">
                <div class="roche-lt-categories" id="lt-category-list"></div>
              </div>

              <div class="roche-lt-prompt-header">
                <span class="roche-lt-prompt-header-title">灵感图鉴 (长按编辑)</span>
                <div style="display:flex; gap:8px;">
                  <button id="lt-add-custom-wb-btn" class="roche-lt-btn-outline" style="border-color:#b1c2d4;">+ 专属设定</button>
                  <button id="lt-add-prompt-btn" class="roche-lt-btn-outline">+ 新增</button>
                </div>
              </div>
              
              <div class="roche-lt-prompt-scroll" id="lt-prompt-scroll"></div>
              
              <button id="lt-generate-btn" class="roche-lt-btn roche-lt-generate-btn" disabled>执笔生成</button>
            </div>

            <div class="roche-lt-collection-area hidden" id="lt-collection-area"></div>
            
            <div id="lt-theater-area" class="roche-lt-theater-area">
              <div class="roche-lt-theater-header">
                <span id="lt-vignette-title" class="roche-lt-theater-title">剧场内容</span>
                <div class="roche-lt-theater-tools">
                  <button id="lt-summary-btn" class="roche-lt-btn-outline" style="border-color:#b5929c; color:#b5929c;">📝 总结收录</button>
                  <button id="lt-save-theater-btn" class="roche-lt-btn-outline" style="border:none;">保存至收藏</button>
                  <button id="lt-fullscreen-btn" class="roche-lt-btn-outline">全屏</button>
                  <button id="lt-close-theater-btn" class="roche-lt-btn-outline" style="border:none; background:var(--lt-input-bg);">退出</button>
                </div>
              </div>
              
              <div class="roche-lt-theater-scroll" id="lt-theater-scroll">
                <div id="lt-vignette-content" class="roche-lt-vignette-content"></div>
                
                <div style="display:flex; gap:10px; margin-bottom: 5px; flex-shrink: 0;">
                  <button id="lt-continue-ai-btn" class="roche-lt-btn-outline" style="flex:1;">AI 延展</button>
                  <button id="lt-continue-co-btn" class="roche-lt-btn-outline" style="flex:1;">定向续写</button>
                </div>
                
                <div class="roche-lt-chat-box">
                  <div id="lt-multiselect-bar" class="roche-lt-multiselect-bar roche-lt-hidden">
                     <span style="font-size:13px;">已选择 <span id="lt-sel-count" style="color:var(--lt-primary); font-weight:bold;">0</span> 条</span>
                     <div style="display:flex; gap:8px;">
                        <button id="lt-del-sel-btn" class="roche-lt-btn-outline" style="color:#d98888; border-color:#d98888;">删除</button>
                        <button id="lt-exit-sel-btn" class="roche-lt-btn-outline">退出多选</button>
                     </div>
                  </div>
                  <div id="lt-chat-history" class="roche-lt-chat-history"></div>
                  
                  <div class="roche-lt-input-group">
                    <div class="roche-lt-chat-hint">提示：长按气泡【引用/撤回】 | 回车键发送至面板 | 点击【发给AI】触发回复</div>
                    <div class="roche-lt-input-row">
                      <input type="text" id="lt-chat-input" placeholder="输入探讨内容，按回车发送...">
                      <button id="lt-chat-send-btn" class="roche-lt-btn" style="padding: 10px 18px; border-radius: 18px;">发给AI</button>
                    </div>
                    <div class="roche-lt-bottom-tools">
                       <div class="roche-lt-reroll-wrap">
                          <button id="lt-reroll-bottom-btn" class="roche-lt-icon-btn" title="重Roll AI回复">🔄</button>
                       </div>
                       <button id="lt-toggle-sel-btn" class="roche-lt-btn-outline" style="border:none;">☑️ 多选</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div id="lt-modal-wrapper" class="roche-lt-modal-bg">
            <div class="roche-lt-modal" id="lt-modal-content"></div>
          </div>
        `;

        // --- 4. DOM 获取与初始化 ---
        const dom = {
          wrap: container.querySelector("#lt-main-wrap"),
          tabHome: container.querySelector("#tab-home"),
          tabCol: container.querySelector("#tab-col"),
          configArea: container.querySelector("#lt-config-area"),
          colArea: container.querySelector("#lt-collection-area"),
          searchInput: container.querySelector("#lt-search-input"),
          catList: container.querySelector("#lt-category-list"),
          promptScroll: container.querySelector("#lt-prompt-scroll"),
          generateBtn: container.querySelector("#lt-generate-btn"),
          charSelect: container.querySelector("#lt-char-select"),
          convSelect: container.querySelector("#lt-conv-select"),
          
          theaterArea: container.querySelector("#lt-theater-area"),
          theaterScroll: container.querySelector("#lt-theater-scroll"),
          vignetteContent: container.querySelector("#lt-vignette-content"),
          vignetteTitle: container.querySelector("#lt-vignette-title"),
          
          chatHistory: container.querySelector("#lt-chat-history"),
          chatInput: container.querySelector("#lt-chat-input"),
          multiSelectBar: container.querySelector("#lt-multiselect-bar"),
          selCount: container.querySelector("#lt-sel-count"),
          
          modalWrapper: container.querySelector("#lt-modal-wrapper"),
          modalContent: container.querySelector("#lt-modal-content")
        };

        function applyTheme() {
          dom.wrap.className = `roche-lt-container roche-plugin-little-theater theme-${settings.theme}`;
        }
        applyTheme();

        // 切换标签逻辑
        dom.tabHome.onclick = () => {
          dom.tabHome.classList.add('active'); dom.tabCol.classList.remove('active');
          dom.configArea.classList.remove('hidden'); dom.colArea.classList.add('hidden');
        };
        dom.tabCol.onclick = () => {
          dom.tabCol.classList.add('active'); dom.tabHome.classList.remove('active');
          dom.colArea.classList.remove('hidden'); dom.configArea.classList.add('hidden');
          renderCollection();
        };

        dom.wrap.addEventListener('click', (e) => {
          if (!e.target.closest('.roche-lt-action-menu') && !e.target.closest('.roche-lt-msg-bubble')) {
            activeMenuIndex = -1;
            renderChatHistory(); // 这个函数在下半部分定义
          }
        });

        // --- 5. 提示词与专属设定库 ---
        function updatePromptUI() {
          const cats = ["全部", ...new Set(prompts.map(p => p.category || "未分类"))];
          dom.catList.innerHTML = cats.map(c => 
            `<div class="roche-lt-cat-btn ${activeCategory === c ? 'active' : ''}" data-cat="${c}">${c}</div>`
          ).join('');
          dom.catList.querySelectorAll('.roche-lt-cat-btn').forEach(el => {
            el.onclick = () => { activeCategory = el.dataset.cat; updatePromptUI(); };
          });

          const filtered = prompts.filter(p => {
            const matchCat = activeCategory === "全部" || (p.category || "未分类") === activeCategory;
            const matchSearch = p.title.includes(searchKeyword) || p.content.includes(searchKeyword);
            return matchCat && matchSearch;
          });

          dom.promptScroll.innerHTML = filtered.map(p => `
            <div class="roche-lt-prompt-item ${activePrompt?.id === p.id ? 'active' : ''}" data-id="${p.id}">
              <div class="roche-lt-prompt-title">${p.title}</div>
              <div class="roche-lt-prompt-cat">${p.category || '未分类'}</div>
            </div>
          `).join('');

          dom.promptScroll.querySelectorAll('.roche-lt-prompt-item').forEach(el => {
            const pId = el.dataset.id;
            let timer, startX, isDrag = false;
            const startPress = () => timer = setTimeout(() => openPromptModal(pId), 600);
            const cancelPress = () => clearTimeout(timer);
            el.addEventListener('touchstart', (e) => { isDrag=false; startX=e.touches[0].clientX; startPress(); }, {passive:true});
            el.addEventListener('touchmove', (e) => { if(Math.abs(e.touches[0].clientX-startX)>10) { isDrag=true; cancelPress(); } }, {passive:true});
            el.addEventListener('touchend', () => { cancelPress(); if(!isDrag) selectPrompt(pId); });
            el.addEventListener('touchcancel', cancelPress);
            el.addEventListener('mousedown', (e) => { isDrag=false; startX=e.clientX; startPress(); });
            el.addEventListener('mousemove', (e) => { if(Math.abs(e.clientX-startX)>5) { isDrag=true; cancelPress(); } });
            el.addEventListener('mouseup', () => { cancelPress(); if(!isDrag) selectPrompt(pId); });
            el.addEventListener('mouseleave', cancelPress);
          });
        }
        dom.searchInput.oninput = (e) => { searchKeyword = e.target.value; updatePromptUI(); };
        function selectPrompt(id) {
          activePrompt = prompts.find(p => p.id === id);
          updatePromptUI();
          dom.generateBtn.disabled = !(activePrompt && dom.charSelect.value);
        }

        // [修改1.3] 剧场专属设定存储（增加列表与多条目管理）
        container.querySelector("#lt-add-custom-wb-btn").onclick = () => {
          const renderCWList = () => {
             dom.modalContent.innerHTML = `
              <h3 style="margin:0 0 15px 0;">剧场专属世界书</h3>
              <span style="font-size:12px; color:var(--lt-text-sub); display:block; margin-bottom:8px;">这里的设定只在小剧场内生效，不会污染全局世界书。</span>
              <div class="roche-lt-checkbox-list" style="max-height:200px;">
                ${customWorldbooks.length === 0 ? '<div style="font-size:12px;text-align:center;color:var(--lt-text-sub);padding:10px;">暂无专属设定</div>' : ''}
                ${customWorldbooks.map((cw, idx) => `
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--lt-border);">
                    <span style="font-size:13px; font-weight:500;">${cw.keyword || '未命名'}</span>
                    <div style="display:flex; gap:5px;">
                      <button class="roche-lt-btn-outline cw-edit-btn" data-idx="${idx}" style="padding:4px 10px; font-size:11px;">编辑</button>
                      <button class="roche-lt-btn-outline cw-del-btn" data-idx="${idx}" style="padding:4px 10px; font-size:11px; color:#d98888; border-color:#d98888;">删除</button>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="roche-lt-modal-actions">
                <button id="cw-add-new" class="roche-lt-btn-outline">+ 新增条目</button>
                <button id="cw-close" class="roche-lt-btn">关闭</button>
              </div>
            `;
            dom.modalWrapper.classList.add("show");
            
            document.getElementById('cw-close').onclick = () => dom.modalWrapper.classList.remove("show");
            document.getElementById('cw-add-new').onclick = () => openCWEditor(-1);
            
            dom.modalContent.querySelectorAll('.cw-edit-btn').forEach(btn => {
                btn.onclick = (e) => openCWEditor(parseInt(e.target.dataset.idx));
            });
            dom.modalContent.querySelectorAll('.cw-del-btn').forEach(btn => {
                btn.onclick = async (e) => {
                    customWorldbooks.splice(parseInt(e.target.dataset.idx), 1);
                    await roche.storage.set("lt_custom_wbs", customWorldbooks);
                    renderCWList();
                };
            });
          };

          const openCWEditor = (idx) => {
             const cw = idx >= 0 ? customWorldbooks[idx] : { keyword: '', content: '' };
             dom.modalContent.innerHTML = `
                <h3 style="margin:0 0 15px 0;">${idx >= 0 ? '编辑' : '新增'}专属设定</h3>
                <input type="text" id="cw-keyword" placeholder="关键词/条目名称" value="${cw.keyword}">
                <textarea id="cw-content" placeholder="设定内容..." style="height:150px;">${cw.content}</textarea>
                <div class="roche-lt-modal-actions">
                  <button id="cw-editor-cancel" class="roche-lt-btn-outline">返回列表</button>
                  <button id="cw-editor-save" class="roche-lt-btn">保存条目</button>
                </div>
             `;
             document.getElementById('cw-editor-cancel').onclick = renderCWList;
             document.getElementById('cw-editor-save').onclick = async () => {
                 const kw = document.getElementById('cw-keyword').value.trim();
                 const ct = document.getElementById('cw-content').value.trim();
                 if(!kw) return roche.ui.toast("请输入关键词");
                 if(idx >= 0) { customWorldbooks[idx] = { keyword: kw, content: ct }; }
                 else { customWorldbooks.unshift({ id: crypto.randomUUID(), keyword: kw, content: ct }); }
                 await roche.storage.set("lt_custom_wbs", customWorldbooks);
                 renderCWList();
             };
          };

          renderCWList();
        };

        // --- 6. 模态框 (提示词 / 设置 / 记忆 / 总结) ---
        function openPromptModal(editId = null) {
          const p = editId ? prompts.find(pr => pr.id === editId) : { title:'', category:'', content:'' };
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">${editId ? '修改' : '创作'}灵感</h3>
            <input type="text" id="m-title" placeholder="标题" value="${p.title}">
            <input type="text" id="m-cat" placeholder="分类标签" value="${p.category}">
            <textarea id="m-content" placeholder="剧情设定...">${p.content}</textarea>
            <div class="roche-lt-modal-actions">
              ${editId ? `<span id="m-del" class="roche-lt-delete-text">删除</span>` : ''}
              <button id="m-cancel" class="roche-lt-btn-outline">取消</button>
              <button id="m-save" class="roche-lt-btn" style="padding: 8px 20px;">保存</button>
            </div>
          `;
          dom.modalWrapper.classList.add("show");
          document.getElementById('m-cancel').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('m-save').onclick = async () => {
            const t = document.getElementById('m-title').value.trim();
            if(!t) return roche.ui.toast("请输入标题");
            const newData = { title: t, category: document.getElementById('m-cat').value.trim()||"未分类", content: document.getElementById('m-content').value.trim() };
            if (editId) Object.assign(prompts.find(pr => pr.id === editId), newData);
            else prompts.unshift({ id: crypto.randomUUID(), ...newData });
            await roche.storage.set("prompts", prompts);
            dom.modalWrapper.classList.remove("show");
            updatePromptUI();
          };
          if(editId) document.getElementById('m-del').onclick = async () => {
            prompts = prompts.filter(pr => pr.id !== editId);
            if(activePrompt?.id === editId) activePrompt = null;
            await roche.storage.set("prompts", prompts);
            dom.modalWrapper.classList.remove("show");
            updatePromptUI();
          };
        }
        container.querySelector("#lt-add-prompt-btn").onclick = () => openPromptModal();

        container.querySelector("#lt-mem-config-btn").onclick = () => {
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">记忆挂载偏好 (当前角色)</h3>
            <label style="cursor:pointer;"><input type="checkbox" id="c-core" ${settings.memIncludeCore ? 'checked' : ''}> 挂载「核心记忆 (Core)」</label>
            <label style="cursor:pointer;"><input type="checkbox" id="c-fact" ${settings.memIncludeFacts ? 'checked' : ''}> 挂载「事实记忆 (Facts)」</label>
            <label style="cursor:pointer;"><input type="checkbox" id="c-chat" ${settings.memIncludeChat ? 'checked' : ''}> 挂载「近期聊天记录」</label>
            
            <div style="margin-top: 15px;">
              <span style="font-size:12px; color:var(--lt-text-sub);">聊天记录抽取条数 (1-100)</span>
              <input type="number" id="c-limit" value="${settings.memChatLimit}" min="1" max="100" style="margin-bottom:0; margin-top:5px;">
            </div>

            <div class="roche-lt-modal-actions" style="margin-top: 20px;">
              <button id="c-close" class="roche-lt-btn-outline">取消</button>
              <button id="c-save" class="roche-lt-btn" style="padding: 8px 20px;">保存</button>
            </div>
          `;
          dom.modalWrapper.classList.add("show");
          
          document.getElementById('c-close').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('c-save').onclick = async () => {
            settings.memIncludeCore = document.getElementById('c-core').checked;
            settings.memIncludeFacts = document.getElementById('c-fact').checked;
            settings.memIncludeChat = document.getElementById('c-chat').checked;
            let limitVal = parseInt(document.getElementById('c-limit').value);
            if(isNaN(limitVal) || limitVal < 1) limitVal = 50;
            if(limitVal > 100) limitVal = 100;
            settings.memChatLimit = limitVal;
            
            await roche.storage.set("lt_settings", settings);
            dom.modalWrapper.classList.remove("show");
            roche.ui.toast("记忆偏好已保存");
          };
        };

        // [修改1.1 & 1.2]：修复名称解析 + 多选分组列表
        container.querySelector("#lt-settings-btn").onclick = async () => {
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">剧场全局设置</h3>
            
            <span style="font-size:12px; color:var(--lt-text-sub);">UI 主题</span>
            <select id="s-theme">
              <option value="default" ${settings.theme==='default'?'selected':''}>莫兰迪浅蓝 (默认)</option>
              <option value="pink" ${settings.theme==='pink'?'selected':''}>樱花粉</option>
              <option value="dark" ${settings.theme==='dark'?'selected':''}>暗夜蓝 (深色)</option>
            </select>
            
            <span style="font-size:12px; color:var(--lt-text-sub);">挂载全局世界书分组 (可多选)</span>
            <div class="roche-lt-checkbox-list" style="max-height: 120px; padding: 10px;">
               ${worldbookCategories.map(w => `
                  <label class="roche-lt-checkbox-item">
                    <input type="checkbox" class="wb-cat-checkbox" value="${w.id}" ${(settings.wbCatIds||[]).includes(w.id)?'checked':''}>
                    ${w.name}
                  </label>
               `).join('')}
            </div>
            
            <div id="wb-entries-wrapper">
              <span style="font-size:12px; color:var(--lt-text-sub); display:flex; justify-content:space-between;">
                挂载具体词条 (可多选)
                <span id="s-wb-select-all" style="cursor:pointer; color:var(--lt-primary);">全选/反选</span>
              </span>
              <div id="s-wb-entries-list" class="roche-lt-checkbox-list" style="max-height: 150px;"></div>
            </div>

            <label style="cursor:pointer; margin-top: 10px;">
              <input type="checkbox" id="s-use-custom" ${settings.useCustomWb ? 'checked' : ''}> 挂载「剧场专属设定」
            </label>
            
            <span style="font-size:12px; color:var(--lt-text-sub);">角色对话模式</span>
            <select id="s-style">
              <option value="mixed" ${settings.chatStyle==='mixed'?'selected':''}>对话 + 动作/心理描写</option>
              <option value="pure" ${settings.chatStyle==='pure'?'selected':''}>纯对话 (仅口语)</option>
            </select>
            
            <div class="roche-lt-modal-actions">
              <button id="s-close" class="roche-lt-btn-outline">取消</button>
              <button id="s-save" class="roche-lt-btn" style="padding: 8px 20px;">保存</button>
            </div>
          `;
          dom.modalWrapper.classList.add("show");

          const entriesList = document.getElementById('s-wb-entries-list');
          let currentEntries = [];
          
          const loadEntries = async () => {
            const selectedCats = Array.from(document.querySelectorAll('.wb-cat-checkbox:checked')).map(cb => cb.value);
            if(selectedCats.length === 0) {
                entriesList.innerHTML = `<div style="text-align:center; color:var(--lt-text-sub); font-size:12px;">请先选择分组</div>`;
                return;
            }
            entriesList.innerHTML = `<div style="text-align:center; color:var(--lt-text-sub); font-size:12px;">加载中...</div>`;
            try {
              currentEntries = [];
              for(const catId of selectedCats) {
                 const res = await roche.worldbook.getEntries({ categoryId: catId, scope: "global" });
                 currentEntries = currentEntries.concat(res);
              }
              
              if(currentEntries.length === 0) {
                entriesList.innerHTML = `<div style="text-align:center; color:var(--lt-text-sub); font-size:12px;">选中分组下暂无词条</div>`;
                return;
              }
              entriesList.innerHTML = currentEntries.map(e => {
                // [修改1.1] 完美解析各种情况的词条名称
                let displayName = e.keyword || e.name || (e.keys && e.keys.join(', ')) || e.id;
                if (displayName.startsWith('entry_') || /^[0-9]+$/.test(displayName) || !displayName) {
                    displayName = e.content ? e.content.substring(0, 15) + '...' : '未命名词条';
                }
                const isChecked = (settings.wbEntryIds||[]).includes(e.id);
                return `
                  <label class="roche-lt-checkbox-item">
                    <input type="checkbox" class="wb-entry-checkbox" value="${e.id}" ${isChecked ? 'checked' : ''}>
                    ${displayName}
                  </label>
                `;
              }).join('');
            } catch(e) { console.error("加载词条失败", e); entriesList.innerHTML = "加载失败"; }
          };

          await loadEntries();

          document.querySelectorAll('.wb-cat-checkbox').forEach(cb => {
              cb.onchange = () => { loadEntries(); };
          });

          document.getElementById('s-wb-select-all').onclick = () => {
             const boxes = document.querySelectorAll('.wb-entry-checkbox');
             const allChecked = Array.from(boxes).every(b => b.checked);
             boxes.forEach(b => b.checked = !allChecked);
          };
          
          document.getElementById('s-close').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('s-save').onclick = async () => {
            settings.theme = document.getElementById('s-theme').value;
            settings.wbCatIds = Array.from(document.querySelectorAll('.wb-cat-checkbox:checked')).map(cb => cb.value);
            settings.useCustomWb = document.getElementById('s-use-custom').checked;
            
            const checkedBoxes = document.querySelectorAll('.wb-entry-checkbox:checked');
            settings.wbEntryIds = Array.from(checkedBoxes).map(b => b.value);
            
            settings.chatStyle = document.getElementById('s-style').value;
            await roche.storage.set("lt_settings", settings);
            applyTheme();
            dom.modalWrapper.classList.remove("show");
            roche.ui.toast("设置已保存");
          };
        };
        // --- 7. 收藏夹管理 ---
        function renderCollection() {
          if (savedCollections.length === 0) {
            dom.colArea.innerHTML = `<div style="text-align:center; color:var(--lt-text-sub); margin-top: 50px;">暂无收藏剧场，快去创作吧~</div>`;
            return;
          }
          dom.colArea.innerHTML = savedCollections.map(c => `
            <div class="roche-lt-col-item" data-id="${c.id}">
              <div style="display:flex; justify-content:space-between;">
                <div class="roche-lt-col-title">${c.title}</div>
                <div class="roche-lt-delete-text col-del-btn" data-id="${c.id}">删除</div>
              </div>
              <div class="roche-lt-col-desc">${c.content}</div>
              <div class="roche-lt-col-meta">${c.date} | ${c.charName}</div>
            </div>
          `).join('');

          dom.colArea.querySelectorAll('.roche-lt-col-item').forEach(el => {
            el.onclick = (e) => {
              if(e.target.classList.contains('col-del-btn')) return;
              const c = savedCollections.find(sc => sc.id === el.dataset.id);
              if (c) openTheater(c.title, c.content, c.chat, c.charId, c.id);
            };
          });

          dom.colArea.querySelectorAll('.col-del-btn').forEach(btn => {
            btn.onclick = async (e) => {
              savedCollections = savedCollections.filter(sc => sc.id !== e.target.dataset.id);
              await roche.storage.set("collections", savedCollections);
              renderCollection();
            };
          });
        }

        // --- 8. 生成剧场内容 ---
        dom.generateBtn.onclick = async () => {
          const charId = dom.charSelect.value;
          if (!activePrompt || !charId) return roche.ui.toast("请选择角色和灵感");
          
          isGenerating = true;
          dom.generateBtn.disabled = true;
          dom.generateBtn.textContent = "正在构建世界观...";

          try {
            const char = await roche.character.get(charId);
            
            // 组装系统 Prompt (包含记忆与世界书)
            let systemPrompt = `你现在是一位天才小说家，请根据以下设定，撰写一段约 300-500 字的沉浸式场景开场白（第三人称叙事）。\n\n【角色设定】\n姓名：${char.name}\n${char.description || ''}\n\n【核心剧情/灵感】\n${activePrompt.content}\n\n`;
            
            // [修改1.3] 注入剧场专属世界书
            if (settings.useCustomWb && customWorldbooks && customWorldbooks.length > 0) {
               systemPrompt += `【剧场专属设定】\n`;
               customWorldbooks.forEach(cw => {
                   systemPrompt += `- ${cw.keyword}: ${cw.content}\n`;
               });
               systemPrompt += `\n`;
            }

            // 挂载全局世界书词条
            if (settings.wbEntryIds && settings.wbEntryIds.length > 0) {
               systemPrompt += `【世界观补充】\n`;
               for (const eid of settings.wbEntryIds) {
                   try {
                     const entry = await roche.worldbook.getEntry(eid);
                     if(entry && entry.content) systemPrompt += `- ${entry.content}\n`;
                   } catch(e) {}
               }
               systemPrompt += `\n`;
            }

            // 挂载长期/短期记忆
            const convId = dom.convSelect.value;
            if (convId) {
                systemPrompt += `【历史记忆参考】\n`;
                if (settings.memIncludeCore || settings.memIncludeFacts) {
                   const mems = await roche.memory.get(convId);
                   if (settings.memIncludeCore && mems.core) systemPrompt += `核心记忆：${mems.core}\n`;
                   if (settings.memIncludeFacts && mems.facts) systemPrompt += `重要事实：${mems.facts}\n`;
                }
                if (settings.memIncludeChat) {
                   const msgs = await roche.conversation.getMessages(convId, { limit: settings.memChatLimit });
                   if (msgs && msgs.length > 0) {
                       systemPrompt += `近期聊天摘要参考：\n`;
                       msgs.forEach(m => systemPrompt += `${m.role === 'user' ? '我' : char.name}: ${m.content.substring(0, 50)}...\n`);
                   }
                }
                systemPrompt += `\n`;
            }

            systemPrompt += `【要求】文笔优美，情感细腻，只需输出场景描写，不要让角色说话，将氛围烘托到极致，等待后续互动。`;

            // 调用 AI 生成 (根据具体宿主环境 API 调整)
            const response = await roche.ai.chat({
              messages: [{ role: "user", content: systemPrompt }]
            });

            const content = response.content || response;
            openTheater(activePrompt.title, content, [], charId, null);
            
          } catch (error) {
            console.error("生成失败", error);
            roche.ui.toast("生成失败，请检查 API 设置或网络");
          } finally {
            isGenerating = false;
            dom.generateBtn.disabled = false;
            dom.generateBtn.textContent = "执笔生成";
          }
        };

        // --- 9. 剧场界面交互 ---
        function openTheater(title, content, chat = [], charId, collectionId = null) {
          dom.vignetteTitle.textContent = title;
          dom.vignetteContent.textContent = content;
          vignetteText = content;
          chatMessages = chat;
          dom.charSelect.value = charId;
          currentCollectionId = collectionId;
          
          isMultiSelectMode = false;
          selectedMsgs.clear();
          dom.multiSelectBar.classList.add('roche-lt-hidden');
          
          renderChatHistory();
          dom.theaterArea.classList.add("active");
        }

        container.querySelector("#lt-close-theater-btn").onclick = () => {
          dom.theaterArea.classList.remove("active");
          dom.theaterArea.classList.remove("fullscreen");
        };
        
        container.querySelector("#lt-fullscreen-btn").onclick = () => {
          dom.theaterArea.classList.toggle("fullscreen");
        };

        // --- 10. 长按菜单与聊天记录渲染 ---
        function renderChatHistory() {
          dom.chatHistory.innerHTML = chatMessages.map((msg, index) => `
            <div class="roche-lt-msg-wrap ${msg.role === 'user' ? 'user' : 'char'} ${isMultiSelectMode ? 'show-checkbox' : ''}">
               <input type="checkbox" class="roche-lt-msg-checkbox" data-idx="${index}" ${selectedMsgs.has(index) ? 'checked' : ''}>
               <div class="roche-lt-msg ${msg.role === 'user' ? 'user' : 'char'}" data-index="${index}">
                 ${msg.role !== 'user' ? `<div class="roche-lt-msg-name">${msg.name || '角色'}</div>` : ''}
                 <div class="roche-lt-msg-bubble">${msg.content}</div>
                 ${activeMenuIndex === index ? `
                   <div class="roche-lt-action-menu ${msg.role === 'user' ? 'user-menu' : 'char-menu'}">
                     <div class="roche-lt-action-item action-quote">引用回复</div>
                     <div class="roche-lt-action-item action-copy">复制文本</div>
                     <div class="roche-lt-action-item danger action-delete">撤回/删除</div>
                   </div>
                 ` : ''}
               </div>
            </div>
          `).join('');

          // 绑定多选复选框事件
          dom.chatHistory.querySelectorAll('.roche-lt-msg-checkbox').forEach(cb => {
             cb.onchange = (e) => {
                const idx = parseInt(e.target.dataset.idx);
                if (e.target.checked) selectedMsgs.add(idx);
                else selectedMsgs.delete(idx);
                dom.selCount.textContent = selectedMsgs.size;
             };
          });

          // 长按气泡事件
          dom.chatHistory.querySelectorAll('.roche-lt-msg').forEach(el => {
            const index = parseInt(el.dataset.index);
            let timer, startX, isDrag = false;
            
            const startPress = () => timer = setTimeout(() => {
              if (isMultiSelectMode) return; 
              activeMenuIndex = index;
              renderChatHistory();
            }, 500);
            
            const cancelPress = () => clearTimeout(timer);
            
            el.addEventListener('touchstart', (e) => { isDrag=false; startX=e.touches[0].clientX; startPress(); }, {passive:true});
            el.addEventListener('touchmove', (e) => { if(Math.abs(e.touches[0].clientX-startX)>10) { isDrag=true; cancelPress(); } }, {passive:true});
            el.addEventListener('touchend', cancelPress);
            el.addEventListener('mousedown', (e) => { isDrag=false; startX=e.clientX; startPress(); });
            el.addEventListener('mousemove', (e) => { if(Math.abs(e.clientX-startX)>5) { isDrag=true; cancelPress(); } });
            el.addEventListener('mouseup', cancelPress);
            el.addEventListener('mouseleave', cancelPress);
          });

          // 绑定菜单按钮事件
          if (activeMenuIndex !== -1) {
            const menu = dom.chatHistory.querySelector('.roche-lt-action-menu');
            if (menu) {
              const msg = chatMessages[activeMenuIndex];
              menu.querySelector('.action-quote').onclick = (e) => {
                e.stopPropagation();
                dom.chatInput.value = `「${msg.content.substring(0, 15)}...」\n`;
                dom.chatInput.focus();
                activeMenuIndex = -1; renderChatHistory();
              };
              menu.querySelector('.action-copy').onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(msg.content);
                roche.ui.toast("已复制");
                activeMenuIndex = -1; renderChatHistory();
              };
              menu.querySelector('.action-delete').onclick = (e) => {
                e.stopPropagation();
                chatMessages.splice(activeMenuIndex, 1);
                activeMenuIndex = -1; renderChatHistory();
                autoSaveCurrent();
              };
            }
          }
          
          setTimeout(() => dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight, 50);
        }

        // [修改2] 多选工具栏操作
        container.querySelector("#lt-toggle-sel-btn").onclick = () => {
           isMultiSelectMode = true;
           selectedMsgs.clear();
           dom.selCount.textContent = 0;
           dom.multiSelectBar.classList.remove('roche-lt-hidden');
           activeMenuIndex = -1;
           renderChatHistory();
        };
        container.querySelector("#lt-exit-sel-btn").onclick = () => {
           isMultiSelectMode = false;
           dom.multiSelectBar.classList.add('roche-lt-hidden');
           renderChatHistory();
        };
        container.querySelector("#lt-del-sel-btn").onclick = () => {
           if (selectedMsgs.size === 0) return roche.ui.toast("未选择任何消息");
           const indexesToRemove = Array.from(selectedMsgs).sort((a,b) => b - a);
           indexesToRemove.forEach(idx => chatMessages.splice(idx, 1));
           
           isMultiSelectMode = false;
           dom.multiSelectBar.classList.add('roche-lt-hidden');
           renderChatHistory();
           autoSaveCurrent();
           roche.ui.toast("已批量删除");
        };

        // --- 11. 发送消息与对话 AI ---
        const handleSend = async (customText = null, isReroll = false) => {
          if (isGenerating) return;
          const text = customText !== null ? customText : dom.chatInput.value.trim();
          if (!text && !isReroll) return;

          if (!isReroll && customText === null) {
            chatMessages.push({ role: 'user', content: text });
            dom.chatInput.value = "";
            renderChatHistory();
          }

          isGenerating = true;
          container.querySelector("#lt-chat-send-btn").disabled = true;
          
          try {
            const char = await roche.character.get(dom.charSelect.value);
            
            // 构建上下文
            const aiMessages = [];
            let sys = `你现在正在扮演角色：${char.name}。\n`;
            sys += `【剧场背景与初始场景】\n${vignetteText}\n\n`;
            
            if (settings.chatStyle === 'pure') {
                sys += `【格式要求】请仅输出角色的语言对话，不要包含任何星号、动作描写、心理描写等旁白，直接说话。`;
            } else {
                sys += `【格式要求】请结合生动的动作、神态描写与对话进行回复。`;
            }
            
            aiMessages.push({ role: "system", content: sys });
            
            chatMessages.forEach(m => {
               aiMessages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content });
            });

            // 如果是重Roll，加上特定提示
            if (isReroll) {
                aiMessages.push({ role: "user", content: "(OOC: 请换一种方式/态度重新回复我上一句话)" });
            }

            const response = await roche.ai.chat({ messages: aiMessages });
            const reply = response.content || response;
            
            chatMessages.push({ role: 'char', name: char.name, content: reply });
            renderChatHistory();
            autoSaveCurrent();
            
          } catch (error) {
            console.error("对话失败", error);
            roche.ui.toast("对话失败，请检查网络");
          } finally {
            isGenerating = false;
            container.querySelector("#lt-chat-send-btn").disabled = false;
          }
        };

        container.querySelector("#lt-chat-send-btn").onclick = () => handleSend();
        dom.chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') handleSend();
        });

        // 底部重Roll小按钮
        container.querySelector("#lt-reroll-bottom-btn").onclick = () => {
           if (chatMessages.length === 0) return roche.ui.toast("没有可重Roll的记录");
           if (chatMessages[chatMessages.length - 1].role === 'char') {
               chatMessages.pop(); // 移除最后一条 AI 回复
               renderChatHistory();
               handleSend(null, true);
           } else {
               handleSend(null, true);
           }
        };

        // 按钮续写工具
        container.querySelector("#lt-continue-ai-btn").onclick = () => handleSend("(请根据当前氛围，推动剧情发展，直接描写你的行动或话语)");
        container.querySelector("#lt-continue-co-btn").onclick = () => {
          dom.chatInput.value = "(OOC: 接下来的剧情，我希望你...)";
          dom.chatInput.focus();
        };

        // --- 12. 保存与收录功能 ---
        async function autoSaveCurrent() {
          if (currentCollectionId) {
            const idx = savedCollections.findIndex(c => c.id === currentCollectionId);
            if (idx > -1) {
              savedCollections[idx].chat = [...chatMessages];
              await roche.storage.set("collections", savedCollections);
            }
          }
        }

        container.querySelector("#lt-save-theater-btn").onclick = async () => {
          if (currentCollectionId) return roche.ui.toast("已在收藏夹中，进度会自动保存");
          const char = await roche.character.get(dom.charSelect.value);
          const newCol = {
            id: crypto.randomUUID(),
            title: activePrompt.title,
            content: vignetteText,
            chat: [...chatMessages],
            charName: char.name,
            charId: char.id,
            date: new Date().toLocaleDateString()
          };
          savedCollections.unshift(newCol);
          currentCollectionId = newCol.id;
          await roche.storage.set("collections", savedCollections);
          roche.ui.toast("已加入剧场收藏馆！");
        };

        container.querySelector("#lt-summary-btn").onclick = async () => {
           if (chatMessages.length < 2) return roche.ui.toast("聊天内容太少，无需总结");
           dom.modalContent.innerHTML = `
              <h3 style="margin:0 0 15px 0;">生成剧场记忆总结</h3>
              <p style="font-size:13px; color:var(--lt-text-sub);">将当前的剧情发展提炼为记忆，存入全局设定或角色的记忆库中。</p>
              <textarea id="sum-result" placeholder="正在生成总结..." style="height:120px;" readonly></textarea>
              <div class="roche-lt-modal-actions">
                <button id="sum-close" class="roche-lt-btn-outline">取消</button>
                <button id="sum-save" class="roche-lt-btn" disabled>保存至长期记忆</button>
              </div>
           `;
           dom.modalWrapper.classList.add("show");
           document.getElementById('sum-close').onclick = () => dom.modalWrapper.classList.remove("show");
           
           try {
             let chatText = chatMessages.map(m => `${m.role === 'user' ? '我' : '角色'}: ${m.content}`).join('\n');
             const res = await roche.ai.chat({
               messages: [{
                 role: "user",
                 content: `请用第三人称，简明扼要地总结以下剧情发展（控制在 100 字以内），提取关键事实，适合作为记忆片段保存：\n\n【开场】\n${vignetteText}\n\n【发展】\n${chatText}`
               }]
             });
             const summary = res.content || res;
             document.getElementById('sum-result').value = summary;
             document.getElementById('sum-result').removeAttribute('readonly');
             document.getElementById('sum-save').disabled = false;
             
             document.getElementById('sum-save').onclick = async () => {
                const finalSum = document.getElementById('sum-result').value;
                if(dom.convSelect.value) {
                    await roche.memory.update(dom.convSelect.value, { facts: finalSum }, { append: true });
                    roche.ui.toast("已追加至对话事实记忆！");
                } else {
                    roche.ui.toast("总结成功，已复制到剪贴板，可手动粘贴。");
                    navigator.clipboard.writeText(finalSum);
                }
                dom.modalWrapper.classList.remove("show");
             };
           } catch(e) {
             document.getElementById('sum-result').value = "总结失败，请重试。";
           }
        };

        // 返回按钮逻辑 (隐藏面板，显示悬浮球)
        const backBtn = container.querySelector("#lt-back-btn");
        backBtn.onclick = () => {
            roche.ui.closeApp("little-theater-app"); // 假设 Roche 有关闭当前 App 视图的 API
        };

        // 初始化更新 UI
        updatePromptUI();
      }
    }
  ]
});

