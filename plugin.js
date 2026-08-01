window.RochePlugin.register({
  id: "roche-plugin-little-theater",
  name: "小剧场 Pro Max",
  version: "1.3.0",
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
              --lt-bg: #f5f7fa;
              --lt-panel: #fff;
              --lt-text-main: #4a5560;
              --lt-text-sub: #8a9ea8;
              --lt-primary: #b1c2d4;
              --lt-primary-hover: #9db2c7;
              --lt-input-bg: #eef2f6;
              --lt-border: #eef2f6;
              --lt-user-msg: #d0dce8;
              --lt-char-msg: #fff;
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
            .roche-lt-msg.pending { opacity: 0.6; }
            .roche-lt-msg.pending .roche-lt-msg-bubble { border: 1px dashed var(--lt-primary); }

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
            .roche-lt-checkbox-list { display: flex; flex-direction: column; gap: 8px; background: var(--lt-input-bg); padding: 12px; border-radius: 12px; max-height: 150px; overflow-y: auto; margin-bottom: 16px; }
            .roche-lt-checkbox-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--lt-text-main); cursor: pointer; }
            
            /* 气泡长按菜单 */
            .roche-lt-action-menu { position: absolute; z-index: 100; background: var(--lt-panel); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; top: 50%; transform: translateY(-50%); width: 100px;}
            .roche-lt-action-menu.user-menu { right: 105%; }
            .roche-lt-action-menu.char-menu { left: 105%; }
            .roche-lt-action-item { padding: 10px 15px; font-size: 13px; color: var(--lt-text-main); cursor: pointer; text-align: center; border-bottom: 1px solid var(--lt-border); }
            .roche-lt-action-item:last-child { border-bottom: none; }
            .roche-lt-action-item:hover { background: var(--lt-bg); }
            .roche-lt-action-item.danger { color: #d98888; }
            
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
        
        // [修复] 新增专属世界书存储
        let customWorldbooks = (await roche.storage.get("lt_custom_wbs")) || [];

        let settings = (await roche.storage.get("lt_settings")) || {
          theme: "default",
          wbCatId: "",     
          wbEntryIds: [],   // [修复] 改为数组支持多选
          useCustomWb: false, // 启用剧场专属世界书
          apiBase: "", 
          apiKey: "", 
          chatStyle: "mixed",
          memIncludeCore: true,
          memIncludeFacts: true,
          memIncludeChat: true,
          memChatLimit: 50
        };

        let characters = await roche.character.list();
        let conversations = await roche.conversation.list({ isGroup: false });
        let worldbookCategories = await roche.worldbook.list(); 
        
        let activePrompt = null;
        let vignetteText = "";
        let chatMessages = [];
        let pendingUserMsgs = [];
        let isGenerating = false;
        let currentCollectionId = null; 
        
        let searchKeyword = "";
        let activeCategory = "全部";
        let activeMenuIndex = -1; // 当前激活的菜单索引

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
                  <div id="lt-chat-history" class="roche-lt-chat-history"></div>
                  
                  <div class="roche-lt-input-group">
                    <div class="roche-lt-chat-hint">提示：长按对话气泡可【引用/撤回/重Roll】</div>
                    <div class="roche-lt-input-row">
                      <input type="text" id="lt-chat-input" placeholder="输入探讨内容，按回车发送...">
                      <button id="lt-chat-send-btn" class="roche-lt-btn" style="padding: 10px 18px; border-radius: 18px;">发送</button>
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

        // --- 点击外部关闭聊天长按菜单 ---
        dom.wrap.addEventListener('click', (e) => {
          if (!e.target.closest('.roche-lt-action-menu') && !e.target.closest('.roche-lt-msg-bubble')) {
            activeMenuIndex = -1;
            renderChatHistory();
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

        // [增强] 剧场专属设定存储
        container.querySelector("#lt-add-custom-wb-btn").onclick = () => {
          const wbText = customWorldbooks.length > 0 ? customWorldbooks[0].content : "";
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">剧场专属世界书 (独立存储)</h3>
            <span style="font-size:12px; color:var(--lt-text-sub); display:block; margin-bottom:8px;">这里的设定只在小剧场内生效，不会污染全局世界书。</span>
            <textarea id="cw-content" placeholder="输入剧场共用的背景设定、限制等..." style="height:150px;">${wbText}</textarea>
            <div class="roche-lt-modal-actions">
              <button id="cw-cancel" class="roche-lt-btn-outline">取消</button>
              <button id="cw-save" class="roche-lt-btn" style="padding: 8px 20px;">保存设定</button>
            </div>
          `;
          dom.modalWrapper.classList.add("show");
          document.getElementById('cw-cancel').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('cw-save').onclick = async () => {
            const content = document.getElementById('cw-content').value.trim();
            if(content) customWorldbooks = [{ id: 'cw_1', content }];
            else customWorldbooks = [];
            await roche.storage.set("lt_custom_wbs", customWorldbooks);
            dom.modalWrapper.classList.remove("show");
            roche.ui.toast("专属设定已保存");
          };
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

        // [修复]：世界书精确选择 - 修复命名展示与多选Bug
        container.querySelector("#lt-settings-btn").onclick = async () => {
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">剧场全局设置</h3>
            
            <span style="font-size:12px; color:var(--lt-text-sub);">UI 主题</span>
            <select id="s-theme">
              <option value="default" ${settings.theme==='default'?'selected':''}>莫兰迪浅蓝 (默认)</option>
              <option value="pink" ${settings.theme==='pink'?'selected':''}>樱花粉</option>
              <option value="dark" ${settings.theme==='dark'?'selected':''}>暗夜蓝 (深色)</option>
            </select>
            
            <span style="font-size:12px; color:var(--lt-text-sub);">挂载全局世界书分类</span>
            <select id="s-wb-cat">
              <option value="">不挂载 / 忽略世界书</option>
              ${worldbookCategories.map(w => `<option value="${w.id}" ${settings.wbCatId===w.id?'selected':''}>${w.name}</option>`).join('')}
            </select>
            
            <div id="wb-entries-wrapper" style="${settings.wbCatId ? '' : 'display:none;'}">
              <span style="font-size:12px; color:var(--lt-text-sub); display:flex; justify-content:space-between;">
                挂载具体词条 (可多选)
                <span id="s-wb-select-all" style="cursor:pointer; color:var(--lt-primary);">全选/反选</span>
              </span>
              <div id="s-wb-entries-list" class="roche-lt-checkbox-list"></div>
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

          const catSelect = document.getElementById('s-wb-cat');
          const entriesWrapper = document.getElementById('wb-entries-wrapper');
          const entriesList = document.getElementById('s-wb-entries-list');
          let currentEntries = [];
          
          const loadEntries = async (categoryId) => {
            entriesList.innerHTML = `<div style="text-align:center; color:var(--lt-text-sub); font-size:12px;">加载中...</div>`;
            if(!categoryId) { entriesWrapper.style.display = 'none'; return; }
            entriesWrapper.style.display = 'block';
            try {
              currentEntries = await roche.worldbook.getEntries({ categoryId, scope: "global" });
              if(currentEntries.length === 0) {
                entriesList.innerHTML = `<div style="text-align:center; color:var(--lt-text-sub); font-size:12px;">该分类下暂无词条</div>`;
                return;
              }
              entriesList.innerHTML = currentEntries.map(e => {
                // [修复] 智能解析名称，避免出现 entry_xxx
                let displayName = e.name || (e.keys && e.keys.join(', ')) || e.id;
                if (displayName.startsWith('entry_') || /^[0-9]+$/.test(displayName)) {
                    displayName = e.content ? e.content.substring(0, 15) + '...' : '未命名词条';
                }
                const isChecked = settings.wbEntryIds.includes(e.id);
                return `
                  <label class="roche-lt-checkbox-item">
                    <input type="checkbox" class="wb-entry-checkbox" value="${e.id}" ${isChecked ? 'checked' : ''}>
                    ${displayName}
                  </label>
                `;
              }).join('');
            } catch(e) { console.error("加载词条失败", e); entriesList.innerHTML = "加载失败"; }
          };

          if(settings.wbCatId) await loadEntries(settings.wbCatId);

          catSelect.onchange = (e) => {
             settings.wbEntryIds = []; // 切换分类时清空选择
             loadEntries(e.target.value);
          };

          document.getElementById('s-wb-select-all').onclick = () => {
             const boxes = document.querySelectorAll('.wb-entry-checkbox');
             const allChecked = Array.from(boxes).every(b => b.checked);
             boxes.forEach(b => b.checked = !allChecked);
          };
          
          document.getElementById('s-close').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('s-save').onclick = async () => {
            settings.theme = document.getElementById('s-theme').value;
            settings.wbCatId = document.getElementById('s-wb-cat').value;
            settings.useCustomWb = document.getElementById('s-use-custom').checked;
            
            // 收集选中的词条 ID
            const checkedBoxes = document.querySelectorAll('.wb-entry-checkbox:checked');
            settings.wbEntryIds = Array.from(checkedBoxes).map(b => b.value);
            
            settings.chatStyle = document.getElementById('s-style').value;
            await roche.storage.set("lt_settings", settings);
            applyTheme();
            dom.modalWrapper.classList.remove("show");
            roche.ui.toast("设置已保存");
          };
        };

        // --- 7. 独立API 与 AI核心逻辑 ---
        async function fetchAI(sysPrompt, msgs = []) {
          const apiMsgs = [{ role: "system", content: sysPrompt }, ...msgs];
          const res = await roche.ai.chat({ messages: apiMsgs, temperature: 0.75 });
          return res.text;
        }

        async function buildContext(charId, convId) {
          const userP = await roche.persona.getActiveUserPersona();
          const char = await roche.character.get(charId);
          let extra = "";
          
          if (convId) {
            const lt = await roche.memory.getLongTerm({ conversationId: convId, limit: 100 });
            if (settings.memIncludeCore && lt.core && lt.core.summary) extra += `【核心设定与记忆】：${lt.core.summary}\n`;
            if (settings.memIncludeFacts && lt.facts && lt.facts.length > 0) {
              const factLines = lt.facts.map(f => f.summaryText || f.action || f.text).filter(Boolean);
              if (factLines.length > 0) extra += `【既往事实/经历】：${factLines.join("；")}\n`;
            }
            if (settings.memIncludeChat) {
              const limit = settings.memChatLimit || 50;
              const st = await roche.memory.getShortTerm({ conversationId: convId, limit });
              if (st && st.length > 0) {
                const chatLines = st.map(m => `${m.senderName || m.senderHandle || '未知'}: ${m.text}`);
                extra += `【近期对话参考】：\n${chatLines.join("\n")}\n`;
              }
            }
          }

          if (settings.wbCatId) {
            try {
              const entries = await roche.worldbook.getEntries({ categoryId: settings.wbCatId, scope: "global" });
              // [修复] 多选过滤
              let targetEntries = entries;
              if (settings.wbEntryIds && settings.wbEntryIds.length > 0) {
                targetEntries = entries.filter(e => settings.wbEntryIds.includes(e.id));
              }
              if (targetEntries.length > 0) {
                const wbContent = targetEntries.map(e => e.content || e.text || "").filter(Boolean).join("；\n");
                extra += `【全局世界观设定】：\n${wbContent}\n`;
              }
            } catch(e) { console.warn("世界书加载失败", e); }
          }

          // [修复] 注入专属世界书
          if (settings.useCustomWb && customWorldbooks.length > 0) {
             extra += `【剧场专属设定】：\n${customWorldbooks[0].content}\n`;
          }

          return { user: userP, char, extra };
        }

        dom.charSelect.onchange = () => { dom.generateBtn.disabled = !(activePrompt && dom.charSelect.value); };

        dom.generateBtn.onclick = async () => {
          if (!activePrompt || !dom.charSelect.value) return;
          isGenerating = true; dom.generateBtn.textContent = "执笔中...";
          
          try {
            const ctx = await buildContext(dom.charSelect.value, dom.convSelect.value);
            const sys = `你是一个优秀的小剧场作家。请根据设定写一段沉浸式短文。
            用户(${ctx.user.name})：${ctx.user.persona || ""}
            搭档(${ctx.char.name})：${ctx.char.persona || ""}
            ${ctx.extra}
            【剧场要求】
            标题：${activePrompt.title}
            剧情设定：${activePrompt.content}
            直接输出正文，文笔细腻，符合人设。`;

            vignetteText = await fetchAI(sys, [{ role: "user", content: "请开始编写。" }]);
            chatMessages = [];
            pendingUserMsgs = [];
            currentCollectionId = null;
            
            dom.vignetteTitle.textContent = activePrompt.title;
            dom.vignetteContent.textContent = vignetteText;
            renderChatHistory();
            dom.theaterArea.classList.add("active");
          } catch(e) { roche.ui.toast(e.message); }
          finally { isGenerating = false; dom.generateBtn.textContent = "执笔生成"; }
        };

        // --- 8. 聊天交互增强 (长按菜单、引用、撤回) ---
        function renderChatHistory() {
          let html = chatMessages.map((m, idx) => `
            <div class="roche-lt-msg ${m.role}" data-index="${idx}">
              <div class="roche-lt-msg-name">${m.name}</div>
              <div class="roche-lt-msg-bubble">${m.content}</div>
              ${activeMenuIndex === idx ? `
                <div class="roche-lt-action-menu ${m.role === 'user' ? 'user-menu' : 'char-menu'}">
                  <div class="roche-lt-action-item action-quote" data-idx="${idx}">引用</div>
                  ${m.role === 'char' && idx === chatMessages.length - 1 ? `<div class="roche-lt-action-item action-reroll" data-idx="${idx}">重Roll</div>` : ''}
                  <div class="roche-lt-action-item action-delete danger" data-idx="${idx}">撤回/删除</div>
                </div>
              ` : ''}
            </div>
          `).join('');
          
          html += pendingUserMsgs.map(text => `
            <div class="roche-lt-msg user pending">
              <div class="roche-lt-msg-name">我 (未发送)</div>
              <div class="roche-lt-msg-bubble">${text}</div>
            </div>
          `).join('');
          
          dom.chatHistory.innerHTML = html;
          
          // [修复Bug] 防止频繁跳动，采用平滑滚动到特定锚点
          setTimeout(() => {
             dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight;
          }, 50);

          // 绑定长按与点击事件
          dom.chatHistory.querySelectorAll('.roche-lt-msg').forEach(el => {
             const idx = parseInt(el.dataset.index);
             if (isNaN(idx)) return;
             
             const bubble = el.querySelector('.roche-lt-msg-bubble');
             let pressTimer;
             const startPress = () => pressTimer = setTimeout(() => { activeMenuIndex = idx; renderChatHistory(); }, 500);
             const cancelPress = () => clearTimeout(pressTimer);
             
             bubble.addEventListener('touchstart', startPress, {passive:true});
             bubble.addEventListener('touchend', cancelPress);
             bubble.addEventListener('touchmove', cancelPress, {passive:true});
             bubble.addEventListener('mousedown', startPress);
             bubble.addEventListener('mouseup', cancelPress);
             bubble.addEventListener('mouseleave', cancelPress);
             
             // 桌面端右键也可呼出
             bubble.addEventListener('contextmenu', (e) => {
               e.preventDefault();
               activeMenuIndex = idx;
               renderChatHistory();
             });
          });

          // 绑定菜单动作
          dom.chatHistory.querySelectorAll('.action-quote').forEach(el => {
             el.onclick = (e) => {
               e.stopPropagation();
               const idx = parseInt(el.dataset.idx);
               const textToQuote = chatMessages[idx].content;
               dom.chatInput.value = `「${textToQuote}」\n` + dom.chatInput.value;
               activeMenuIndex = -1;
               renderChatHistory();
               dom.chatInput.focus();
             };
          });
          
          dom.chatHistory.querySelectorAll('.action-delete').forEach(el => {
             el.onclick = (e) => {
               e.stopPropagation();
               const idx = parseInt(el.dataset.idx);
               chatMessages.splice(idx, 1);
               activeMenuIndex = -1;
               renderChatHistory();
               autoSaveCollection();
             };
          });

          dom.chatHistory.querySelectorAll('.action-reroll').forEach(el => {
             el.onclick = (e) => {
               e.stopPropagation();
               const idx = parseInt(el.dataset.idx);
               chatMessages.splice(idx, 1); // 删掉最后一条AI回复
               activeMenuIndex = -1;
               renderChatHistory();
               triggerAIReply(); // 重新触发AI
             };
          });
        }

        dom.chatInput.onkeypress = (e) => {
          if (e.key === "Enter") {
            const text = dom.chatInput.value.trim();
            if(text) { 
               pendingUserMsgs.push(text); 
               dom.chatInput.value = ""; 
               triggerUserSend(); 
            }
          }
        };

        container.querySelector("#lt-chat-send-btn").onclick = async () => {
          const directText = dom.chatInput.value.trim();
          if(directText) { pendingUserMsgs.push(directText); dom.chatInput.value = ""; }
          triggerUserSend();
        };

        async function triggerUserSend() {
          if(pendingUserMsgs.length === 0 || isGenerating) return;
          const combinedMsg = pendingUserMsgs.join("\n");
          const ctx = await buildContext(dom.charSelect.value, null);
          chatMessages.push({ role: "user", name: ctx.user.name || "我", content: combinedMsg });
          pendingUserMsgs = [];
          renderChatHistory();
          triggerAIReply();
        }

        async function triggerAIReply() {
          if(isGenerating) return;
          isGenerating = true;
          try {
            const ctx = await buildContext(dom.charSelect.value, null);
            const userName = ctx.user.name || "我";
            const charName = ctx.char.name || "角色";
            const styleReq = settings.chatStyle === 'pure' ? '【重要要求】：请只输出你的对白，不要包含任何动作描写和心理活动。' : '可以包含动作和心理描写。';
            
            const sys = `你是${charName}，正在和${userName}一起看关于你们的小说片段。
            【阅读内容】${vignetteText}
            任务：自然回应用户的探讨，保持人设。${styleReq}`;
            
            const apiMsgs = chatMessages.map(m => ({ role: m.role==='user'?'user':'assistant', content: m.content }));
            const fullReply = await fetchAI(sys, apiMsgs);
            
            // 简单分段输出，增加真实感
            chatMessages.push({ role: "char", name: charName, content: fullReply.trim() });
            renderChatHistory();
            autoSaveCollection(); 
          } catch(e) { roche.ui.toast("回复失败"); chatMessages.pop(); renderChatHistory(); }
          finally { isGenerating = false; }
        }

        const doContinue = async (userReq) => {
          if (isGenerating) return;
          isGenerating = true; roche.ui.toast("续写中...");
          try {
            const reqStr = userReq ? `用户期望：${userReq}` : "顺着当前气氛自然续写一段。";
            const sys = `你是一个小剧场作家。请接续前文，保持文风。
            【前文】${vignetteText}
            ${reqStr}`;
            const append = await fetchAI(sys, []);
            vignetteText += "\n\n" + append;
            dom.vignetteContent.textContent = vignetteText;
            chatMessages.push({ role: "char", name: "系统", content: "剧场内容已更新。" });
            renderChatHistory();
            autoSaveCollection();
          } catch(e) { roche.ui.toast("续写失败"); }
          finally { isGenerating = false; }
        };
        container.querySelector("#lt-continue-ai-btn").onclick = () => doContinue(null);
        container.querySelector("#lt-continue-co-btn").onclick = () => {
          const input = prompt("请输入剧情走向：");
          if(input) doContinue(input);
        };

        // --- 9. [修复Bug2] 总结摘要并记录精细化主记忆 ---
        container.querySelector("#lt-summary-btn").onclick = async () => {
          if(!dom.convSelect.value) {
            roche.ui.toast("请先在外部选择挂载一个记忆会话以支持主记忆写入。");
            return;
          }
          if(isGenerating) return roche.ui.toast("AI 正在忙碌，请稍后再试。");
          
          isGenerating = true;
          roche.ui.toast("正在生成精细化回忆摘要...");
          
          try {
            const chatLog = chatMessages.map(m => `${m.name}: ${m.content}`).join("\n");
            // 强化系统 Prompt，强制要求提取具体细节
            const sys = `你是一个客观的记忆整理助手。请根据下方提供的内容生成一段第三人称的事实陈述（控制在150字内）。
            【小剧场正文摘要】：${vignetteText.substring(0, 300)}...
            【双方观后探讨】：\n${chatLog}
            【要求】：
            1. 必须说明具体阅读了什么内容（如：探讨了雨天避雨的情节）。
            2. 必须记录双方讨论的核心焦点或态度（如：对方觉得很浪漫，而用户觉得...）。
            3. 拒绝使用“一起阅读并探讨了小剧场”这种废话，要写实质内容。`;
            
            const summaryText = await fetchAI(sys, [{role: "user", content: "开始提取精准记忆。"}]);
            
            dom.modalContent.innerHTML = `
              <h3 style="margin:0 0 15px 0;">剧场共读纪要</h3>
              <span style="font-size:12px; color:var(--lt-text-sub); display:block; margin-bottom:8px;">AI 提取的深度摘要（将作为具体行为写入）：</span>
              <textarea id="sum-text" style="height: 120px;">${summaryText}</textarea>
              
              <div class="roche-lt-modal-actions" style="margin-top: 15px;">
                <button id="sum-copy" class="roche-lt-btn-outline" style="border-color:#b5929c; color:#b5929c;">复制内容 (可手动发至对话框)</button>
                <button id="sum-close" class="roche-lt-btn-outline">取消</button>
                <button id="sum-save" class="roche-lt-btn" style="padding: 8px 20px;">写入主游戏记忆</button>
              </div>
            `;
            dom.modalWrapper.classList.add("show");
            
            document.getElementById('sum-close').onclick = () => dom.modalWrapper.classList.remove("show");
            
            document.getElementById('sum-copy').onclick = async () => {
               const text = document.getElementById('sum-text').value;
               try {
                 await navigator.clipboard.writeText(text);
                 roche.ui.toast("已复制到剪贴板！");
               } catch(e) {
                 roche.ui.toast("复制失败，请手动选取。");
               }
            };
            
            // 写入强化版事实记忆
            document.getElementById('sum-save').onclick = async () => {
              const finalSummary = document.getElementById('sum-text').value.trim();
              if(!finalSummary) return roche.ui.toast("摘要内容不能为空。");
              try {
                await roche.memory.write({
                  conversationId: dom.convSelect.value,
                  summaryText: finalSummary, 
                  who: ["我", "对方"],
                  action: finalSummary, // 摒弃废话，直接将具体探讨内容写入 action 供模型检索
                  when: "刚才",
                  where: "小剧场应用",
                  source: "little-theater"
                });
                roche.ui.toast("已成功写入该角色的长期事实记忆！");
                dom.modalWrapper.classList.remove("show");
              } catch(e) {
                roche.ui.toast("写入记忆失败：" + e.message);
              }
            };
          } catch (e) {
            roche.ui.toast("总结生成失败：" + e.message);
          } finally {
            isGenerating = false;
          }
        };

        // --- 10. 收藏馆控制 ---
        async function autoSaveCollection() {
          if(!currentCollectionId) return; 
          const col = savedCollections.find(c => c.id === currentCollectionId);
          if(col) {
            col.content = vignetteText;
            col.chatHistory = [...chatMessages];
            await roche.storage.set("collections", savedCollections);
          }
        }

        container.querySelector("#lt-save-theater-btn").onclick = async () => {
          if(currentCollectionId) return roche.ui.toast("已在收藏中，内容会自动更新");
          currentCollectionId = crypto.randomUUID();
          savedCollections.unshift({
            id: currentCollectionId,
            title: activePrompt?.title || "未命名剧场",
            charId: dom.charSelect.value,
            content: vignetteText,
            chatHistory: [...chatMessages],
            date: new Date().toLocaleString()
          });
          await roche.storage.set("collections", savedCollections);
          roche.ui.toast("已保存至收藏馆");
        };

        function renderCollection() {
          dom.colArea.innerHTML = savedCollections.length === 0 ? `<div style="text-align:center; color:var(--lt-text-sub); margin-top:20px;">收藏馆空空如也~</div>` : '';
          dom.colArea.innerHTML += savedCollections.map(c => `
            <div class="roche-lt-col-item" data-id="${c.id}">
              <div class="roche-lt-col-title">${c.title}</div>
              <div class="roche-lt-col-desc">${c.content.substring(0, 50)}...</div>
              <div class="roche-lt-col-meta">${c.date}</div>
            </div>
          `).join('');

          dom.colArea.querySelectorAll('.roche-lt-col-item').forEach(el => {
            el.onclick = () => {
              const col = savedCollections.find(c => c.id === el.dataset.id);
              currentCollectionId = col.id;
              vignetteText = col.content;
              chatMessages = [...col.chatHistory];
              pendingUserMsgs = [];
              dom.vignetteTitle.textContent = col.title;
              dom.vignetteContent.textContent = vignetteText;
              dom.charSelect.value = col.charId; 
              renderChatHistory();
              dom.theaterArea.classList.add("active");
            };
          });
        }

        let isFullscreen = false;
        container.querySelector("#lt-fullscreen-btn").onclick = (e) => {
          isFullscreen = !isFullscreen;
          dom.theaterArea.classList.toggle("fullscreen", isFullscreen);
          e.target.textContent = isFullscreen ? "退出全屏" : "全屏";
        };
        container.querySelector("#lt-close-theater-btn").onclick = () => {
          dom.theaterArea.classList.remove("active");
          if(isFullscreen) container.querySelector("#lt-fullscreen-btn").click();
          if(dom.tabCol.classList.contains('active')) renderCollection();
        };

        dom.wrap.querySelector("#lt-back-btn").onclick = () => roche.ui.closeApp();
        updatePromptUI();
      },
      
      async unmount(container, roche) {
        const style = document.getElementById("style-roche-little-theater");
        if (style) style.remove();
        container.replaceChildren();
      }
    }
  ]
    });

