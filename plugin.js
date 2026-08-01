window.RochePlugin.register({
  id: "roche-plugin-little-theater",
  name: "小剧场 Pro Max",
  version: "1.6.0",
  apps: [
    {
      id: "little-theater-app",
      name: "小剧场",
      icon: "theater_comedy",
      async mount(container, roche) {
        
        // --- 1. 样式定义 ---
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
            
            .roche-lt-prompt-item { flex: 0 0 calc(45% - 6px); min-width: 140px; background: var(--lt-panel); border-radius: 16px; padding: 16px; scroll-snap-align: start; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 2px solid transparent; transition: 0.3s; display: flex; flex-direction: column; justify-content: space-between; position: relative; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
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
            
            .roche-lt-theater-header { display: flex; flex-direction: column; gap:10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--lt-border); flex-shrink: 0; }
            .roche-lt-theater-header-top { display: flex; justify-content: space-between; align-items: center; }
            .roche-lt-theater-title { font-size: 16px; font-weight: 600; color: var(--lt-text-main); }
            .roche-lt-theater-tools { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;}
            
            .roche-lt-toc-bar { display: flex; gap: 10px; align-items: center; }
            .roche-lt-toc-select { flex: 1; padding: 8px 12px; border-radius: 12px; border: 1px solid var(--lt-border); background: var(--lt-input-bg); color: var(--lt-text-main); outline: none; font-size: 13px; appearance: none; -webkit-appearance: none; }
            
            .roche-lt-theater-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
            .roche-lt-vignette-content { font-size: 15px; line-height: 1.8; color: var(--lt-text-main); white-space: pre-wrap; padding: 15px; background: var(--lt-panel); border-radius: 16px; }
            
            .roche-lt-chat-box { background: var(--lt-panel); border-radius: 16px; padding: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px; margin-bottom: 10px; position: relative; }
            .roche-lt-chat-actions-bar { display: flex; justify-content: space-between; padding: 10px 12px; background: var(--lt-input-bg); border-radius: 12px; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
            .roche-lt-chat-history { display: flex; flex-direction: column; gap: 12px; max-height: 250px; overflow-y: auto; position: relative; }
            
            .roche-lt-msg-wrap { display: flex; align-items: flex-start; gap: 0; width: 100%; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
            .roche-lt-msg-check-box { width: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: width 0.2s; margin-top: 15px; }
            .roche-lt-chat-history.select-mode .roche-lt-msg-check-box { width: 28px; }
            .roche-lt-msg-check { width: 16px; height: 16px; accent-color: var(--lt-primary); }
            
            .roche-lt-msg { display: flex; flex-direction: column; max-width: 85%; animation: fadeIn 0.3s; flex: 1; min-width: 0; }
            .roche-lt-msg.user { align-self: flex-end; align-items: flex-end; margin-left: auto; }
            .roche-lt-msg.char { align-self: flex-start; align-items: flex-start; }
            .roche-lt-msg-name { font-size: 11px; color: var(--lt-text-sub); margin-bottom: 4px; padding: 0 4px; }
            .roche-lt-msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; color: var(--lt-text-main); word-break: break-word; }
            .roche-lt-msg.user .roche-lt-msg-bubble { background: var(--lt-user-msg); border-bottom-right-radius: 4px; }
            .roche-lt-msg.char .roche-lt-msg-bubble { background: var(--lt-char-msg); border: 1px solid var(--lt-border); border-bottom-left-radius: 4px; }
            .roche-lt-msg.pending { opacity: 0.6; }
            .roche-lt-msg.pending .roche-lt-msg-bubble { border: 1px dashed var(--lt-primary); }
            .roche-lt-typing { font-style: italic; color: var(--lt-text-sub); animation: blink 1.5s infinite; }

            .roche-lt-quote-bubble { background: rgba(0,0,0,0.05); border-left: 3px solid var(--lt-primary); padding: 6px 10px; border-radius: 4px; font-size: 12px; color: var(--lt-text-sub); margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
            .theme-dark .roche-lt-quote-bubble { background: rgba(255,255,255,0.05); }
            .roche-lt-pending-quote { background: var(--lt-panel); border: 1px solid var(--lt-primary); border-radius: 12px; padding: 8px 12px; font-size: 12px; color: var(--lt-text-sub); display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .roche-lt-pending-quote-close { cursor: pointer; color: #d98888; font-weight: bold; padding: 0 4px; font-size:14px; }

            .roche-lt-chat-history.select-mode .roche-lt-msg { max-width: 100%; }
            .roche-lt-chat-history.select-mode .roche-lt-msg.user { align-items: flex-start; margin-left: 0; }

            .roche-lt-input-group { display: flex; flex-direction: column; gap: 10px; }
            .roche-lt-input-row { display: flex; gap: 8px; align-items: center; }
            .roche-lt-input-row input { flex: 1; padding: 12px 16px; border: 1px solid var(--lt-border); border-radius: 20px; outline: none; background: var(--lt-input-bg); font-size: 14px; color: var(--lt-text-main); transition: 0.2s; min-width: 0; }
            .roche-lt-input-row input:focus { border-color: var(--lt-primary); }
            .roche-lt-chat-hint { font-size: 11px; color: var(--lt-text-sub); text-align: center; }

            .roche-lt-fab-back { position: fixed; bottom: 20px; left: 20px; background: var(--lt-panel); border: 1px solid var(--lt-border); color: var(--lt-text-sub); border-radius: 50%; width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); cursor: pointer; z-index: 1000; font-size: 20px; }
            
            .roche-lt-modal-bg { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); display: flex; justify-content: center; align-items: center; z-index: 2000; opacity: 0; pointer-events: none; transition: 0.3s; padding: 20px; }
            .roche-lt-modal-bg.show { opacity: 1; pointer-events: auto; }
            .roche-lt-modal { background: var(--lt-panel); padding: 24px; border-radius: 20px; width: 100%; max-width: 380px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transform: translateY(20px); transition: 0.3s; }
            .roche-lt-modal-bg.show .roche-lt-modal { transform: translateY(0); }
            
            .roche-lt-modal label { font-size: 13px; color: var(--lt-text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
            .roche-lt-modal input[type="text"], .roche-lt-modal input[type="password"], .roche-lt-modal input[type="number"], .roche-lt-modal textarea, .roche-lt-modal select { width: 100%; margin-bottom: 16px; padding: 12px; border: 1px solid var(--lt-border); border-radius: 12px; background: var(--lt-input-bg); font-size: 14px; color: var(--lt-text-main); outline: none; box-sizing: border-box; }
            .roche-lt-modal textarea { height: 90px; resize: none; font-family: inherit; }
            .roche-lt-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
            .roche-lt-delete-text { color: #d98888; font-size: 13px; align-self: center; cursor: pointer; margin-right: auto; }
            
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes blink { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
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
        
        let settings = (await roche.storage.get("lt_settings")) || {
          theme: "default", wbCatIds: [], chatStyle: "mixed",
          memIncludeCore: true, memIncludeFacts: true, memIncludeChat: true, memChatLimit: 50
        };

        if(settings.wbCatId && !settings.wbCatIds) settings.wbCatIds = [settings.wbCatId];
        if(!settings.wbCatIds) settings.wbCatIds = [];

        let customWorldbooks = (await roche.storage.get("lt_custom_wb")) || [];
        let characters = await roche.character.list();
        let conversations = await roche.conversation.list({ isGroup: false });
        let worldbookCategories = await roche.worldbook.list(); 
        
        let activePrompt = null;
        let theaterChapters = []; 
        let chapterSummary = ""; 
        let currentChapterIdx = 0; 
        let vignetteText = ""; 
        
        let chatMessages = []; 
        let pendingUserMsgs = [];
        let pendingQuote = null; 
        
        let isGenerating = false;
        let isCharTyping = false; 
        let currentCollectionId = null; 
        
        let isSelectMode = false;
        let selectedMsgIds = new Set();
        let searchKeyword = "";
        let activeCategory = "全部";

        function addSafeLongPress(el, onLongPress) {
          let timer; let isDrag = false; let startX, startY;
          const start = (e) => {
            isDrag = false; let touch = e.touches ? e.touches[0] : e; startX = touch.clientX; startY = touch.clientY;
            timer = setTimeout(() => { timer = null; if(!isDrag) onLongPress(); }, 500);
          };
          const move = (e) => {
            let touch = e.touches ? e.touches[0] : e;
            if(Math.abs(touch.clientX - startX) > 10 || Math.abs(touch.clientY - startY) > 10) { isDrag = true; if(timer) clearTimeout(timer); }
          };
          const end = () => { if(timer) clearTimeout(timer); };
          el.addEventListener('touchstart', start, {passive: true}); el.addEventListener('touchmove', move, {passive: true});
          el.addEventListener('touchend', end); el.addEventListener('touchcancel', end);
          el.addEventListener('mousedown', start); el.addEventListener('mousemove', move);
          el.addEventListener('mouseup', end); el.addEventListener('mouseleave', end);
        }

        // --- 3. 初始结构渲染 ---
        container.innerHTML = `
          <div class="roche-lt-container roche-plugin-little-theater" id="lt-main-wrap">
            <div id="lt-back-btn" class="roche-lt-fab-back">←</div>
            <div class="roche-lt-topbar">
              <div class="roche-lt-tabs">
                <div id="tab-home" class="roche-lt-tab active">灵感创作</div>
                <div id="tab-col" class="roche-lt-tab">📚 收藏馆</div>
              </div>
              <div class="roche-lt-icons"><span id="lt-settings-btn" title="全局与世界书设置">⚙️</span></div>
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
                <button id="lt-add-prompt-btn" class="roche-lt-btn-outline">+ 新增</button>
              </div>
              <div class="roche-lt-prompt-scroll" id="lt-prompt-scroll"></div>
              <button id="lt-generate-btn" class="roche-lt-btn roche-lt-generate-btn" disabled>执笔生成</button>
            </div>

            <div class="roche-lt-collection-area hidden" id="lt-collection-area"></div>
            
            <div id="lt-theater-area" class="roche-lt-theater-area">
              <div class="roche-lt-theater-header">
                <div class="roche-lt-theater-header-top">
                  <span id="lt-vignette-title" class="roche-lt-theater-title">剧场内容</span>
                  <div class="roche-lt-theater-tools">
                    <button id="lt-summary-btn" class="roche-lt-btn-outline" style="border-color:#b5929c; color:#b5929c;">📝 探讨收录</button>
                    <button id="lt-save-theater-btn" class="roche-lt-btn-outline" style="border:none;">保存</button>
                    <button id="lt-fullscreen-btn" class="roche-lt-btn-outline">全屏</button>
                    <button id="lt-close-theater-btn" class="roche-lt-btn-outline" style="border:none; background:var(--lt-input-bg);">退出</button>
                  </div>
                </div>
                
                <div class="roche-lt-toc-bar">
                  <span style="font-size:13px; color:var(--lt-text-sub); flex-shrink:0;">📑 目录</span>
                  <select id="lt-toc-select" class="roche-lt-toc-select"></select>
                  <button id="lt-chapter-summary-btn" class="roche-lt-btn-outline" style="padding:4px 8px; font-size:12px;">📝 剧情记忆</button>
                </div>
              </div>
              
              <div class="roche-lt-theater-scroll">
                <div id="lt-vignette-content" class="roche-lt-vignette-content"></div>
                
                <div style="display:flex; gap:10px; margin-bottom: 10px;">
                  <button id="lt-continue-ai-btn" class="roche-lt-btn-outline" style="flex:1;">下一章 (系统续写)</button>
                  <button id="lt-continue-co-btn" class="roche-lt-btn-outline" style="flex:1;">下一章 (定向续写)</button>
                </div>
                
                <div class="roche-lt-chat-box">
                  <div id="lt-chat-actions-bar" class="roche-lt-chat-actions-bar" style="display:none;">
                    <span id="lt-sel-count" style="font-size:12px; font-weight:600;">已选 0 条</span>
                    <div style="display:flex; gap:8px;">
                      <button id="lt-sel-quote" class="roche-lt-btn-outline" style="padding:4px 8px;">引用</button>
                      <button id="lt-sel-del" class="roche-lt-btn-outline" style="padding:4px 8px; border-color:#d98888; color:#d98888;">撤回</button>
                      <button id="lt-sel-cancel" class="roche-lt-btn-outline" style="padding:4px 8px; border:none; background:transparent;">取消</button>
                    </div>
                  </div>

                  <div id="lt-chat-history" class="roche-lt-chat-history"></div>
                  
                  <div class="roche-lt-input-group">
                    <div class="roche-lt-chat-hint">长按消息多选撤回/引用。按回车缓存探讨。</div>
                    <div id="lt-pending-quote-box" class="roche-lt-pending-quote" style="display:none;"></div>
                    
                    <div class="roche-lt-input-row">
                      <button id="lt-chat-reroll-btn" class="roche-lt-icon-btn" style="width:42px;height:42px;" title="重Roll最后回复">🎲</button>
                      <input type="text" id="lt-chat-input" placeholder="探讨剧情...">
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

        const dom = {
          wrap: container.querySelector("#lt-main-wrap"), tabHome: container.querySelector("#tab-home"), tabCol: container.querySelector("#tab-col"),
          configArea: container.querySelector("#lt-config-area"), colArea: container.querySelector("#lt-collection-area"),
          searchInput: container.querySelector("#lt-search-input"), catList: container.querySelector("#lt-category-list"),
          promptScroll: container.querySelector("#lt-prompt-scroll"), generateBtn: container.querySelector("#lt-generate-btn"),
          charSelect: container.querySelector("#lt-char-select"), convSelect: container.querySelector("#lt-conv-select"),
          theaterArea: container.querySelector("#lt-theater-area"), tocSelect: container.querySelector("#lt-toc-select"),
          vignetteContent: container.querySelector("#lt-vignette-content"), vignetteTitle: container.querySelector("#lt-vignette-title"),
          chatActionBar: container.querySelector("#lt-chat-actions-bar"), chatHistory: container.querySelector("#lt-chat-history"),
          chatInput: container.querySelector("#lt-chat-input"), modalWrapper: container.querySelector("#lt-modal-wrapper"), modalContent: container.querySelector("#lt-modal-content")
        };

        function applyTheme() { dom.wrap.className = `roche-lt-container roche-plugin-little-theater theme-${settings.theme}`; }
        applyTheme();

        dom.tabHome.onclick = () => { dom.tabHome.classList.add('active'); dom.tabCol.classList.remove('active'); dom.configArea.classList.remove('hidden'); dom.colArea.classList.add('hidden'); };
        dom.tabCol.onclick = () => { dom.tabCol.classList.add('active'); dom.tabHome.classList.remove('active'); dom.colArea.classList.remove('hidden'); dom.configArea.classList.add('hidden'); renderCollection(); };

        // --- 4. 提示词库 ---
        function updatePromptUI() {
          const cats = ["全部", ...new Set(prompts.map(p => p.category || "未分类"))];
          dom.catList.innerHTML = cats.map(c => `<div class="roche-lt-cat-btn ${activeCategory === c ? 'active' : ''}" data-cat="${c}">${c}</div>`).join('');
          dom.catList.querySelectorAll('.roche-lt-cat-btn').forEach(el => { el.onclick = () => { activeCategory = el.dataset.cat; updatePromptUI(); }; });
          const filtered = prompts.filter(p => (activeCategory === "全部" || (p.category || "未分类") === activeCategory) && (p.title.includes(searchKeyword) || p.content.includes(searchKeyword)));
          dom.promptScroll.innerHTML = filtered.map(p => `
            <div class="roche-lt-prompt-item ${activePrompt?.id === p.id ? 'active' : ''}" data-id="${p.id}">
              <div class="roche-lt-prompt-title">${p.title}</div><div class="roche-lt-prompt-cat">${p.category || '未分类'}</div>
            </div>
          `).join('');
          dom.promptScroll.querySelectorAll('.roche-lt-prompt-item').forEach(el => {
            const pId = el.dataset.id;
            el.onclick = () => { activePrompt = prompts.find(p => p.id === pId); updatePromptUI(); dom.generateBtn.disabled = !(activePrompt && dom.charSelect.value); };
            addSafeLongPress(el, () => openPromptModal(pId));
          });
        }
        dom.searchInput.oninput = (e) => { searchKeyword = e.target.value; updatePromptUI(); };

        // --- 5. 模态框配置 ---
        function openPromptModal(editId = null) {
          const p = editId ? prompts.find(pr => pr.id === editId) : { title:'', category:'', content:'' };
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">${editId ? '修改' : '创作'}灵感</h3>
            <input type="text" id="m-title" placeholder="标题" value="${p.title}">
            <input type="text" id="m-cat" placeholder="分类标签" value="${p.category}">
            <textarea id="m-content" placeholder="剧情设定...">${p.content}</textarea>
            <div class="roche-lt-modal-actions">
              ${editId ? `<span id="m-del" class="roche-lt-delete-text">删除</span>` : ''}
              <button id="m-cancel" class="roche-lt-btn-outline">取消</button><button id="m-save" class="roche-lt-btn" style="padding: 8px 20px;">保存</button>
            </div>
          `;
          dom.modalWrapper.classList.add("show");
          document.getElementById('m-cancel').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('m-save').onclick = async () => {
            const t = document.getElementById('m-title').value.trim(); if(!t) return roche.ui.toast("请输入标题");
            const newData = { title: t, category: document.getElementById('m-cat').value.trim()||"未分类", content: document.getElementById('m-content').value.trim() };
            if (editId) Object.assign(prompts.find(pr => pr.id === editId), newData); else prompts.unshift({ id: crypto.randomUUID(), ...newData });
            await roche.storage.set("prompts", prompts); dom.modalWrapper.classList.remove("show"); updatePromptUI();
          };
          if(editId) document.getElementById('m-del').onclick = async () => { prompts = prompts.filter(pr => pr.id !== editId); if(activePrompt?.id === editId) activePrompt = null; await roche.storage.set("prompts", prompts); dom.modalWrapper.classList.remove("show"); updatePromptUI(); };
        }
        container.querySelector("#lt-add-prompt-btn").onclick = () => openPromptModal();

        container.querySelector("#lt-mem-config-btn").onclick = () => {
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">记忆挂载偏好 (当前角色)</h3>
            <label style="cursor:pointer;"><input type="checkbox" id="c-core" ${settings.memIncludeCore ? 'checked' : ''}> 挂载「核心记忆 (Core)」</label>
            <label style="cursor:pointer;"><input type="checkbox" id="c-fact" ${settings.memIncludeFacts ? 'checked' : ''}> 挂载「事实记忆 (Facts)」</label>
            <label style="cursor:pointer;"><input type="checkbox" id="c-chat" ${settings.memIncludeChat ? 'checked' : ''}> 挂载「近期聊天记录」</label>
            <div style="margin-top: 15px;"><span style="font-size:12px; color:var(--lt-text-sub);">抽取条数 (1-100)</span><input type="number" id="c-limit" value="${settings.memChatLimit}" min="1" max="100" style="margin-bottom:0; margin-top:5px;"></div>
            <div class="roche-lt-modal-actions" style="margin-top: 20px;"><button id="c-close" class="roche-lt-btn-outline">取消</button><button id="c-save" class="roche-lt-btn" style="padding: 8px 20px;">保存</button></div>
          `;
          dom.modalWrapper.classList.add("show");
          document.getElementById('c-close').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('c-save').onclick = async () => {
            settings.memIncludeCore = document.getElementById('c-core').checked; settings.memIncludeFacts = document.getElementById('c-fact').checked; settings.memIncludeChat = document.getElementById('c-chat').checked;
            settings.memChatLimit = Math.max(1, Math.min(100, parseInt(document.getElementById('c-limit').value) || 50));
            await roche.storage.set("lt_settings", settings); dom.modalWrapper.classList.remove("show"); roche.ui.toast("偏好已保存");
          };
        };

        let currentSettingsView = 'main'; let editCustomWbId = null;
        function renderSettingsModal() {
          if (currentSettingsView === 'main') {
            dom.modalContent.innerHTML = `
              <h3 style="margin:0 0 15px 0;">剧场全局设置</h3>
              <span style="font-size:12px; color:var(--lt-text-sub);">UI 主题</span>
              <select id="s-theme"><option value="default" ${settings.theme==='default'?'selected':''}>莫兰迪浅蓝</option><option value="pink" ${settings.theme==='pink'?'selected':''}>樱花粉</option><option value="dark" ${settings.theme==='dark'?'selected':''}>暗夜蓝 (深色)</option></select>
              <span style="font-size:12px; color:var(--lt-text-sub);">角色对话模式</span>
              <select id="s-style"><option value="mixed" ${settings.chatStyle==='mixed'?'selected':''}>对话 + 动作描写</option><option value="pure" ${settings.chatStyle==='pure'?'selected':''}>纯对话</option></select>
              <div style="font-size:13px; font-weight:600; margin-top:10px; margin-bottom:8px;">1. 主世界书挂载 (多选)</div>
              <div style="max-height: 90px; overflow-y: auto; border: 1px solid var(--lt-border); border-radius: 8px; padding: 8px; margin-bottom: 15px; background: var(--lt-input-bg);">
                ${worldbookCategories.map(w => `<label style="cursor:pointer; display:flex; align-items:center; margin-bottom:5px; font-size:13px; gap:8px;"><input type="checkbox" class="c-wb-cat" value="${w.id}" ${settings.wbCatIds?.includes(w.id)?'checked':''}> <span>${w.name}</span></label>`).join('')}
              </div>
              <div style="font-size:13px; font-weight:600; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;"><span>2. 专属世界书 (打勾生效)</span><span id="s-wb-add" style="color:var(--lt-primary); cursor:pointer; font-size:12px;">+ 新增设定</span></div>
              <div id="s-wb-list" style="max-height: 110px; overflow-y: auto; border: 1px solid var(--lt-border); border-radius: 8px; padding: 8px; margin-bottom: 15px; background: var(--lt-input-bg);"></div>
              <div class="roche-lt-modal-actions"><button id="s-close" class="roche-lt-btn-outline">取消</button><button id="s-save" class="roche-lt-btn" style="padding: 8px 20px;">保存</button></div>
            `;
            const list = document.getElementById('s-wb-list');
            list.innerHTML = customWorldbooks.length === 0 ? '<div style="color:var(--lt-text-sub); text-align:center; font-size:12px; margin-top:5px;">暂无专属设定</div>' : customWorldbooks.map(c => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--lt-panel); padding:8px; margin-bottom:6px; border-radius:6px; border:1px solid var(--lt-border);">
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer; overflow:hidden; flex:1;"><input type="checkbox" class="c-wb-active" data-id="${c.id}" ${c.isActive !== false ? 'checked' : ''} style="margin:0; width:auto;"><span style="font-weight:600; font-size:13px; color:var(--lt-text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.name}</span></label>
                <div style="flex-shrink:0; margin-left:8px;"><span class="c-wb-edit" data-id="${c.id}" style="color:var(--lt-primary); cursor:pointer; margin-right:10px; font-size:12px;">编辑</span><span class="c-wb-del" data-id="${c.id}" style="color:#d98888; cursor:pointer; font-size:12px;">删除</span></div>
              </div>`).join('');
            list.querySelectorAll('.c-wb-edit').forEach(el => { el.onclick = () => { currentSettingsView = 'edit-wb'; editCustomWbId = el.dataset.id; renderSettingsModal(); }; });
            list.querySelectorAll('.c-wb-del').forEach(el => { el.onclick = async () => { customWorldbooks = customWorldbooks.filter(c => c.id !== el.dataset.id); await roche.storage.set("lt_custom_wb", customWorldbooks); renderSettingsModal(); }; });
            document.getElementById('s-wb-add').onclick = () => { currentSettingsView = 'edit-wb'; editCustomWbId = null; renderSettingsModal(); };
            document.getElementById('s-close').onclick = () => dom.modalWrapper.classList.remove("show");
            document.getElementById('s-save').onclick = async () => {
              settings.theme = document.getElementById('s-theme').value; settings.chatStyle = document.getElementById('s-style').value;
              settings.wbCatIds = Array.from(document.querySelectorAll('.c-wb-cat:checked')).map(cb => cb.value);
              document.querySelectorAll('.c-wb-active').forEach(cb => { let wb = customWorldbooks.find(c => c.id === cb.dataset.id); if(wb) wb.isActive = cb.checked; });
              await roche.storage.set("lt_settings", settings); await roche.storage.set("lt_custom_wb", customWorldbooks);
              applyTheme(); dom.modalWrapper.classList.remove("show"); roche.ui.toast("设置已保存");
            };
          } else if (currentSettingsView === 'edit-wb') {
            const cWb = editCustomWbId ? customWorldbooks.find(c => c.id === editCustomWbId) : { name:'', content:'' };
            dom.modalContent.innerHTML = `
              <h3 style="margin:0 0 15px 0;">${editCustomWbId ? '编辑' : '新增'}专属设定</h3>
              <input type="text" id="ew-name" placeholder="设定名称 (如：小剧场背景)" value="${cWb.name}">
              <textarea id="ew-content" placeholder="填写具体的设定内容，这部分内容会在剧场执笔和探讨时提供给 AI..." style="height:120px;">${cWb.content}</textarea>
              <div class="roche-lt-modal-actions" style="margin-top: 15px;"><button id="ew-cancel" class="roche-lt-btn-outline">返回</button><button id="ew-save" class="roche-lt-btn" style="padding: 8px 20px;">保存设定</button></div>
            `;
            document.getElementById('ew-cancel').onclick = () => { currentSettingsView = 'main'; renderSettingsModal(); };
            document.getElementById('ew-save').onclick = async () => {
              const n = document.getElementById('ew-name').value.trim(); const ct = document.getElementById('ew-content').value.trim();
              if(!n || !ct) return roche.ui.toast("名称和内容不能为空");
              if(editCustomWbId) Object.assign(customWorldbooks.find(c => c.id === editCustomWbId), { name: n, content: ct });
              else customWorldbooks.unshift({ id: crypto.randomUUID(), name: n, content: ct, isActive: true });
              await roche.storage.set("lt_custom_wb", customWorldbooks); currentSettingsView = 'main'; renderSettingsModal();
            };
          }
        }
        container.querySelector("#lt-settings-btn").onclick = () => { currentSettingsView = 'main'; dom.modalWrapper.classList.add("show"); renderSettingsModal(); };

        // --- 6. AI 核心逻辑与上下文构建 (强化防OOC) ---
        const strictOOCPrompt = `
【严格行为准则】：
1. 必须完全遵循上方提供的【角色人设】和【世界观设定】。
2. 绝对禁止OOC！禁止扮演俗套的霸道总裁，禁止使用一切烂俗、油腻的语录（如“呵，女人”、“有趣”等）。
3. 除非人设明确要求，否则绝对禁止每句话都使用反问句或挑衅的口吻。请保持真实、自然、符合角色原始性格的表达！`;

        async function fetchAI(sysPrompt, msgs = []) {
          const res = await roche.ai.chat({ messages: [{ role: "system", content: sysPrompt }, ...msgs], temperature: 0.75 });
          return res.text;
        }

        async function buildContext(charId, convId) {
          const userP = await roche.persona.getActiveUserPersona(); const char = await roche.character.get(charId); let extra = "";
          if (convId) {
            const lt = await roche.memory.getLongTerm({ conversationId: convId, limit: 100 });
            if (settings.memIncludeCore && lt.core && lt.core.summary) extra += `【核心设定】：${lt.core.summary}\n`;
            if (settings.memIncludeFacts && lt.facts && lt.facts.length > 0) { const factLines = lt.facts.map(f => f.summaryText || f.action || f.text).filter(Boolean); if (factLines.length > 0) extra += `【既往经历】：${factLines.join("；")}\n`; }
            if (settings.memIncludeChat) { const st = await roche.memory.getShortTerm({ conversationId: convId, limit: settings.memChatLimit || 50 }); if (st && st.length > 0) extra += `【近期对话参考】：\n${st.map(m => `${m.senderName || m.senderHandle || '未知'}: ${m.text}`).join("\n")}\n`; }
          }
          if (settings.wbCatIds && settings.wbCatIds.length > 0) {
            let wbContentArr = [];
            for (let catId of settings.wbCatIds) { try { const entries = await roche.worldbook.getEntries({ categoryId: catId, scope: "global" }); wbContentArr.push(...entries.map(e => e.content || e.text || "").filter(Boolean)); } catch(e) {} }
            if (wbContentArr.length > 0) extra += `【主世界观设定】：\n${wbContentArr.join("；\n")}\n`;
          }
          const activeCustomWb = customWorldbooks.filter(c => c.isActive !== false);
          if (activeCustomWb.length > 0) extra += `【专属小剧场设定】：\n${activeCustomWb.map(c => `${c.name}：${c.content}`).join("；\n")}\n`;
          return { user: userP, char, extra };
        }

        function getTheaterContextForAI() {
          let ctx = "";
          if (chapterSummary) ctx += `【小剧场前情提要】：\n${chapterSummary}\n\n`;
          const unsum = theaterChapters.filter(c => !c.isSummarized);
          if (unsum.length > 0) ctx += `【近期未总结剧情】：\n${unsum.map(c => `[${c.title}]：\n${c.content}`).join('\n\n')}\n\n`;
          return ctx;
        }

// ==================== 第一部分代码结束 ====================
// ==================== 第二部分代码开始 ====================

        dom.charSelect.onchange = () => { dom.generateBtn.disabled = !(activePrompt && dom.charSelect.value); };

        function updateTOCUI() {
          dom.tocSelect.innerHTML = theaterChapters.map((c, i) => `<option value="${i}" ${i === currentChapterIdx ? 'selected' : ''}>${c.title}</option>`).join('');
          dom.vignetteContent.textContent = theaterChapters[currentChapterIdx]?.content || "";
        }
        dom.tocSelect.onchange = (e) => { currentChapterIdx = parseInt(e.target.value); updateTOCUI(); };

        dom.generateBtn.onclick = async () => {
          if (!activePrompt || !dom.charSelect.value) return;
          isGenerating = true; dom.generateBtn.textContent = "执笔中...";
          
          try {
            const ctx = await buildContext(dom.charSelect.value, dom.convSelect.value);
            const sys = `你是一个优秀的小剧场作家。请根据设定写一段沉浸式短文。
            用户(${ctx.user.name})：${ctx.user.persona || ""}
            搭档(${ctx.char.name})：${ctx.char.persona || ""}
            ${ctx.extra}
            ${strictOOCPrompt}
            【剧场要求】标题：${activePrompt.title} \n剧情设定：${activePrompt.content}
            要求：直接输出正文，文笔细腻，符合人设，坚决不油腻。`;

            const text = await fetchAI(sys, [{ role: "user", content: "请开始编写第一章。" }]);
            
            theaterChapters = [{ title: "第1章", content: text, isSummarized: false }];
            currentChapterIdx = 0; vignetteText = text; chapterSummary = "";
            chatMessages = []; pendingUserMsgs = []; pendingQuote = null;
            
            quitSelectMode(); renderPendingQuoteUI(); currentCollectionId = null;
            dom.vignetteTitle.textContent = activePrompt.title;
            updateTOCUI(); renderChatHistory(); dom.theaterArea.classList.add("active");
          } catch(e) { roche.ui.toast("生成失败：" + e.message); }
          finally { isGenerating = false; dom.generateBtn.textContent = "执笔生成"; }
        };

        // --- 7. 聊天、气泡引用、防油腻重Roll ---
        function quitSelectMode() {
          isSelectMode = false; selectedMsgIds.clear();
          dom.chatHistory.classList.remove("select-mode");
          dom.chatActionBar.style.display = "none"; renderChatHistory();
        }

        function renderPendingQuoteUI() {
          const box = dom.wrap.querySelector("#lt-pending-quote-box");
          if (pendingQuote) {
            box.style.display = "flex";
            box.innerHTML = `<div style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><span style="color:var(--lt-primary);font-weight:bold;">引用：</span>${pendingQuote.text}</div><div class="roche-lt-pending-quote-close" id="lt-pq-close">✖</div>`;
            box.querySelector("#lt-pq-close").onclick = () => { pendingQuote = null; renderPendingQuoteUI(); };
          } else { box.style.display = "none"; box.innerHTML = ""; }
        }

        dom.chatHistory.addEventListener('change', (e) => {
          if (e.target.classList.contains('roche-lt-msg-check')) {
            const wrap = e.target.closest('.roche-lt-msg-wrap'); if(!wrap) return;
            const id = wrap.dataset.id;
            if(e.target.checked) selectedMsgIds.add(id); else selectedMsgIds.delete(id);
            document.getElementById('lt-sel-count').textContent = `已选 ${selectedMsgIds.size} 条`;
          }
        });

        container.querySelector('#lt-sel-quote').onclick = () => {
          if(selectedMsgIds.size === 0) return;
          const msgs = chatMessages.filter(m => selectedMsgIds.has(m.id));
          const quoteText = msgs.map(m => `${m.name}: ${m.content}`).join(" | ");
          pendingQuote = { text: quoteText }; renderPendingQuoteUI(); quitSelectMode();
        };
        container.querySelector('#lt-sel-del').onclick = () => {
          if(selectedMsgIds.size === 0) return;
          chatMessages = chatMessages.filter(m => !selectedMsgIds.has(m.id));
          quitSelectMode(); autoSaveCollection();
        };
        container.querySelector('#lt-sel-cancel').onclick = () => quitSelectMode();

        function renderChatHistory() {
          const scrollBox = dom.chatHistory;
          const isAtBottom = scrollBox.scrollHeight - scrollBox.scrollTop <= scrollBox.clientHeight + 15;
          let html = '';
          
          chatMessages.forEach(m => {
            const checked = selectedMsgIds.has(m.id) ? "checked" : "";
            html += `
              <div class="roche-lt-msg-wrap" data-id="${m.id}">
                <div class="roche-lt-msg-check-box"><input type="checkbox" class="roche-lt-msg-check" ${checked}></div>
                <div class="roche-lt-msg ${m.role}">
                  <div class="roche-lt-msg-name">${m.name}</div>
                  <div class="roche-lt-msg-bubble">
                    ${m.quote ? `<div class="roche-lt-quote-bubble">${m.quote.text}</div>` : ''}
                    ${m.content}
                  </div>
                </div>
              </div>`;
          });
          
          pendingUserMsgs.forEach(text => {
             html += `<div class="roche-lt-msg-wrap"><div class="roche-lt-msg-check-box"></div><div class="roche-lt-msg user pending"><div class="roche-lt-msg-name">我 (未发送)</div><div class="roche-lt-msg-bubble">${pendingQuote ? `<div class="roche-lt-quote-bubble">${pendingQuote.text}</div>` : ''}${text}</div></div></div>`;
          });

          if (isCharTyping) {
             html += `<div class="roche-lt-msg-wrap"><div class="roche-lt-msg-check-box"></div><div class="roche-lt-msg char"><div class="roche-lt-msg-name">对方</div><div class="roche-lt-msg-bubble"><span class="roche-lt-typing">对方正在输入...</span></div></div></div>`;
          }

          dom.chatHistory.innerHTML = html;
          
          if (!isSelectMode) {
            dom.chatHistory.querySelectorAll('.roche-lt-msg-wrap').forEach(el => {
              if(!el.dataset.id) return;
              addSafeLongPress(el, () => {
                if(isGenerating || isCharTyping || isSelectMode) return;
                isSelectMode = true; selectedMsgIds.add(el.dataset.id);
                dom.chatHistory.classList.add("select-mode"); dom.chatActionBar.style.display = "flex";
                document.getElementById('lt-sel-count').textContent = `已选 ${selectedMsgIds.size} 条`;
                const cb = el.querySelector('.roche-lt-msg-check'); if (cb) cb.checked = true;
              });
            });
          }
          if (isAtBottom) { setTimeout(() => { scrollBox.scrollTop = scrollBox.scrollHeight; }, 10); }
        }

        dom.chatInput.onkeypress = (e) => { if (e.key === "Enter") { const text = dom.chatInput.value.trim(); if(text) { pendingUserMsgs.push(text); dom.chatInput.value = ""; renderChatHistory(); } } };

        container.querySelector("#lt-chat-send-btn").onclick = async () => {
          const directText = dom.chatInput.value.trim(); if(directText) { pendingUserMsgs.push(directText); dom.chatInput.value = ""; }
          if(pendingUserMsgs.length === 0 || isCharTyping || isGenerating) return;
          
          const combinedMsg = pendingUserMsgs.join(" ");
          const ctx = await buildContext(dom.charSelect.value, dom.convSelect.value);
          const userName = ctx.user.name || "我"; const charName = ctx.char.name || "角色";
          
          const msgObj = { id: crypto.randomUUID(), role: "user", name: userName, content: combinedMsg };
          if(pendingQuote) { msgObj.quote = pendingQuote; pendingQuote = null; renderPendingQuoteUI(); }
          chatMessages.push(msgObj);
          pendingUserMsgs = []; isCharTyping = true; renderChatHistory();
          
          try {
            const styleReq = settings.chatStyle === 'pure' ? '【重要要求】：请只输出你的对白，不要包含动作描写和心理活动。' : '可以包含动作和心理描写。';
            const theaterCtx = getTheaterContextForAI();
            const activeContent = theaterChapters[currentChapterIdx]?.content || "";
            
            // 【重要】聊天系统提示词注入记忆与防油腻
            const sys = `你是${charName}，正在和${userName}一起看关于你们的小说。
            【角色人设】：${ctx.char.persona || "无"}
            ${ctx.extra}
            ${theaterCtx}
            【当前正在阅读的章节】(${theaterChapters[currentChapterIdx]?.title})：\n${activeContent}
            ${strictOOCPrompt}
            任务：自然回应用户的探讨，保持人设。${styleReq}`;
            
            const apiMsgs = chatMessages.map(m => { const content = m.quote ? `[回复引用：“${m.quote.text}”] ${m.content}` : m.content; return { role: m.role==='user'?'user':'assistant', content }; });
            const fullReply = await fetchAI(sys, apiMsgs);
            
            isCharTyping = false; 
            const sentences = fullReply.match(/[^。！？.!?\n]+[。！？.!?\n]*/g) || [fullReply];
            for (let s of sentences) {
              let text = s.trim(); if(!text) continue;
              chatMessages.push({ id: crypto.randomUUID(), role: "char", name: charName, content: text });
              renderChatHistory(); await new Promise(r => setTimeout(r, 600)); 
            }
            autoSaveCollection(); 
          } catch(e) { isCharTyping = false; roche.ui.toast("回复失败"); chatMessages.pop(); renderChatHistory(); }
        };

        container.querySelector("#lt-chat-reroll-btn").onclick = () => {
          if (isCharTyping || isGenerating) return roche.ui.toast("AI正在忙碌...");
          let lastUserIdx = -1;
          for (let i = chatMessages.length - 1; i >= 0; i--) { if (chatMessages[i].role === 'user') { lastUserIdx = i; break; } }
          
          let deleteStartIdx = lastUserIdx === -1 ? 0 : lastUserIdx + 1;
          if (deleteStartIdx >= chatMessages.length) return roche.ui.toast("没有可重Roll的角色回复。");
          
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">重录角色回复</h3>
            <textarea id="rr-hint" placeholder="填写强制重录指令（如'不许反问'，'正常说话'）。也可空着直接重roll..." style="height:90px;"></textarea>
            <div class="roche-lt-modal-actions" style="margin-top:15px;"><button id="rr-cancel" class="roche-lt-btn-outline">取消</button><button id="rr-save" class="roche-lt-btn" style="padding: 8px 20px;">确认重Roll</button></div>
          `;
          dom.modalWrapper.classList.add("show");
          document.getElementById('rr-cancel').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('rr-save').onclick = () => {
            const hint = document.getElementById('rr-hint').value.trim(); dom.modalWrapper.classList.remove("show");
            chatMessages.splice(deleteStartIdx, chatMessages.length - deleteStartIdx);
            doReRoll(hint);
          };
        };

        async function doReRoll(hint) {
          isCharTyping = true; renderChatHistory();
          try {
            const ctx = await buildContext(dom.charSelect.value, dom.convSelect.value);
            const userName = ctx.user.name || "我"; const charName = ctx.char.name || "角色";
            const theaterCtx = getTheaterContextForAI();
            const activeContent = theaterChapters[currentChapterIdx]?.content || "";
            
            let sys = `你是${charName}，正在和${userName}一起看关于你们的小说。
            【角色人设】：${ctx.char.persona || "无"}
            ${ctx.extra}
            ${theaterCtx}
            【当前正在阅读的章节】(${theaterChapters[currentChapterIdx]?.title})：\n${activeContent}
            ${strictOOCPrompt}
            任务：自然回应用户的探讨，保持人设。`;
            if(settings.chatStyle === 'pure') sys += "【重要要求】：请只输出你的对白。";
            
            const apiMsgs = chatMessages.map(m => { const content = m.quote ? `[回复引用：“${m.quote.text}”] ${m.content}` : m.content; return { role: m.role==='user'?'user':'assistant', content }; });
            
            const reqMsg = hint ? `【最高强制系统指令】：完全抛弃上一轮的答复格式，严格遵从该要求：“${hint}”，重新回复。` : `【强制系统指令】：使用更加自然、符合原设定的口吻重新回复，不要有丝毫油腻和刻意。`;
            apiMsgs.push({ role: "user", content: reqMsg });
            
            const fullReply = await fetchAI(sys, apiMsgs);
            isCharTyping = false;
            const sentences = fullReply.match(/[^。！？.!?\n]+[。！？.!?\n]*/g) || [fullReply];
            for (let s of sentences) {
              let text = s.trim(); if(!text) continue;
              chatMessages.push({ id: crypto.randomUUID(), role: "char", name: charName, content: text });
              renderChatHistory(); await new Promise(r => setTimeout(r, 600)); 
            }
            autoSaveCollection();
          } catch(e) { isCharTyping = false; renderChatHistory(); roche.ui.toast("重Roll失败"); }
        }

        // --- 8. 剧情章节总结系统 (防报错) ---
        container.querySelector("#lt-chapter-summary-btn").onclick = () => {
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">剧情记忆总结 (防爆炸)</h3>
            <p style="font-size:12px; color:var(--lt-text-sub);">合并已读章节，让小剧场记住关键剧情，避免聊天卡顿。</p>
            <div style="max-height: 120px; overflow-y: auto; border: 1px solid var(--lt-border); border-radius: 8px; padding: 8px; margin-bottom: 10px; background: var(--lt-input-bg);">
              ${theaterChapters.map((c, i) => `
                <label style="cursor:${c.isSummarized ? 'not-allowed' : 'pointer'}; display:flex; align-items:center; margin-bottom:5px; font-size:13px; gap:8px; opacity: ${c.isSummarized ? '0.5' : '1'};">
                  <input type="checkbox" class="cs-chap-cb" value="${i}" ${c.isSummarized ? 'checked disabled' : ''}> 
                  <span>${c.title} ${c.isSummarized ? '(已总结)' : ''}</span>
                </label>
              `).join('')}
            </div>
            <button id="cs-ai-btn" class="roche-lt-btn-outline" style="width:100%; margin-bottom:10px;">✨ AI 合并总结选中的章节</button>
            <textarea id="cs-text" placeholder="剧情总结内容..." style="height: 120px; font-size:13px; line-height:1.5;">${chapterSummary}</textarea>
            <div class="roche-lt-modal-actions" style="margin-top: 10px;"><button id="cs-cancel" class="roche-lt-btn-outline">取消</button><button id="cs-save" class="roche-lt-btn" style="padding: 8px 20px;">保存锁定</button></div>
          `;
          dom.modalWrapper.classList.add("show");
          document.getElementById('cs-cancel').onclick = () => dom.modalWrapper.classList.remove("show");
          
          document.getElementById('cs-ai-btn').onclick = async () => {
            if(isGenerating) return roche.ui.toast("AI忙碌中");
            const cbs = Array.from(document.querySelectorAll('.cs-chap-cb:checked:not(:disabled)'));
            if(cbs.length === 0) return roche.ui.toast("请至少选择一个未总结的章节");
            
            isGenerating = true; const btn = document.getElementById('cs-ai-btn'); btn.textContent = "正在生成总结...";
            try {
              // 防爆 Token 截断，每章最多取 800 字
              const selectedTexts = cbs.map(cb => { const idx = parseInt(cb.value); return `[${theaterChapters[idx].title}]：\n${theaterChapters[idx].content.substring(0, 800)}`; }).join('\n\n');
              const currentSum = document.getElementById('cs-text').value.trim();
              const sys = `你是一个小剧场剧情记忆整理助手。你需要将新章节的内容整合进现有的剧情总结中，梳理清楚人物、剧情关系、事件发展和情感变化。
              【已有前情提要】：\n${currentSum || "无"}
              【本次需合并的章节内容】：\n${selectedTexts}
              任务：输出一份涵盖前情提要和新增章节的完整剧情总结，直接输出正文。不要输出多余解释。`;
              const newSum = await fetchAI(sys, []);
              document.getElementById('cs-text').value = newSum; roche.ui.toast("总结生成完毕");
            } catch(e) { roche.ui.toast("生成失败：" + e.message); } 
            finally { isGenerating = false; btn.textContent = "✨ AI 合并总结选中的章节"; }
          };
          
          document.getElementById('cs-save').onclick = () => {
            chapterSummary = document.getElementById('cs-text').value.trim();
            document.querySelectorAll('.cs-chap-cb:checked:not(:disabled)').forEach(cb => { theaterChapters[parseInt(cb.value)].isSummarized = true; });
            dom.modalWrapper.classList.remove("show"); roche.ui.toast("剧情总结已更新"); autoSaveCollection();
          };
        };

        // --- 9. 下一章生成与定向模式 (修复增强) ---
        const doNextChapter = async (userReq) => {
          if (isGenerating || isCharTyping) return;
          isGenerating = true; roche.ui.toast("执笔新章节中...");
          
          const newChapterTitle = `第${theaterChapters.length + 1}章`;
          theaterChapters.push({ title: newChapterTitle, content: "奋笔疾书中...", isSummarized: false });
          currentChapterIdx = theaterChapters.length - 1;
          updateTOCUI(); 
          
          try {
            const ctx = await buildContext(dom.charSelect.value, dom.convSelect.value);
            const theaterCtx = getTheaterContextForAI();
            
            const sys = `你是一个优秀的小剧场作家。请接续前文，保持文风和人设一致。
            用户(${ctx.user.name})：${ctx.user.persona || ""}
            搭档(${ctx.char.name})：${ctx.char.persona || ""}
            ${ctx.extra}
            ${theaterCtx}
            ${strictOOCPrompt}
            任务要求：直接输出新一章的正文，绝不能输出任何解释性废话。`;

            const reqContent = userReq ? `【剧情走向指令】：${userReq}` : "【指令】：请紧承上文，自然发展剧情，写出丰富生动的新一章。";
            const newText = await fetchAI(sys, [{ role: "user", content: reqContent }]);
            
            theaterChapters[currentChapterIdx].content = newText;
            vignetteText = newText;
            
            chatMessages.push({ id: crypto.randomUUID(), role: "char", name: "系统", content: `✨ ${newChapterTitle}已生成。` });
            updateTOCUI(); renderChatHistory(); autoSaveCollection();
          } catch(e) { 
            theaterChapters.pop(); currentChapterIdx = theaterChapters.length - 1; updateTOCUI();
            roche.ui.toast("续写失败：" + e.message); 
          }
          finally { isGenerating = false; }
        };
        
        container.querySelector("#lt-continue-ai-btn").onclick = () => doNextChapter(null);
        
        // 全新的定向弹窗
        container.querySelector("#lt-continue-co-btn").onclick = async () => {
          const charName = dom.charSelect.options[dom.charSelect.selectedIndex]?.text || "角色";
          dom.modalContent.innerHTML = `
            <h3 style="margin:0 0 15px 0;">定向下一章</h3>
            <div style="display:flex; gap:10px; margin-bottom: 15px;">
              <button id="nx-user" class="roche-lt-btn-outline" style="flex:1;">以我为主导/视角</button>
              <button id="nx-char" class="roche-lt-btn-outline" style="flex:1;">以${charName}为主导/视角</button>
            </div>
            <textarea id="nx-custom-text" placeholder="或者在此详细描述你期望的后续剧情走向..." style="height: 80px; font-size:13px;"></textarea>
            <div class="roche-lt-modal-actions" style="margin-top: 10px;">
              <button id="nx-cancel" class="roche-lt-btn-outline">取消</button>
              <button id="nx-custom-btn" class="roche-lt-btn" style="padding: 8px 20px;">自定义生成</button>
            </div>
          `;
          dom.modalWrapper.classList.add("show");
          
          document.getElementById('nx-cancel').onclick = () => dom.modalWrapper.classList.remove("show");
          document.getElementById('nx-user').onclick = () => { dom.modalWrapper.classList.remove("show"); doNextChapter("请以我的视角或行动为核心来主导本章的发展。"); };
          document.getElementById('nx-char').onclick = () => { dom.modalWrapper.classList.remove("show"); doNextChapter(`请以${charName}的视角或行动为核心来主导本章的发展。`); };
          document.getElementById('nx-custom-btn').onclick = () => {
            const txt = document.getElementById('nx-custom-text').value.trim();
            if(!txt) return roche.ui.toast("请输入自定义剧情");
            dom.modalWrapper.classList.remove("show"); doNextChapter(txt);
          };
        };

        // --- 10. 探讨记录收录主记忆 ---
        container.querySelector("#lt-summary-btn").onclick = async () => {
          if(!dom.convSelect.value) { return roche.ui.toast("请先在外部选择挂载一个记忆会话。"); }
          if(isGenerating || isCharTyping) return roche.ui.toast("AI 正在忙碌。");
          isGenerating = true; roche.ui.toast("正在生成探讨回忆...");
          try {
            const chatLog = chatMessages.map(m => `${m.name}: ${m.content}`).join("\n");
            const activeContent = theaterChapters[currentChapterIdx]?.content || "";
            const sys = `你是一个记忆整理助手。请根据以下小剧场内容和观后的聊天探讨记录，生成一段100字左右的【事实陈述（第三人称视角）】。
            【当前章摘要】：${activeContent.substring(0, 300)}...
            【观后讨论】：\n${chatLog}
            要求：客观具体地写出“双方面对剧情，分别表达了什么具体的感想或探讨”。`;
            const summaryText = await fetchAI(sys, [{role: "user", content: "开始总结。"}]);
            
            dom.modalContent.innerHTML = `
              <h3 style="margin:0 0 15px 0;">探讨回忆收录</h3>
              <textarea id="sum-text" style="height: 140px; font-size:13px; line-height:1.5;">${summaryText}</textarea>
              <div class="roche-lt-modal-actions" style="margin-top: 15px;"><button id="sum-copy" class="roche-lt-btn-outline">复制</button><button id="sum-close" class="roche-lt-btn-outline">取消</button><button id="sum-save" class="roche-lt-btn" style="padding: 8px 20px;">写入主记忆</button></div>
            `;
            dom.modalWrapper.classList.add("show");
            document.getElementById('sum-close').onclick = () => dom.modalWrapper.classList.remove("show");
            document.getElementById('sum-copy').onclick = async () => { try { await navigator.clipboard.writeText(document.getElementById('sum-text').value); roche.ui.toast("已复制！"); } catch(e) {} };
            document.getElementById('sum-save').onclick = async () => {
              const finalSummary = document.getElementById('sum-text').value.trim(); if(!finalSummary) return roche.ui.toast("摘要不能为空。");
              try {
                await roche.memory.write({ conversationId: dom.convSelect.value, summaryText: finalSummary, who: ["我", "对方"], action: finalSummary, when: "刚才", where: "小剧场应用", source: "little-theater" });
                roche.ui.toast("已成功写入事实记忆！"); dom.modalWrapper.classList.remove("show");
              } catch(e) { roche.ui.toast("写入失败：" + e.message); }
            };
          } catch (e) { roche.ui.toast("生成失败：" + e.message); } finally { isGenerating = false; }
        };

        // --- 11. 收藏馆控制 ---
        async function autoSaveCollection() {
          if(!currentCollectionId) return; 
          const col = savedCollections.find(c => c.id === currentCollectionId);
          if(col) {
            col.chapters = JSON.parse(JSON.stringify(theaterChapters));
            col.chapterSummary = chapterSummary;
            col.chatHistory = [...chatMessages];
            await roche.storage.set("collections", savedCollections);
          }
        }

        container.querySelector("#lt-save-theater-btn").onclick = async () => {
          if(currentCollectionId) return roche.ui.toast("已在收藏中，内容会自动更新");
          currentCollectionId = crypto.randomUUID();
          savedCollections.unshift({
            id: currentCollectionId, title: activePrompt?.title || "未命名剧场", charId: dom.charSelect.value,
            chapters: JSON.parse(JSON.stringify(theaterChapters)), chapterSummary: chapterSummary, chatHistory: [...chatMessages], date: new Date().toLocaleString()
          });
          await roche.storage.set("collections", savedCollections); roche.ui.toast("已保存至收藏馆");
        };

        function renderCollection() {
          dom.colArea.innerHTML = savedCollections.length === 0 ? `<div style="text-align:center; color:var(--lt-text-sub); margin-top:20px;">收藏馆空空如也~</div>` : '';
          dom.colArea.innerHTML += savedCollections.map(c => {
            const displayContent = (c.chapters && c.chapters.length > 0) ? c.chapters[0].content : (c.content || "");
            return `<div class="roche-lt-col-item" data-id="${c.id}"><div class="roche-lt-col-title">${c.title}</div><div class="roche-lt-col-desc">${displayContent.substring(0, 50)}...</div><div class="roche-lt-col-meta">${c.date}</div></div>`;
          }).join('');

          dom.colArea.querySelectorAll('.roche-lt-col-item').forEach(el => {
            el.onclick = () => {
              const col = savedCollections.find(c => c.id === el.dataset.id);
              currentCollectionId = col.id;
              
              if (col.chapters && col.chapters.length > 0) { theaterChapters = JSON.parse(JSON.stringify(col.chapters)); } 
              else { theaterChapters = [{ title: "第1章", content: col.content || "", isSummarized: false }]; }
              chapterSummary = col.chapterSummary || "";
              currentChapterIdx = 0; chatMessages = [...col.chatHistory]; pendingUserMsgs = []; pendingQuote = null;
              
              quitSelectMode(); renderPendingQuoteUI();
              dom.vignetteTitle.textContent = col.title; dom.charSelect.value = col.charId; 
              updateTOCUI(); renderChatHistory(); dom.theaterArea.classList.add("active");
            };
          });
        }

        let isFullscreen = false;
        container.querySelector("#lt-fullscreen-btn").onclick = (e) => {
          isFullscreen = !isFullscreen; dom.theaterArea.classList.toggle("fullscreen", isFullscreen); e.target.textContent = isFullscreen ? "退出全屏" : "全屏";
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
// ==================== 第二部分代码结束 ====================

