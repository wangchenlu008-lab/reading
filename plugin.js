window.RochePlugin.register({
  id: "roche-plugin-little-theater",
  name: "小剧场 Pro Max",
  version: "2.0.0",
  apps: [
    {
      id: "little-theater-app",
      name: "小剧场",
      icon: "theater_comedy",
      async mount(container, roche) {
        
        // --- 1. 样式定义 (支持 CSS 变量换肤) ---
        const styleId = "style-roche-little-theater";
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            :root {
              --lt-bg: #f5f7fa; --lt-panel: #fff; --lt-text-main: #4a5560; --lt-text-sub: #8a9ea8;
              --lt-primary: #b1c2d4; --lt-primary-hover: #9db2c7; --lt-input-bg: #eef2f6; --lt-border: #eef2f6;
              --lt-user-msg: #d0dce8; --lt-char-msg: #fff;
            }
            .theme-pink { --lt-bg: #fff0f5; --lt-panel: #fff; --lt-text-main: #5c434a; --lt-text-sub: #b5929c; --lt-primary: #f4b8c8; --lt-primary-hover: #e3a3b4; --lt-input-bg: #ffe4eb; --lt-border: #ffe4eb; --lt-user-msg: #ffd1dc; }
            .theme-dark { --lt-bg: #1a1a2e; --lt-panel: #16213e; --lt-text-main: #e0e0e0; --lt-text-sub: #8a9ea8; --lt-primary: #0f3460; --lt-primary-hover: #1a4b85; --lt-input-bg: #1a1a2e; --lt-border: #0f3460; --lt-user-msg: #0f3460; --lt-char-msg: #16213e; }

            .roche-lt-container { display: flex; flex-direction: column; height: 100%; background-color: var(--lt-bg); color: var(--lt-text-main); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; position: relative; overflow: hidden; box-sizing: border-box; transition: background-color 0.3s; }
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
            
            /* 新增：记忆配置面板样式 */
            .roche-lt-memory-panel { background: var(--lt-panel); border-radius: 16px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 10px; }
            .roche-lt-memory-title { font-size: 13px; font-weight: 600; color: var(--lt-text-sub); margin-bottom: 5px; }
            
            .roche-lt-select-wrapper { position: relative; width: 100%; }
            .roche-lt-select-wrapper select { width: 100%; appearance: none; -webkit-appearance: none; background-color: var(--lt-input-bg); border: 1px solid transparent; border-radius: 12px; padding: 10px 35px 10px 15px; font-size: 14px; color: var(--lt-text-main); outline: none; }
            .roche-lt-select-wrapper::after { content: "▼"; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 10px; color: var(--lt-text-sub); pointer-events: none; }
            
            .roche-lt-checkbox-group { display: flex; gap: 15px; font-size: 13px; color: var(--lt-text-main); align-items: center; }
            .roche-lt-checkbox-group label { display: flex; align-items: center; gap: 5px; cursor: pointer; }
            
            .roche-lt-range-group { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--lt-text-main); }
            .roche-lt-range-group input[type="range"] { flex: 1; accent-color: var(--lt-primary); }

            .roche-lt-prompt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: -5px; }
            .roche-lt-prompt-header-title { font-size: 13px; font-weight: 500; color: var(--lt-text-sub); }
            .roche-lt-prompt-scroll { display: flex; overflow-x: auto; gap: 12px; padding: 4px 0 16px 0; scroll-snap-type: x mandatory; }
            .roche-lt-prompt-scroll::-webkit-scrollbar { display: none; }
            .roche-lt-prompt-item { flex: 0 0 calc(45% - 6px); min-width: 140px; background: var(--lt-panel); border-radius: 16px; padding: 16px; scroll-snap-align: start; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 2px solid transparent; transition: 0.3s; display: flex; flex-direction: column; justify-content: space-between; cursor:pointer; }
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
            .roche-lt-btn-outline { background: transparent; border: 1px solid var(--lt-primary); color: var(--lt-text-sub); padding: 6px 14px; font-size: 13px; border-radius: 15px; cursor: pointer; }
            .roche-lt-generate-btn { width: 100%; padding: 16px; font-size: 16px; letter-spacing: 2px; border-radius: 16px; margin-top: 10px; }
            
            .roche-lt-theater-area { display: flex; flex-direction: column; height: 100%; background: var(--lt-bg); border-radius: 24px 24px 0 0; padding: 20px; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); overflow: hidden; position: absolute; top: 0; left: 0; width: 100%; z-index: 10; transition: transform 0.4s; transform: translateY(100%); }
            .roche-lt-theater-area.active { transform: translateY(0); }
            .roche-lt-theater-area.fullscreen { border-radius: 0; padding-bottom: 20px; z-index: 9999; }
            
            .roche-lt-theater-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--lt-border); flex-shrink: 0; }
            .roche-lt-theater-title { font-size: 16px; font-weight: 600; color: var(--lt-text-main); }
            .roche-lt-theater-tools { display: flex; gap: 8px; }
            
            .roche-lt-theater-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
            .roche-lt-vignette-content { font-size: 15px; line-height: 1.8; color: var(--lt-text-main); white-space: pre-wrap; padding: 15px; background: var(--lt-panel); border-radius: 16px; }
            
            .roche-lt-chat-box { background: var(--lt-panel); border-radius: 16px; padding: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px; margin-bottom: 10px; }
            .roche-lt-chat-history { display: flex; flex-direction: column; gap: 12px; max-height: 250px; overflow-y: auto; }
            .roche-lt-msg { display: flex; flex-direction: column; max-width: 85%; animation: fadeIn 0.3s; }
            .roche-lt-msg.user { align-self: flex-end; align-items: flex-end; }
            .roche-lt-msg.char { align-self: flex-start; align-items: flex-start; }
            .roche-lt-msg-name { font-size: 11px; color: var(--lt-text-sub); margin-bottom: 4px; padding: 0 4px; }
            .roche-lt-msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; color: var(--lt-text-main); }
            .roche-lt-msg.user .roche-lt-msg-bubble { background: var(--lt-user-msg); border-bottom-right-radius: 4px; }
            .roche-lt-msg.char .roche-lt-msg-bubble { background: var(--lt-char-msg); border: 1px solid var(--lt-border); border-bottom-left-radius: 4px; }
            .roche-lt-msg.pending { opacity: 0.6; }
            .roche-lt-msg.pending .roche-lt-msg-bubble { border: 1px dashed var(--lt-primary); }

            .roche-lt-input-group { display: flex; flex-direction: column; gap: 10px; }
            .roche-lt-input-row { display: flex; gap: 10px; }
            .roche-lt-input-row input { flex: 1; padding: 12px 16px; border: 1px solid var(--lt-border); border-radius: 20px; outline: none; background: var(--lt-input-bg); font-size: 14px; color: var(--lt-text-main); }
            .roche-lt-chat-hint { font-size: 11px; color: var(--lt-text-sub); text-align: center; }

            .roche-lt-fab-back { position: fixed; bottom: 20px; left: 20px; background: var(--lt-panel); border: 1px solid var(--lt-border); color: var(--lt-text-sub); border-radius: 50%; width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); cursor: pointer; z-index: 1000; font-size: 20px; }
            
            .roche-lt-modal-bg { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; opacity: 0; pointer-events: none; transition: 0.3s; padding: 20px; }
            .roche-lt-modal-bg.show { opacity: 1; pointer-events: auto; }
            .roche-lt-modal { background: var(--lt-panel); padding: 24px; border-radius: 20px; width: 100%; max-width: 380px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transform: translateY(20px); transition: 0.3s; }
            .roche-lt-modal-bg.show .roche-lt-modal { transform: translateY(0); }
            
            .roche-lt-modal label { font-size: 12px; color: var(--lt-text-sub); margin-bottom: 4px; display: block; font-weight:bold; }
            .roche-lt-modal input[type="text"], .roche-lt-modal input[type="password"], .roche-lt-modal textarea, .roche-lt-modal select { width: 100%; margin-bottom: 16px; padding: 12px; border: 1px solid var(--lt-border); border-radius: 12px; background: var(--lt-input-bg); font-size: 14px; color: var(--lt-text-main); outline: none; }
            .roche-lt-modal textarea { height: 90px; resize: none; font-family: inherit; }
            .roche-lt-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
            
            /* 世界书条目复选框区 */
            .roche-lt-wb-entries { max-height: 150px; overflow-y: auto; background: var(--lt-input-bg); border-radius: 12px; padding: 10px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
            .roche-lt-wb-entries label { font-size: 13px; color: var(--lt-text-main); font-weight: normal; margin:0; display:flex; align-items:center; gap:8px; }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .roche-lt-hidden { display: none !important; }
          `;
          document.head.appendChild(style);
        }

        // --- 2. 状态与数据管理 ---
        let prompts = (await roche.storage.get("prompts")) || [
          { id: "1", title: "雨天避雨", category: "日常", content: "一场突如其来的大雨，两人在屋檐下避雨的温馨时刻。" },
          { id: "2", title: "平行世界相遇", category: "科幻", content: "在赛博朋克设定的平行世界里，两人作为宿敌的初次交锋。" }
        ];
        
        let savedCollections = (await roche.storage.get("collections")) || [];
        
        let settings = (await roche.storage.get("lt_settings")) || {
          theme: "default",
          wbCategoryId: "", 
          wbSelectedEntries: [], // 保存具体的词条ID数组
          apiBase: "", apiKey: "", chatStyle: "mixed"
        };
        
        // 记忆挂载状态
        let memoryConfig = (await roche.storage.get("lt_memory_config")) || {
          charId: "",
          convId: "",
          useCore: true,
          useFacts: true,
          shortTermCount: 20
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

        // --- 3. 初始结构渲染 ---
        container.innerHTML = `
          <div class="roche-lt-container roche-plugin-little-theater" id="lt-main-wrap">
            <div id="lt-back-btn" class="roche-lt-fab-back">←</div>
            <div class="roche-lt-topbar">
              <div class="roche-lt-tabs">
                <div id="tab-home" class="roche-lt-tab active">灵感创作</div>
                <div id="tab-col" class="roche-lt-tab">📚 收藏馆</div>
              </div>
              <div class="roche-lt-icons"><span id="lt-settings-btn">⚙️</span></div>
            </div>

            <div class="roche-lt-config-area" id="lt-config-area">
              
              <!-- 升级 1: 独立记忆配置面板 -->
              <div class="roche-lt-memory-panel">
                <div class="roche-lt-memory-title">🎭 共演角色与记忆挂载</div>
                <div class="roche-lt-select-wrapper">
                  <select id="lt-char-select">
                    <option value="" disabled selected>请选择共读角色...</option>
                    ${characters.map(c => `<option value="${c.id}" ${memoryConfig.charId===c.id?'selected':''}>${c.name || c.handle}</option>`).join('')}
                  </select>
                </div>
                
                <div id="lt-memory-options" style="display:${memoryConfig.charId?'block':'none'}; margin-top:10px;">
                  <div class="roche-lt-select-wrapper" style="margin-bottom:10px;">
                    <select id="lt-conv-select">
                      <option value="">不挂载指定会话 (无历史记录)</option>
                      ${conversations.map(c => `<option value="${c.id}" ${memoryConfig.convId===c.id?'selected':''}>挂载: ${c.name || c.title}</option>`).join('')}
                    </select>
                  </div>
                  
                  <div class="roche-lt-checkbox-group">
                    <label><input type="checkbox" id="lt-mem-core" ${memoryConfig.useCore?'checked':''}> 核心记忆 (Core)</label>
                    <label><input type="checkbox" id="lt-mem-facts" ${memoryConfig.useFacts?'checked':''}> 事实记忆 (Facts)</label>
                  </div>
                  
                  <div class="roche-lt-range-group" style="margin-top:10px;">
                    <span>代入近期聊天: <span id="lt-mem-st-val">${memoryConfig.shortTermCount}</span> 条</span>
                    <input type="range" id="lt-mem-st" min="0" max="50" step="5" value="${memoryConfig.shortTermCount}">
                  </div>
                </div>
              </div>

              <div class="roche-lt-filter-bar" style="margin-top:10px;">
                <input type="text" id="lt-search-input" class="roche-lt-search" placeholder="搜索小剧场灵感...">
                <div class="roche-lt-categories" id="lt-category-list"></div>
              </div>

              <div class="roche-lt-prompt-header">
                <span class="roche-lt-prompt-header-title">灵感图鉴 (点击选择)</span>
                <button id="lt-add-prompt-btn" class="roche-lt-btn-outline">+ 新增</button>
              </div>
              <div class="roche-lt-prompt-scroll" id="lt-prompt-scroll"></div>
              
              <button id="lt-generate-btn" class="roche-lt-btn roche-lt-generate-btn" disabled>执笔生成</button>
            </div>

            <div class="roche-lt-collection-area hidden" id="lt-collection-area"></div>
            
            <div id="lt-theater-area" class="roche-lt-theater-area">
              <div class="roche-lt-theater-header">
                <span id="lt-vignette-title" class="roche-lt-theater-title">剧场内容</span>
                <div class="roche-lt-theater-tools">
                  <button id="lt-save-theater-btn" class="roche-lt-btn-outline" style="border:none;">归档</button>
                  <button id="lt-close-theater-btn" class="roche-lt-btn-outline" style="border:none; background:var(--lt-input-bg);">退出</button>
                  <button id="lt-fullscreen-btn" class="roche-lt-btn-outline">全屏</button>
                </div>
              </div>
              
              <div class="roche-lt-theater-scroll">
                <div id="lt-vignette-content" class="roche-lt-vignette-content"></div>
                
                <div style="display:flex; gap:10px; margin-bottom: 5px;">
                  <button id="lt-continue-ai-btn" class="roche-lt-btn-outline" style="flex:1;">AI 延展</button>
                  <button id="lt-continue-co-btn" class="roche-lt-btn-outline" style="flex:1;">定向续写</button>
                </div>
                
                <div class="roche-lt-chat-box">
                  <div id="lt-chat-history" class="roche-lt-chat-history"></div>
                  <div class="roche-lt-input-group">
                    <div class="roche-lt-input-row">
                      <input type="text" id="lt-chat-input" placeholder="与角色探讨，按回车缓存多条...">
                      <button id="lt-chat-send-btn" class="roche-lt-btn" style="padding: 10px 18px; border-radius: 18px;">发送</button>
                    </div>
                  </div>
                </div>
                
                <!-- 升级 3: 总结与记忆挂载 -->
                <button id="lt-summary-btn" class="roche-lt-btn" style="width:100%; background:var(--lt-text-sub); margin-bottom:20px;">生成剧场总结与回写记忆</button>
              </div>
            </div>
          </div>
          
          <div id="lt-modal-wrapper" class="roche-lt-modal-bg">
            <div class="roche-lt-modal" id="lt-modal-content"></div>
          </div>
        `;

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
          memOptions: container.querySelector("#lt-memory-options"),
          convSelect: container.querySelector("#lt-conv-select"),
          memCore: container.querySelector("#lt-mem-core"),
          memFacts: container.querySelector("#lt-mem-facts"),
          memSt: container.querySelector("#lt-mem-st"),
          memStVal: container.querySelector("#lt-mem-st-val"),
          
          theaterArea: container.querySelector("#lt-theater-area"),
          vignetteContent: container.querySelector("#lt-vignette-content"),
          vignetteTitle: container.querySelector("#lt-vignette-title"),
          chatHistory: container.querySelector("#lt-chat-history"),
          chatInput: container.querySelector("#lt-chat-input"),
          
          modalWrapper: container.querySelector("#lt-modal-wrapper"),
          modalContent: container.querySelector("#lt-modal-content")
        };

        function applyTheme() { dom.wrap.className = \`roche-lt-container roche-plugin-little-theater theme-\${settings.theme}\`; }
        applyTheme();

        dom.tabHome.onclick = () => { dom.tabHome.classList.add('active'); dom.tabCol.classList.remove('active'); dom.configArea.classList.remove('hidden'); dom.colArea.classList.add('hidden'); };
        dom.tabCol.onclick = () => { dom.tabCol.classList.add('active'); dom.tabHome.classList.remove('active'); dom.colArea.classList.remove('hidden'); dom.configArea.classList.add('hidden'); renderCollection(); };

        // 记忆配置面板交互
        const saveMemoryConfig = async () => {
          memoryConfig = {
            charId: dom.charSelect.value,
            convId: dom.convSelect.value,
            useCore: dom.memCore.checked,
            useFacts: dom.memFacts.checked,
            shortTermCount: parseInt(dom.memSt.value)
          };
          await roche.storage.set("lt_memory_config", memoryConfig);
        };
        
        dom.charSelect.onchange = () => {
          dom.memOptions.style.display = dom.charSelect.value ? 'block' : 'none';
          // 自动匹配该角色的会话
          const matchedConv = conversations.find(c => c.contactId === dom.charSelect.value);
          if(matchedConv) dom.convSelect.value = matchedConv.id;
          saveMemoryConfig();
          checkGenerateBtn();
        };
        dom.convSelect.onchange = saveMemoryConfig;
        dom.memCore.onchange = saveMemoryConfig;
        dom.memFacts.onchange = saveMemoryConfig;
        dom.memSt.oninput = (e) => { dom.memStVal.textContent = e.target.value; saveMemoryConfig(); };

        function updatePromptUI() {
          const cats = ["全部", ...new Set(prompts.map(p => p.category || "未分类"))];
          dom.catList.innerHTML = cats.map(c => \`<div class="roche-lt-cat-btn \${activeCategory === c ? 'active' : ''}" data-cat="\${c}">\${c}</div>\`).join('');
          dom.catList.querySelectorAll('.roche-lt-cat-btn').forEach(el => { el.onclick = () => { activeCategory = el.dataset.cat; updatePromptUI(); }; });

          const filtered = prompts.filter(p => (activeCategory === "全部" || (p.category || "未分类") === activeCategory) && (p.title.includes(searchKeyword) || p.content.includes(searchKeyword)));
          dom.promptScroll.innerHTML = filtered.map(p => \`
            <div class="roche-lt-prompt-item \${activePrompt?.id === p.id ? 'active' : ''}" data-id="\${p.id}">
              <div class="roche-lt-prompt-title">\${p.title}</div>
              <div class="roche-lt-prompt-cat">\${p.category || '未分类'}</div>
              <div style="font-size:12px; color:var(--lt-text-sub); margin-top:8px; text-align:right;">[点选]</div>
            </div>
          \`).join('');
          dom.promptScroll.querySelectorAll('.roche-lt-prompt-item').forEach(el => {
            el.onclick = () => { activePrompt = prompts.find(pr=>pr.id===el.dataset.id); updatePromptUI(); checkGenerateBtn(); };
          });
        }
        dom.searchInput.oninput = (e) => { searchKeyword = e.target.value; updatePromptUI(); };
        function checkGenerateBtn() { dom.generateBtn.disabled = !(activePrompt && dom.charSelect.value); }

        container.querySelector("#lt-add-prompt-btn").onclick = () => {
          dom.modalContent.innerHTML = \`
            <h3 style="margin:0 0 15px 0;">创作灵感</h3>
            <input type="text" id="m-title" placeholder="标题">
            <input type="text" id="m-cat" placeholder="分类标签">
            <textarea id="m-content" placeholder="剧情设定..."></textarea>
            <div class="roche-lt-modal-actions">
              <button id="m-cancel" class="roche-lt-btn-outline">取消</button>
              <button id="m-save" class="roche-lt-btn">保存</button>
            </div>
          \`;
          dom.modalWrapper.classList.add("show");
          document.getElementById('m-cancel').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('m-save').onclick = async () => {
            const t = document.getElementById('m-title').value.trim();
            if(!t) return roche.ui.toast("请输入标题");
            prompts.unshift({ id: crypto.randomUUID(), title: t, category: document.getElementById('m-cat').value.trim()||"未分类", content: document.getElementById('m-content').value.trim() });
            await roche.storage.set("prompts", prompts);
            dom.modalWrapper.classList.remove("show"); updatePromptUI();
          };
        };

        // 升级 2: 世界书挂载逻辑修复与细化
        container.querySelector("#lt-settings-btn").onclick = () => {
          dom.modalContent.innerHTML = \`
            <h3 style="margin:0 0 15px 0;">全局与世界书设置</h3>
            <label>UI 主题</label>
            <select id="s-theme">
              <option value="default" \${settings.theme==='default'?'selected':''}>莫兰迪浅蓝</option>
              <option value="pink" \${settings.theme==='pink'?'selected':''}>樱花粉</option>
              <option value="dark" \${settings.theme==='dark'?'selected':''}>暗夜蓝 (深色)</option>
            </select>
            
            <label>世界书分类 (分类下选择具体词条)</label>
            <select id="s-wb-cat">
              <option value="">不挂载世界书</option>
              \${worldbookCategories.map(w => \`<option value="\${w.id}" \${settings.wbCategoryId===w.id?'selected':''}>\${w.name}</option>\`).join('')}
            </select>
            <div id="s-wb-entries-container" class="roche-lt-wb-entries" style="display:none;"></div>
            
            <label>API URL / Key (留空则用原生)</label>
            <input type="text" id="s-api-url" placeholder="自定义 URL..." value="\${settings.apiBase||''}">
            <input type="password" id="s-api-key" placeholder="API Key..." value="\${settings.apiKey||''}">
            
            <div class="roche-lt-modal-actions">
              <button id="s-close" class="roche-lt-btn-outline">取消</button>
              <button id="s-save" class="roche-lt-btn">保存</button>
            </div>
          \`;
          dom.modalWrapper.classList.add("show");
          
          const wbCatSelect = document.getElementById('s-wb-cat');
          const wbEntriesCont = document.getElementById('s-wb-entries-container');
          
          const loadWbEntries = async (catId) => {
            if(!catId) { wbEntriesCont.style.display = 'none'; return; }
            wbEntriesCont.innerHTML = '<div style="font-size:12px;text-align:center;">读取词条中...</div>';
            wbEntriesCont.style.display = 'flex';
            try {
              const entries = await roche.worldbook.getEntries({ scope: "global", categoryId: catId });
              if(entries.length === 0) {
                wbEntriesCont.innerHTML = '<div style="font-size:12px;color:gray;">该分类下无词条</div>';
              } else {
                wbEntriesCont.innerHTML = entries.map(e => \`
                  <label><input type="checkbox" class="wb-entry-cb" value="\${e.id}" \${settings.wbSelectedEntries.includes(e.id)?'checked':''}> \${e.keys ? e.keys.join(', ') : '未命名词条'}</label>
                \`).join('');
              }
            } catch(err) { wbEntriesCont.innerHTML = '<div style="font-size:12px;color:red;">读取失败</div>'; }
          };
          
          if(settings.wbCategoryId) loadWbEntries(settings.wbCategoryId);
          wbCatSelect.onchange = (e) => loadWbEntries(e.target.value);

          document.getElementById('s-close').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('s-save').onclick = async () => {
            const checkedEntries = Array.from(document.querySelectorAll('.wb-entry-cb:checked')).map(cb => cb.value);
            settings = {
              theme: document.getElementById('s-theme').value,
              wbCategoryId: wbCatSelect.value,
              wbSelectedEntries: checkedEntries,
              chatStyle: "mixed",
              apiBase: document.getElementById('s-api-url').value.trim(),
              apiKey: document.getElementById('s-api-key').value.trim()
            };
            await roche.storage.set("lt_settings", settings);
            applyTheme(); dom.modalWrapper.classList.remove("show"); roche.ui.toast("设置已保存");
          };
        };

        // --- 核心 AI 与上下文构建 ---
        async function fetchAI(sysPrompt, msgs = []) {
          const apiMsgs = [{ role: "system", content: sysPrompt }, ...msgs];
          if (settings.apiBase && settings.apiKey) {
            const url = settings.apiBase.endsWith('/') ? settings.apiBase + 'v1/chat/completions' : settings.apiBase + '/v1/chat/completions';
            const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${settings.apiKey}\` }, body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: apiMsgs, temperature: 0.75 }) });
            if(!res.ok) throw new Error("API 失败");
            return (await res.json()).choices[0].message.content;
          } else {
            return (await roche.ai.chat({ messages: apiMsgs, temperature: 0.75 })).text;
          }
        }

        // 深度组装上下文
        async function buildContext() {
          const userP = await roche.persona.getActiveUserPersona();
          const char = await roche.character.get(memoryConfig.charId);
          let extra = "";
          
          if (memoryConfig.convId) {
            const longTerm = await roche.memory.getLongTerm({ conversationId: memoryConfig.convId, limit: 100 });
            if (memoryConfig.useCore && longTerm.core?.summary) extra += \`【角色核心记忆(Core)】：\${longTerm.core.summary}\\n\`;
            if (memoryConfig.useFacts && longTerm.facts?.length > 0) extra += \`【事实记忆(Facts)】：\${longTerm.facts.map(f => f.summaryText || f.action).join("；")}\\n\`;
            
            if (memoryConfig.shortTermCount > 0) {
              const shortTerm = await roche.memory.getShortTerm({ conversationId: memoryConfig.convId, limit: memoryConfig.shortTermCount });
              if (shortTerm && shortTerm.length > 0) {
                // 按时间正序拼接近期对话
                const stText = shortTerm.reverse().map(m => \`\${m.senderHandle || m.senderName}: \${m.text}\`).join("\\n");
                extra += \`【近期聊天记录(短时上下文)】：\\n\${stText}\\n\`;
              }
            }
          }
          
          if (settings.wbCategoryId && settings.wbSelectedEntries.length > 0) {
            try {
              const entries = await roche.worldbook.getEntries({ scope: "global", categoryId: settings.wbCategoryId });
              const selectedTexts = entries.filter(e => settings.wbSelectedEntries.includes(e.id)).map(e => e.content);
              if (selectedTexts.length > 0) extra += \`【世界观设定(Worldbook)】：\${selectedTexts.join('；')}\\n\`;
            } catch(e) {} // 忽略获取失败
          }
          return { user: userP, char, extra };
        }

        dom.generateBtn.onclick = async () => {
          if (!activePrompt || !memoryConfig.charId) return;
          isGenerating = true; dom.generateBtn.textContent = "执笔中...";
          try {
            const ctx = await buildContext();
            const sys = \`你是一个优秀的叙事向小剧场作家。请根据角色的设定、世界观和记忆，顺接剧情写一段沉浸式短文。
            用户(\${ctx.user.name})：\${ctx.user.persona || ""}
            搭档(\${ctx.char.name})：\${ctx.char.persona || ""}
            \${ctx.extra}
            【剧场要求】
            标题：\${activePrompt.title}
            剧情设定：\${activePrompt.content}
            直接输出正文，文笔细腻，符合人设与已有记忆脉络。\`;

            vignetteText = await fetchAI(sys, [{ role: "user", content: "请开始编写。" }]);
            chatMessages = []; pendingUserMsgs = []; currentCollectionId = null; 
            
            dom.vignetteTitle.textContent = activePrompt.title;
            dom.vignetteContent.textContent = vignetteText;
            renderChatHistory();
            dom.theaterArea.classList.add("active");
          } catch(e) { roche.ui.toast("生成失败: " + e.message); }
          finally { isGenerating = false; dom.generateBtn.textContent = "执笔生成"; }
        };

        function renderChatHistory() {
          dom.chatHistory.innerHTML = chatMessages.map(m => \`
            <div class="roche-lt-msg \${m.role}">
              <div class="roche-lt-msg-name">\${m.name}</div>
              <div class="roche-lt-msg-bubble">\${m.content}</div>
            </div>
          \`).join('') + pendingUserMsgs.map(t => \`<div class="roche-lt-msg user pending"><div class="roche-lt-msg-name">我(缓冲中)</div><div class="roche-lt-msg-bubble">\${t}</div></div>\`).join('');
          dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight;
        }

        dom.chatInput.onkeypress = (e) => {
          if (e.key === "Enter" && e.target.value.trim()) { pendingUserMsgs.push(e.target.value.trim()); e.target.value = ""; renderChatHistory(); }
        };

        container.querySelector("#lt-chat-send-btn").onclick = async () => {
          if(dom.chatInput.value.trim()) { pendingUserMsgs.push(dom.chatInput.value.trim()); dom.chatInput.value = ""; }
          if(pendingUserMsgs.length === 0 || isGenerating) return;
          
          const combinedMsg = pendingUserMsgs.join(" ");
          const ctx = await buildContext(); // 再次获取上下文，保持记忆一致
          
          chatMessages.push({ role: "user", name: ctx.user.name||"我", content: combinedMsg });
          pendingUserMsgs = []; renderChatHistory();
          
          isGenerating = true;
          try {
            const sys = \`你是\${ctx.char.name}，正在和\${ctx.user.name||"我"}一起探讨剧场内容。
            【阅读内容】\${vignetteText}
            任务：自然回应用户的探讨，保持人设。可以包含少量动作/心理描写。\`;
            const apiMsgs = chatMessages.map(m => ({ role: m.role==='user'?'user':'assistant', content: m.content }));
            const fullReply = await fetchAI(sys, apiMsgs);
            
            chatMessages.push({ role: "char", name: ctx.char.name, content: fullReply });
            renderChatHistory(); autoSaveCollection();
          } catch(e) { roche.ui.toast("回复失败"); chatMessages.pop(); renderChatHistory(); }
          finally { isGenerating = false; }
        };

        // --- 升级 3: 总结与记忆注入 ---
        container.querySelector("#lt-summary-btn").onclick = async () => {
          if(!vignetteText) return;
          dom.modalContent.innerHTML = \`<div style="text-align:center;">正在提炼剧情摘要...</div>\`;
          dom.modalWrapper.classList.add("show");
          
          try {
            const sys = \`请根据以下小剧场正文和随后的聊天探讨，提炼一段精炼的第三人称事实摘要（Fact），说明发生了什么事、得出了什么结论或情感进展。用于写入角色的长期记忆系统。字数限制在150字以内。\n【剧场正文】\n\${vignetteText}\n【聊天探讨】\n\${chatMessages.map(m=>m.name+":"+m.content).join('\\n')}\`;
            const summaryStr = await fetchAI(sys, []);
            
            dom.modalContent.innerHTML = \`
              <h3 style="margin:0 0 15px 0;">剧场摘要与回写</h3>
              <label>您可以手动修改摘要内容：</label>
              <textarea id="m-summary" style="height:120px;">\${summaryStr}</textarea>
              <div style="font-size:11px; color:var(--lt-text-sub); margin-bottom:15px;">
                提示：前端插件无法直接发送气泡至主游戏界面。您可以选择将摘要【静默写入角色的主事实记忆】，或【复制】后切回主界面手动粘贴发送给角色。
              </div>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <button id="m-write-mem" class="roche-lt-btn">写入角色主事实记忆</button>
                <button id="m-copy-chat" class="roche-lt-btn-outline">复制 [摘要+剧场] 以便粘贴发送</button>
                <button id="m-close-sum" class="roche-lt-btn-outline" style="border:none;">关闭</button>
              </div>
            \`;
            
            document.getElementById('m-close-sum').onclick = () => dom.modalWrapper.classList.remove("show");
            
            document.getElementById('m-write-mem').onclick = async () => {
              if(!memoryConfig.convId) return roche.ui.toast("未选择挂载的会话，无法写入主记忆！");
              const finalSummary = document.getElementById('m-summary').value;
              await roche.memory.write({
                conversationId: memoryConfig.convId,
                summaryText: finalSummary,
                who: ["我", "角色"],
                action: "进行了一次小剧场互动体验",
                when: new Date().toLocaleString(),
                where: "小剧场沉浸系统",
                source: "little-theater"
              });
              roche.ui.toast("✅ 已成功写入 Roche 事实主记忆！不会随插件卸载删除。");
              dom.modalWrapper.classList.remove("show");
            };
            
            document.getElementById('m-copy-chat').onclick = () => {
              const finalSummary = document.getElementById('m-summary').value;
              const copyText = \`【来自小剧场的沉浸体验】\\n*\${finalSummary}*\\n\\n【剧场记录】\\n\${vignetteText}\`;
              navigator.clipboard.writeText(copyText).then(()=>{
                roche.ui.toast("复制成功！请关闭插件并粘贴至游戏主聊天框。");
              }).catch(()=>roche.ui.toast("复制失败，请手动选择复制"));
            };
            
          } catch(e) {
            dom.modalWrapper.classList.remove("show"); roche.ui.toast("生成总结失败");
          }
        };

        // 续写与收藏代码保留原样 (缩略)
        const doContinue = async (userReq) => {
          if (isGenerating) return;
          isGenerating = true; roche.ui.toast("续写中...");
          try {
            const sys = \`请顺接前文，保持文风。\n【前文】\${vignetteText}\n\${userReq ? '用户期望：'+userReq : '自然顺延剧情。'}\`;
            const append = await fetchAI(sys, []);
            vignetteText += "\\n\\n" + append; dom.vignetteContent.textContent = vignetteText;
            chatMessages.push({ role: "char", name: "系统", content: "剧情已更新。" }); renderChatHistory(); autoSaveCollection();
          } catch(e) { roche.ui.toast("续写失败"); } finally { isGenerating = false; }
        };
        container.querySelector("#lt-continue-ai-btn").onclick = () => doContinue(null);
        container.querySelector("#lt-continue-co-btn").onclick = () => { const input = prompt("请输入剧情走向："); if(input) doContinue(input); };

        async function autoSaveCollection() {
          if(!currentCollectionId) return;
          const col = savedCollections.find(c => c.id === currentCollectionId);
          if(col) { col.content = vignetteText; col.chatHistory = [...chatMessages]; await roche.storage.set("collections", savedCollections); }
        }
        container.querySelector("#lt-save-theater-btn").onclick = async () => {
          if(currentCollectionId) return roche.ui.toast("已在收藏中自动更新");
          currentCollectionId = crypto.randomUUID();
          savedCollections.unshift({ id: currentCollectionId, title: activePrompt?.title || "未命名剧场", charId: memoryConfig.charId, content: vignetteText, chatHistory: [...chatMessages], date: new Date().toLocaleString() });
          await roche.storage.set("collections", savedCollections); roche.ui.toast("已保存至收藏馆");
        };

        function renderCollection() {
          dom.colArea.innerHTML = savedCollections.map(c => \`
            <div class="roche-lt-col-item" data-id="\${c.id}">
              <div class="roche-lt-col-title">\${c.title}</div>
              <div class="roche-lt-col-desc">\${c.content.substring(0, 50)}...</div>
              <div class="roche-lt-col-meta">\${c.date}</div>
            </div>\`).join('');
          dom.colArea.querySelectorAll('.roche-lt-col-item').forEach(el => {
            el.onclick = () => {
              const col = savedCollections.find(c => c.id === el.dataset.id);
              currentCollectionId = col.id; vignetteText = col.content; chatMessages = [...col.chatHistory]; pendingUserMsgs = [];
              dom.vignetteTitle.textContent = col.title; dom.vignetteContent.textContent = vignetteText;
              memoryConfig.charId = col.charId; dom.charSelect.value = col.charId; // 恢复角色
              renderChatHistory(); dom.theaterArea.classList.add("active");
            };
          });
        }
        
        let isFullscreen = false;
        container.querySelector("#lt-fullscreen-btn").onclick = (e) => { isFullscreen = !isFullscreen; dom.theaterArea.classList.toggle("fullscreen", isFullscreen); e.target.textContent = isFullscreen ? "退出全屏" : "全屏"; };
        container.querySelector("#lt-close-theater-btn").onclick = () => { dom.theaterArea.classList.remove("active"); if(isFullscreen) container.querySelector("#lt-fullscreen-btn").click(); if(dom.tabCol.classList.contains('active')) renderCollection(); };
        dom.wrap.querySelector("#lt-back-btn").onclick = () => roche.ui.closeApp();
        
        updatePromptUI(); checkGenerateBtn();
      },
      async unmount(container, roche) {
        const style = document.getElementById("style-roche-little-theater");
        if (style) style.remove();
        container.replaceChildren();
      }
    }
  ]
});

