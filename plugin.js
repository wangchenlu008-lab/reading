window.RochePlugin.register({
  id: "roche-plugin-little-theater",
  name: "小剧场 Pro",
  version: "1.1.0",
  apps: [
    {
      id: "little-theater-app",
      name: "小剧场",
      icon: "theater_comedy",
      async mount(container, roche) {
        // --- 1. 样式定义 (移动端优先 + 莫兰迪 Ins 风) ---
        const styleId = "style-roche-little-theater";
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            /* 全局与基础容器 */
            .roche-lt-container { display: flex; flex-direction: column; height: 100%; background-color: #f5f7fa; color: #5c6b73; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position: relative; overflow: hidden; box-sizing: border-box; }
            .roche-lt-container * { box-sizing: border-box; }
            
            /* 顶部配置区域 */
            .roche-lt-config-area { padding: 20px 20px 80px 20px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; height: 100%; }
            
            /* 莫兰迪风格下拉框 */
            .roche-lt-select-group { display: flex; gap: 12px; width: 100%; }
            .roche-lt-select-wrapper { flex: 1; position: relative; }
            .roche-lt-select-wrapper select { width: 100%; appearance: none; -webkit-appearance: none; background-color: #eef2f6; border: 1px solid transparent; border-radius: 20px; padding: 12px 35px 12px 18px; font-size: 14px; color: #5c6b73; outline: none; transition: 0.3s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01); }
            .roche-lt-select-wrapper select:focus { border-color: #b1c2d4; background-color: #fff; }
            .roche-lt-select-wrapper::after { content: "▼"; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 10px; color: #a1b0bd; pointer-events: none; }
            
            /* 提示词库区域 */
            .roche-lt-prompt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: -10px; }
            .roche-lt-prompt-header-title { font-size: 13px; font-weight: 500; color: #92a4b6; letter-spacing: 1px; }
            
            /* 提示词卡片横向滑动 (Ins风) */
            .roche-lt-prompt-scroll { display: flex; overflow-x: auto; gap: 12px; padding: 4px 0 16px 0; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
            .roche-lt-prompt-scroll::-webkit-scrollbar { display: none; }
            
            .roche-lt-prompt-item { flex: 0 0 calc(45% - 6px); min-width: 140px; background: #fff; border-radius: 16px; padding: 16px; scroll-snap-align: start; box-shadow: 0 4px 15px rgba(177, 194, 212, 0.15); border: 2px solid transparent; transition: 0.3s; display: flex; flex-direction: column; justify-content: space-between; position: relative; user-select: none; -webkit-user-select: none; }
            .roche-lt-prompt-item:active { transform: scale(0.97); }
            .roche-lt-prompt-item.active { border-color: #b1c2d4; background: #f8fbff; }
            .roche-lt-prompt-title { font-size: 15px; font-weight: 600; color: #4a5560; margin-bottom: 8px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .roche-lt-prompt-cat { font-size: 11px; color: #8a9ea8; background: #eef2f6; padding: 3px 8px; border-radius: 10px; align-self: flex-start; }
            
            /* 通用按钮 */
            .roche-lt-btn { padding: 12px 24px; background: #b1c2d4; color: #fff; border: none; border-radius: 25px; font-size: 15px; font-weight: 500; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(177, 194, 212, 0.4); text-align: center; }
            .roche-lt-btn:hover { background: #9db2c7; }
            .roche-lt-btn:disabled { background: #d3dce4; box-shadow: none; cursor: not-allowed; color: #f0f4f7; }
            .roche-lt-btn-outline { background: transparent; border: 1px solid #b1c2d4; color: #8a9ea8; box-shadow: none; padding: 6px 14px; font-size: 13px; border-radius: 15px; }
            
            /* 生成按钮 (醒目) */
            .roche-lt-generate-btn { width: 100%; padding: 16px; font-size: 16px; letter-spacing: 2px; border-radius: 16px; margin-top: 10px; }
            
            /* 阅读与共读沉浸区 */
            .roche-lt-theater-area { display: flex; flex-direction: column; height: 100%; background: #fdfdfe; border-radius: 24px 24px 0 0; padding: 20px; box-shadow: 0 -4px 20px rgba(0,0,0,0.03); overflow: hidden; position: absolute; top: 0; left: 0; width: 100%; z-index: 10; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); transform: translateY(100%); }
            .roche-lt-theater-area.active { transform: translateY(0); }
            
            /* 全屏模式下的样式覆盖 */
            .roche-lt-theater-area.fullscreen { border-radius: 0; padding-bottom: 20px; z-index: 9999; }
            
            .roche-lt-theater-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f4f7; flex-shrink: 0; }
            .roche-lt-theater-title { font-size: 16px; font-weight: 600; color: #4a5560; }
            .roche-lt-theater-tools { display: flex; gap: 8px; }
            
            .roche-lt-theater-scroll { flex: 1; overflow-y: auto; padding-right: 5px; display: flex; flex-direction: column; gap: 20px; }
            
            /* 剧场正文 */
            .roche-lt-vignette-content { font-size: 15px; line-height: 1.8; color: #5c6b73; white-space: pre-wrap; letter-spacing: 0.5px; padding-bottom: 10px; }
            
            /* 聊天探讨区 */
            .roche-lt-chat-box { background: #f5f7fa; border-radius: 16px; padding: 15px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px; margin-bottom: 10px; }
            .roche-lt-chat-history { display: flex; flex-direction: column; gap: 12px; max-height: 250px; overflow-y: auto; }
            
            .roche-lt-msg { display: flex; flex-direction: column; max-width: 85%; }
            .roche-lt-msg.user { align-self: flex-end; align-items: flex-end; }
            .roche-lt-msg.char { align-self: flex-start; align-items: flex-start; }
            .roche-lt-msg-name { font-size: 11px; color: #a1b0bd; margin-bottom: 4px; padding: 0 4px; }
            .roche-lt-msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; color: #4a5560; }
            .roche-lt-msg.user .roche-lt-msg-bubble { background: #d0dce8; border-bottom-right-radius: 4px; }
            .roche-lt-msg.char .roche-lt-msg-bubble { background: #fff; border: 1px solid #eef2f6; border-bottom-left-radius: 4px; }
            
            .roche-lt-input-group { display: flex; gap: 10px; }
            .roche-lt-input-group input { flex: 1; padding: 12px 16px; border: 1px solid transparent; border-radius: 20px; outline: none; background: #fff; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: 0.2s; }
            .roche-lt-input-group input:focus { border-color: #b1c2d4; }
            
            /* 左下角悬浮返回键 */
            .roche-lt-fab-back { position: fixed; bottom: 20px; left: 20px; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid #eef2f6; color: #8a9ea8; border-radius: 50%; width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); cursor: pointer; z-index: 1000; font-size: 20px; }
            
            /* 模态框 (新增/编辑) */
            .roche-lt-modal-bg { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.4); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); display: flex; justify-content: center; align-items: center; z-index: 2000; opacity: 0; pointer-events: none; transition: 0.3s; padding: 20px; }
            .roche-lt-modal-bg.show { opacity: 1; pointer-events: auto; }
            .roche-lt-modal { background: #fff; padding: 24px; border-radius: 20px; width: 100%; max-width: 360px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); transform: translateY(20px); transition: 0.3s; }
            .roche-lt-modal-bg.show .roche-lt-modal { transform: translateY(0); }
            
            .roche-lt-modal input, .roche-lt-modal textarea { width: 100%; margin-bottom: 16px; padding: 12px; border: 1px solid #eef2f6; border-radius: 12px; background: #fcfcfd; font-size: 14px; outline: none; transition: 0.2s; }
            .roche-lt-modal input:focus, .roche-lt-modal textarea:focus { border-color: #b1c2d4; background: #fff; }
            .roche-lt-modal textarea { height: 100px; resize: none; font-family: inherit; }
            .roche-lt-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
            .roche-lt-delete-text { color: #d98888; font-size: 13px; align-self: center; cursor: pointer; margin-right: auto; }
            
            .roche-lt-hidden { display: none !important; }
          `;
          document.head.appendChild(style);
        }

        // --- 2. 状态管理 ---
        let prompts = (await roche.storage.get("prompts")) || [
          { id: "1", title: "雨天避雨", category: "日常", content: "一场突如其来的大雨，两人在屋檐下避雨的温馨时刻。" },
          { id: "2", title: "平行世界相遇", category: "科幻", content: "在赛博朋克设定的平行世界里，两人作为宿敌的初次交锋。" }
        ];
        let characters = await roche.character.list();
        let conversations = await roche.conversation.list({ isGroup: false });
        let activePrompt = null;
        let vignetteText = "";
        let chatMessages = [];
        let isGenerating = false;
        let editModeId = null; // 用于判断模态框是新增还是编辑

        // --- 3. 初始结构渲染 ---
        container.innerHTML = `
          <div class="roche-lt-container roche-plugin-little-theater">
            
            <!-- 返回按钮 (左下角) -->
            <div id="lt-back-btn" class="roche-lt-fab-back">←</div>

            <!-- 1. 配置主页 -->
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
              </div>

              <div class="roche-lt-prompt-header">
                <span class="roche-lt-prompt-header-title">灵感图鉴 (长按编辑)</span>
                <button id="lt-add-prompt-btn" class="roche-lt-btn-outline">+ 创作</button>
              </div>
              
              <div class="roche-lt-prompt-scroll" id="lt-prompt-scroll"></div>
              
              <button id="lt-generate-btn" class="roche-lt-btn roche-lt-generate-btn" disabled>执笔生成</button>
            </div>
            
            <!-- 2. 阅读与探讨界面 (覆盖层) -->
            <div id="lt-theater-area" class="roche-lt-theater-area">
              <div class="roche-lt-theater-header">
                <span id="lt-vignette-title" class="roche-lt-theater-title">剧场内容</span>
                <div class="roche-lt-theater-tools">
                  <button id="lt-close-theater-btn" class="roche-lt-btn-outline" style="border:none; background:#f0f4f7;">退出阅读</button>
                  <button id="lt-fullscreen-btn" class="roche-lt-btn-outline">全屏</button>
                </div>
              </div>
              
              <div class="roche-lt-theater-scroll">
                <div id="lt-vignette-content" class="roche-lt-vignette-content"></div>
                
                <div style="display:flex; gap:10px; margin-bottom: 10px;">
                  <button id="lt-continue-ai-btn" class="roche-lt-btn-outline" style="flex:1;">AI 延展</button>
                  <button id="lt-continue-co-btn" class="roche-lt-btn-outline" style="flex:1;">定向续写</button>
                </div>
                
                <!-- 聊天探讨框 -->
                <div class="roche-lt-chat-box">
                  <div id="lt-chat-history" class="roche-lt-chat-history"></div>
                  <div class="roche-lt-input-group">
                    <input type="text" id="lt-chat-input" placeholder="输入你想探讨的话...">
                    <button id="lt-chat-send-btn" class="roche-lt-btn" style="padding: 10px 18px; border-radius: 18px;">发送</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 3. 新增/编辑模态框 -->
          <div id="lt-modal-wrapper" class="roche-lt-modal-bg">
            <div class="roche-lt-modal">
              <h3 id="lt-modal-header" style="margin: 0 0 15px 0; color: #4a5560; font-size: 16px;">创作灵感</h3>
              <input type="text" id="lt-modal-title-in" placeholder="小剧场标题 (如: 雨天避雨)">
              <input type="text" id="lt-modal-cat-in" placeholder="分类标签 (如: 日常)">
              <textarea id="lt-modal-content-in" placeholder="输入大致剧情设定..."></textarea>
              <div class="roche-lt-modal-actions">
                <span id="lt-modal-delete" class="roche-lt-delete-text roche-lt-hidden">删除</span>
                <button id="lt-modal-cancel" class="roche-lt-btn-outline">取消</button>
                <button id="lt-modal-save" class="roche-lt-btn" style="padding: 8px 20px;">保存</button>
              </div>
            </div>
          </div>
        `;

        // --- 4. DOM 获取 ---
        const dom = {
          backBtn: container.querySelector("#lt-back-btn"),
          promptScroll: container.querySelector("#lt-prompt-scroll"),
          addPromptBtn: container.querySelector("#lt-add-prompt-btn"),
          charSelect: container.querySelector("#lt-char-select"),
          convSelect: container.querySelector("#lt-conv-select"),
          generateBtn: container.querySelector("#lt-generate-btn"),
          
          theaterArea: container.querySelector("#lt-theater-area"),
          closeTheaterBtn: container.querySelector("#lt-close-theater-btn"),
          fullscreenBtn: container.querySelector("#lt-fullscreen-btn"),
          vignetteContent: container.querySelector("#lt-vignette-content"),
          vignetteTitle: container.querySelector("#lt-vignette-title"),
          
          chatHistory: container.querySelector("#lt-chat-history"),
          chatInput: container.querySelector("#lt-chat-input"),
          chatSendBtn: container.querySelector("#lt-chat-send-btn"),
          continueAiBtn: container.querySelector("#lt-continue-ai-btn"),
          continueCoBtn: container.querySelector("#lt-continue-co-btn"),
          
          modalWrapper: container.querySelector("#lt-modal-wrapper"),
          modalHeader: container.querySelector("#lt-modal-header"),
          modalTitle: container.querySelector("#lt-modal-title-in"),
          modalCat: container.querySelector("#lt-modal-cat-in"),
          modalContent: container.querySelector("#lt-modal-content-in"),
          modalCancel: container.querySelector("#lt-modal-cancel"),
          modalSave: container.querySelector("#lt-modal-save"),
          modalDelete: container.querySelector("#lt-modal-delete")
        };

        // --- 5. UI 渲染与手势交互 ---
        function updatePromptUI() {
          dom.promptScroll.innerHTML = prompts.map(p => `
            <div class="roche-lt-prompt-item ${activePrompt?.id === p.id ? 'active' : ''}" data-id="${p.id}">
              <div class="roche-lt-prompt-title">${p.title}</div>
              <div class="roche-lt-prompt-cat">${p.category || '未分类'}</div>
            </div>
          `).join('');

          // 绑定长按(编辑)和短按(选中)事件
          dom.promptScroll.querySelectorAll('.roche-lt-prompt-item').forEach(el => {
            const pId = el.dataset.id;
            let pressTimer;
            let startX, startY;
            let isDragging = false;

            // 移动端 Touch
            el.addEventListener('touchstart', (e) => {
              isDragging = false;
              startX = e.touches[0].clientX;
              startY = e.touches[0].clientY;
              pressTimer = setTimeout(() => openModal(pId), 600); // 600ms 长按
            }, { passive: true });
            
            el.addEventListener('touchmove', (e) => {
              const dx = Math.abs(e.touches[0].clientX - startX);
              const dy = Math.abs(e.touches[0].clientY - startY);
              if (dx > 10 || dy > 10) {
                isDragging = true;
                clearTimeout(pressTimer);
              }
            }, { passive: true });
            
            el.addEventListener('touchend', () => {
              clearTimeout(pressTimer);
              if (!isDragging) selectPrompt(pId);
            });
            el.addEventListener('touchcancel', () => clearTimeout(pressTimer));

            // 电脑端 Mouse
            el.addEventListener('mousedown', (e) => {
              isDragging = false;
              startX = e.clientX;
              pressTimer = setTimeout(() => openModal(pId), 600);
            });
            el.addEventListener('mousemove', (e) => {
              if (Math.abs(e.clientX - startX) > 5) {
                isDragging = true;
                clearTimeout(pressTimer);
              }
            });
            el.addEventListener('mouseup', () => {
              clearTimeout(pressTimer);
              if (!isDragging) selectPrompt(pId);
            });
            el.addEventListener('mouseleave', () => clearTimeout(pressTimer));
          });
        }

        function selectPrompt(id) {
          activePrompt = prompts.find(p => p.id === id);
          updatePromptUI();
          checkGenerateReady();
        }

        function checkGenerateReady() {
          dom.generateBtn.disabled = !(activePrompt && dom.charSelect.value) || isGenerating;
          dom.generateBtn.textContent = isGenerating ? "正在执笔..." : "执笔生成";
        }

        function renderChatHistory() {
          dom.chatHistory.innerHTML = chatMessages.map(msg => `
            <div class="roche-lt-msg ${msg.role === 'user' ? 'user' : 'char'}">
              <div class="roche-lt-msg-name">${msg.name}</div>
              <div class="roche-lt-msg-bubble">${msg.content}</div>
            </div>
          `).join('');
          dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight;
        }

        // --- 6. 模态框逻辑 (新增/修改/删除) ---
        function openModal(editId = null) {
          editModeId = editId;
          if (editId) {
            const p = prompts.find(pr => pr.id === editId);
            dom.modalHeader.textContent = "修改灵感";
            dom.modalTitle.value = p.title;
            dom.modalCat.value = p.category;
            dom.modalContent.value = p.content;
            dom.modalDelete.classList.remove("roche-lt-hidden");
          } else {
            dom.modalHeader.textContent = "创作灵感";
            dom.modalTitle.value = "";
            dom.modalCat.value = "";
            dom.modalContent.value = "";
            dom.modalDelete.classList.add("roche-lt-hidden");
          }
          dom.modalWrapper.classList.add("show");
        }
        
        function closeModal() {
          dom.modalWrapper.classList.remove("show");
        }

        dom.modalSave.onclick = async () => {
          const t = dom.modalTitle.value.trim();
          if (!t) return roche.ui.toast("请输入标题");
          
          if (editModeId) {
            const p = prompts.find(pr => pr.id === editModeId);
            p.title = t;
            p.category = dom.modalCat.value.trim();
            p.content = dom.modalContent.value.trim();
          } else {
            prompts.unshift({
              id: crypto.randomUUID(),
              title: t,
              category: dom.modalCat.value.trim() || "未分类",
              content: dom.modalContent.value.trim(),
              createdAt: Date.now()
            });
          }
          await roche.storage.set("prompts", prompts);
          closeModal();
          updatePromptUI();
          roche.ui.toast("保存成功");
        };

        dom.modalDelete.onclick = async () => {
          prompts = prompts.filter(p => p.id !== editModeId);
          if (activePrompt?.id === editModeId) activePrompt = null;
          await roche.storage.set("prompts", prompts);
          closeModal();
          updatePromptUI();
          checkGenerateReady();
          roche.ui.toast("已删除");
        };

        // --- 7. AI 交互逻辑 ---
        async function fetchContext(charId, convId) {
          const userP = await roche.persona.getActiveUserPersona();
          const char = await roche.character.get(charId);
          let memoryText = "";
          
          if (convId) {
            const mem = await roche.memory.getLongTerm({ conversationId: convId, limit: 50 });
            const coreText = mem.core?.summary || "";
            const facts = (mem.facts || []).map(f => f.summaryText).filter(Boolean).join("；");
            if (coreText || facts) memoryText = `【已有记忆】\n核心记忆：${coreText}\n经历事实：${facts}\n`;
          }
          
          return { user: userP, char, memoryText };
        }

        async function handleGenerate() {
          if (!activePrompt || !dom.charSelect.value) return;
          isGenerating = true;
          checkGenerateReady();
          
          try {
            const ctx = await fetchContext(dom.charSelect.value, dom.convSelect.value);
            const sysPrompt = `你是一个优秀的同人/小剧场小说家。请根据以下设定，写一段沉浸感强的短文。
            【角色设定】
            用户(${ctx.user.name})：${ctx.user.persona || ctx.user.bio || ""}
            搭档(${ctx.char.name})：${ctx.char.persona || ctx.char.bio || ""}
            ${ctx.memoryText}
            【剧场提示词要求】
            标题：${activePrompt.title}
            剧情设定：${activePrompt.content}
            要求：文笔细腻，符合双方人设，描写生动，不包含与设定无关的废话。`;

            const res = await roche.ai.chat({
              messages: [{ role: "system", content: sysPrompt }, { role: "user", content: "请开始编写。" }],
              temperature: 0.7
            });

            vignetteText = res.text;
            chatMessages = []; // 清空聊天
            dom.vignetteTitle.textContent = activePrompt.title;
            dom.vignetteContent.textContent = vignetteText;
            renderChatHistory();
            
            // 呼出剧场界面
            dom.theaterArea.classList.add("active");

          } catch (e) {
            roche.ui.toast("生成失败: " + e.message);
          } finally {
            isGenerating = false;
            checkGenerateReady();
          }
        }

        async function handleChat() {
          const text = dom.chatInput.value.trim();
          if (!text || isGenerating) return;
          
          const ctx = await fetchContext(dom.charSelect.value, null);
          const userName = ctx.user.name || "我";
          const charName = ctx.char.handle || ctx.char.name || "角色";
          
          chatMessages.push({ role: "user", name: userName, content: text });
          dom.chatInput.value = "";
          renderChatHistory();
          isGenerating = true;
          
          try {
            const sysPrompt = `你是${charName}，正在和${userName}一起看关于你们的小说片段。
            【正在阅读的内容】
            ${vignetteText}
            【任务】
            保持你(${charName})的原本口吻，针对这篇内容，自然地回应用户的读后感。不要脱离你的人设。`;

            const apiMsgs = [
              { role: "system", content: sysPrompt },
              ...chatMessages.map(m => ({
                role: m.role,
                content: (m.role === 'user' ? `${userName}: ` : "") + m.content
              }))
            ];

            const res = await roche.ai.chat({ messages: apiMsgs, temperature: 0.8 });
            chatMessages.push({ role: "char", name: charName, content: res.text });
            renderChatHistory();
          } catch (e) {
            roche.ui.toast("回复失败");
            chatMessages.pop();
            renderChatHistory();
          } finally {
            isGenerating = false;
          }
        }

        async function handleContinue(type) {
          if (isGenerating) return;
          const ctx = await fetchContext(dom.charSelect.value, dom.convSelect.value);
          let userInstruction = "";
          
          if (type === "co") {
            const input = prompt("请输入你想续写的发展方向或角色的下一个动作：");
            if (!input) return;
            userInstruction = `【用户的续写期望】：${input}。请顺畅接续下文。`;
          } else {
            userInstruction = "请顺着当前的剧情和氛围，自然地续写下一小段内容。";
          }
          
          isGenerating = true;
          roche.ui.toast("正在续写中...");

          try {
            const sysPrompt = `你是一个小剧场小说家。请紧接已有的前文进行续写，保持文风和人设一致。
            【已有的前文】
            ${vignetteText}
            ${userInstruction}`;

            const res = await roche.ai.chat({
              messages: [{ role: "system", content: sysPrompt }],
              temperature: 0.75
            });

            vignetteText += "\n\n" + res.text;
            dom.vignetteContent.textContent = vignetteText;
            chatMessages.push({ role: "char", name: "系统", content: "剧场内容已更新，剧情又推进了一步。" });
            renderChatHistory();
          } catch (e) {
            roche.ui.toast("续写失败");
          } finally {
            isGenerating = false;
          }
        }

        // --- 8. 全屏与退出逻辑 ---
        let isFullscreen = false;
        dom.fullscreenBtn.onclick = () => {
          isFullscreen = !isFullscreen;
          if (isFullscreen) {
            dom.theaterArea.classList.add("fullscreen");
            dom.fullscreenBtn.textContent = "退出全屏";
          } else {
            dom.theaterArea.classList.remove("fullscreen");
            dom.fullscreenBtn.textContent = "全屏";
          }
        };
        
        dom.closeTheaterBtn.onclick = () => {
          dom.theaterArea.classList.remove("active");
          if(isFullscreen) dom.fullscreenBtn.click(); // 恢复非全屏
        };

        // --- 9. 全局事件绑定 ---
        dom.backBtn.onclick = () => roche.ui.closeApp();
        dom.addPromptBtn.onclick = () => openModal(null);
        dom.modalCancel.onclick = closeModal;
        dom.charSelect.onchange = checkGenerateReady;
        
        dom.generateBtn.onclick = handleGenerate;
        dom.chatSendBtn.onclick = handleChat;
        dom.chatInput.onkeypress = (e) => { if (e.key === "Enter") handleChat(); };
        
        dom.continueAiBtn.onclick = () => handleContinue("ai");
        dom.continueCoBtn.onclick = () => handleContinue("co");

        // 初始化渲染
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
