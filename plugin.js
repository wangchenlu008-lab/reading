window.RochePlugin.register({
  id: "roche-plugin-little-theater",
  name: "小剧场 Pro",
  version: "1.0.0",
  apps: [
    {
      id: "little-theater-app",
      name: "小剧场",
      icon: "theater_comedy",
      async mount(container, roche) {
        // --- 1. 样式定义 (莫兰迪色系) ---
        const styleId = "style-roche-little-theater";
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            .roche-lt-container { display: flex; height: 100%; background-color: #f7f7f8; color: #4a4a4a; font-family: 'Helvetica Neue', Arial, sans-serif; }
            .roche-lt-sidebar { width: 280px; background-color: #efeff1; border-right: 1px solid #dcdcdc; display: flex; flex-direction: column; }
            .roche-lt-sidebar-header { padding: 20px; border-bottom: 1px solid #dcdcdc; }
            .roche-lt-sidebar-header input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: #fdfdfd; outline: none; margin-bottom: 10px; box-sizing: border-box;}
            .roche-lt-sidebar-header select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: #fdfdfd; outline: none; }
            .roche-lt-prompt-list { flex: 1; overflow-y: auto; padding: 10px; }
            .roche-lt-prompt-item { padding: 12px; margin-bottom: 8px; background: #fff; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
            .roche-lt-prompt-item:hover { border-color: #b5c4d3; }
            .roche-lt-prompt-item.active { background: #e3ebf0; border-color: #a8b8c8; }
            .roche-lt-prompt-title { font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #333; }
            .roche-lt-prompt-cat { font-size: 11px; color: #777; background: #e9e9eb; padding: 2px 6px; border-radius: 10px; display: inline-block; }
            .roche-lt-sidebar-footer { padding: 15px; border-top: 1px solid #dcdcdc; }
            
            .roche-lt-main { flex: 1; display: flex; flex-direction: column; background: #fdfdfd; }
            .roche-lt-header { padding: 15px 25px; background: #fff; border-bottom: 1px solid #e8e8e8; display: flex; gap: 15px; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.01); }
            .roche-lt-header select { padding: 6px 10px; border: 1px solid #dcdcdc; border-radius: 4px; background: #fafafa; outline: none; min-width: 120px; }
            .roche-lt-content { flex: 1; overflow-y: auto; padding: 30px; display: flex; flex-direction: column; gap: 20px; }
            
            .roche-lt-panel { background: #fff; border: 1px solid #eaeaea; border-radius: 8px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
            .roche-lt-panel-title { font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #333; display: flex; justify-content: space-between;}
            .roche-lt-text-content { font-size: 15px; line-height: 1.8; color: #444; white-space: pre-wrap; }
            
            .roche-lt-chat-history { max-height: 300px; overflow-y: auto; margin-bottom: 15px; padding-right: 10px; }
            .roche-lt-msg { margin-bottom: 15px; display: flex; flex-direction: column; }
            .roche-lt-msg.user { align-items: flex-end; }
            .roche-lt-msg.char { align-items: flex-start; }
            .roche-lt-msg-name { font-size: 12px; color: #888; margin-bottom: 4px; }
            .roche-lt-msg-bubble { max-width: 80%; padding: 10px 15px; border-radius: 8px; font-size: 14px; line-height: 1.5; }
            .roche-lt-msg.user .roche-lt-msg-bubble { background: #b5c4d3; color: #fff; border-bottom-right-radius: 0; }
            .roche-lt-msg.char .roche-lt-msg-bubble { background: #f2f2f2; color: #333; border-bottom-left-radius: 0; }
            
            .roche-lt-input-group { display: flex; gap: 10px; }
            .roche-lt-input-group input { flex: 1; padding: 10px 15px; border: 1px solid #dcdcdc; border-radius: 20px; outline: none; background: #fafafa; }
            
            .roche-lt-btn { padding: 8px 16px; background: #a8b8c8; color: #fff; border: none; border-radius: 20px; cursor: pointer; transition: 0.2s; font-size: 14px; }
            .roche-lt-btn:hover { background: #92a4b6; }
            .roche-lt-btn.outline { background: transparent; border: 1px solid #a8b8c8; color: #a8b8c8; }
            .roche-lt-btn.outline:hover { background: #f4f6f8; }
            .roche-lt-btn:disabled { background: #dcdcdc; cursor: not-allowed; border-color: #dcdcdc; color: #999; }
            
            /* 模态框 */
            .roche-lt-modal-bg { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; z-index: 100; }
            .roche-lt-modal { background: #fff; padding: 25px; border-radius: 8px; width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .roche-lt-modal input, .roche-lt-modal textarea, .roche-lt-modal select { width: 100%; margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; outline: none; }
            .roche-lt-modal textarea { height: 120px; resize: vertical; }
            .roche-lt-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
            
            .roche-lt-loading { color: #888; font-size: 13px; font-style: italic; }
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

        // --- 3. 初始结构渲染 ---
        container.innerHTML = `
          <div class="roche-lt-container roche-plugin-little-theater">
            <div class="roche-lt-sidebar">
              <div class="roche-lt-sidebar-header">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                  <span style="font-weight:bold; color:#5c6b73;">提示词库</span>
                  <button id="lt-add-prompt-btn" class="roche-lt-btn" style="padding: 4px 10px; font-size: 12px;">+ 新增</button>
                </div>
                <input type="text" id="lt-search-input" placeholder="搜索提示词...">
                <select id="lt-cat-select">
                  <option value="">全部分类</option>
                </select>
              </div>
              <div class="roche-lt-prompt-list" id="lt-prompt-list"></div>
            </div>
            
            <div class="roche-lt-main">
              <div class="roche-lt-header">
                <button id="lt-back-btn" class="roche-lt-btn outline">返回</button>
                <select id="lt-char-select">
                  <option value="">1. 选择角色</option>
                  ${characters.map(c => `<option value="${c.id}">${c.name || c.handle}</option>`).join('')}
                </select>
                <select id="lt-conv-select">
                  <option value="">2. 选择关联记忆(可选)</option>
                  ${conversations.map(c => `<option value="${c.id}">${c.name || c.title}</option>`).join('')}
                </select>
                <button id="lt-generate-btn" class="roche-lt-btn" disabled>生成小剧场</button>
                <span id="lt-header-status" class="roche-lt-loading roche-lt-hidden">正在执笔...</span>
              </div>
              
              <div class="roche-lt-content">
                <div id="lt-vignette-panel" class="roche-lt-panel roche-lt-hidden">
                  <div class="roche-lt-panel-title">
                    <span id="lt-vignette-title">剧场内容</span>
                    <div style="display:flex; gap:8px;">
                      <button id="lt-continue-ai-btn" class="roche-lt-btn outline" style="font-size: 12px; padding: 4px 10px;">AI 顺势续写</button>
                      <button id="lt-continue-co-btn" class="roche-lt-btn outline" style="font-size: 12px; padding: 4px 10px;">一起续写</button>
                    </div>
                  </div>
                  <div id="lt-vignette-content" class="roche-lt-text-content"></div>
                </div>
                
                <div id="lt-chat-panel" class="roche-lt-panel roche-lt-hidden">
                  <div class="roche-lt-panel-title">共读探讨</div>
                  <div id="lt-chat-history" class="roche-lt-chat-history"></div>
                  <div class="roche-lt-input-group">
                    <input type="text" id="lt-chat-input" placeholder="和角色聊聊这个剧情...">
                    <button id="lt-chat-send-btn" class="roche-lt-btn">发送</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 弹窗模板 -->
          <div id="lt-modal-wrapper" class="roche-lt-modal-bg roche-lt-hidden">
            <div class="roche-lt-modal">
              <h3 id="lt-modal-title" style="margin-top:0;">新增提示词</h3>
              <input type="text" id="lt-modal-title-in" placeholder="小剧场标题">
              <input type="text" id="lt-modal-cat-in" placeholder="分类 (如: 日常, 悬疑, 恋爱)">
              <textarea id="lt-modal-content-in" placeholder="在此输入小剧场的设定或大致剧情..."></textarea>
              <div class="roche-lt-modal-actions">
                <button id="lt-modal-cancel" class="roche-lt-btn outline">取消</button>
                <button id="lt-modal-save" class="roche-lt-btn">保存</button>
              </div>
            </div>
          </div>
        `;

        // --- 4. DOM 引用获取 ---
        const dom = {
          backBtn: container.querySelector("#lt-back-btn"),
          promptList: container.querySelector("#lt-prompt-list"),
          searchInput: container.querySelector("#lt-search-input"),
          catSelect: container.querySelector("#lt-cat-select"),
          addPromptBtn: container.querySelector("#lt-add-prompt-btn"),
          charSelect: container.querySelector("#lt-char-select"),
          convSelect: container.querySelector("#lt-conv-select"),
          generateBtn: container.querySelector("#lt-generate-btn"),
          statusTxt: container.querySelector("#lt-header-status"),
          vignettePanel: container.querySelector("#lt-vignette-panel"),
          vignetteContent: container.querySelector("#lt-vignette-content"),
          vignetteTitle: container.querySelector("#lt-vignette-title"),
          chatPanel: container.querySelector("#lt-chat-panel"),
          chatHistory: container.querySelector("#lt-chat-history"),
          chatInput: container.querySelector("#lt-chat-input"),
          chatSendBtn: container.querySelector("#lt-chat-send-btn"),
          continueAiBtn: container.querySelector("#lt-continue-ai-btn"),
          continueCoBtn: container.querySelector("#lt-continue-co-btn"),
          modalWrapper: container.querySelector("#lt-modal-wrapper"),
          modalTitle: container.querySelector("#lt-modal-title-in"),
          modalCat: container.querySelector("#lt-modal-cat-in"),
          modalContent: container.querySelector("#lt-modal-content-in"),
          modalCancel: container.querySelector("#lt-modal-cancel"),
          modalSave: container.querySelector("#lt-modal-save")
        };

        // --- 5. 核心渲染逻辑 ---
        function updatePromptUI() {
          // 更新分类下拉
          const cats = [...new Set(prompts.map(p => p.category).filter(Boolean))];
          const currCat = dom.catSelect.value;
          dom.catSelect.innerHTML = `<option value="">全部分类</option>` + cats.map(c => `<option value="${c}">${c}</option>`).join('');
          dom.catSelect.value = currCat;

          const kw = dom.searchInput.value.toLowerCase();
          const cat = dom.catSelect.value;
          
          let filtered = prompts.filter(p => 
            (p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw)) &&
            (cat === "" || p.category === cat)
          );

          dom.promptList.innerHTML = filtered.map(p => `
            <div class="roche-lt-prompt-item ${activePrompt?.id === p.id ? 'active' : ''}" data-id="${p.id}">
              <div class="roche-lt-prompt-title">${p.title}</div>
              <div class="roche-lt-prompt-cat">${p.category || '未分类'}</div>
            </div>
          `).join('');

          // 绑定点击事件
          dom.promptList.querySelectorAll('.roche-lt-prompt-item').forEach(el => {
            el.addEventListener('click', () => {
              activePrompt = prompts.find(pr => pr.id === el.dataset.id);
              updatePromptUI();
              checkGenerateReady();
            });
          });
        }

        function checkGenerateReady() {
          dom.generateBtn.disabled = !(activePrompt && dom.charSelect.value) || isGenerating;
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

        // --- 6. AI 交互逻辑 ---
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
          dom.statusTxt.classList.remove("roche-lt-hidden");
          dom.vignettePanel.classList.add("roche-lt-hidden");
          dom.chatPanel.classList.add("roche-lt-hidden");
          
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
            chatMessages = []; // 清空之前的探讨记录
            dom.vignetteTitle.textContent = `剧场内容: ${activePrompt.title}`;
            dom.vignetteContent.textContent = vignetteText;
            
            dom.vignettePanel.classList.remove("roche-lt-hidden");
            dom.chatPanel.classList.remove("roche-lt-hidden");
            renderChatHistory();

          } catch (e) {
            roche.ui.toast("生成失败: " + e.message);
          } finally {
            isGenerating = false;
            checkGenerateReady();
            dom.statusTxt.classList.add("roche-lt-hidden");
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
            const sysPrompt = `你是${charName}，目前正在和${userName}一起看一篇关于你们的小说片段（小剧场）。
            【你们的设定】
            用户(${userName})：${ctx.user.persona || ""}
            你(${charName})：${ctx.char.persona || ""}
            【正在阅读的小剧场内容】
            ${vignetteText}
            【任务】
            保持你(${charName})的原本口吻，针对这篇小剧场内容，和用户进行闲聊、探讨或吐槽。不要脱离你的人设，自然地回应用户的读后感。`;

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
            chatMessages.pop(); // 回滚
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
            userInstruction = `【用户的续写期望】：${input}。请根据这个期望，顺畅地接续下文。`;
          } else {
            userInstruction = "请顺着当前的剧情和氛围，自然地续写下一小段内容。";
          }
          
          isGenerating = true;
          dom.statusTxt.textContent = "正在续写...";
          dom.statusTxt.classList.remove("roche-lt-hidden");

          try {
            const sysPrompt = `你是一个小剧场小说家。以下是目前已经写好的内容，请紧接其后进行续写，保持文风和人设一致。
            【角色设定】
            用户(${ctx.user.name})：${ctx.user.persona || ""}
            搭档(${ctx.char.name})：${ctx.char.persona || ""}
            【已有的前文】
            ${vignetteText}
            ${userInstruction}`;

            const res = await roche.ai.chat({
              messages: [{ role: "system", content: sysPrompt }],
              temperature: 0.75
            });

            vignetteText += "\n\n" + res.text;
            dom.vignetteContent.textContent = vignetteText;
            roche.ui.toast("续写完成");
            
            // 发送系统提示到聊天中
            chatMessages.push({ role: "char", name: "系统", content: "剧场内容已更新，你们可以继续探讨新剧情了哦。" });
            renderChatHistory();
          } catch (e) {
            roche.ui.toast("续写失败: " + e.message);
          } finally {
            isGenerating = false;
            dom.statusTxt.classList.add("roche-lt-hidden");
          }
        }

        // --- 7. 事件绑定 ---
        dom.backBtn.onclick = () => roche.ui.closeApp();
        dom.searchInput.oninput = updatePromptUI;
        dom.catSelect.onchange = updatePromptUI;
        dom.charSelect.onchange = checkGenerateReady;
        
        dom.addPromptBtn.onclick = () => {
          dom.modalTitle.value = ""; dom.modalCat.value = ""; dom.modalContent.value = "";
          dom.modalWrapper.classList.remove("roche-lt-hidden");
        };
        dom.modalCancel.onclick = () => dom.modalWrapper.classList.add("roche-lt-hidden");
        dom.modalSave.onclick = async () => {
          const t = dom.modalTitle.value.trim();
          if (!t) return roche.ui.toast("请输入标题");
          const newPrompt = {
            id: crypto.randomUUID(),
            title: t,
            category: dom.modalCat.value.trim() || "未分类",
            content: dom.modalContent.value.trim(),
            createdAt: Date.now()
          };
          prompts.unshift(newPrompt);
          await roche.storage.set("prompts", prompts);
          dom.modalWrapper.classList.add("roche-lt-hidden");
          roche.ui.toast("保存成功");
          updatePromptUI();
        };

        dom.generateBtn.onclick = handleGenerate;
        dom.chatSendBtn.onclick = handleChat;
        dom.chatInput.onkeypress = (e) => { if (e.key === "Enter") handleChat(); };
        
        dom.continueAiBtn.onclick = () => handleContinue("ai");
        dom.continueCoBtn.onclick = () => handleContinue("co");

        // 初始化
        updatePromptUI();
      },
      
      async unmount(container, roche) {
        // 清理样式和内容
        const style = document.getElementById("style-roche-little-theater");
        if (style) style.remove();
        container.replaceChildren();
      }
    }
  ]
});
