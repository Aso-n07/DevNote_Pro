
    // Global auto-conversion from Korean Won (₩) to Backslash (\) for all inputs & textareas
    document.addEventListener("input", (e) => {
      const el = e.target;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.value && el.value.includes('₩')) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value = el.value.replace(/₩/g, '\\');
        if (start !== null && end !== null) {
          try { el.setSelectionRange(start, end); } catch (err) {}
        }
      }
    });

// HTML Escaping Utility
    function escapeHTML(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Custom Note Command Parser for Web Preview (#, ## without symbols)
    function parseNoteMarkdown(rawText) {
      if (!rawText) return "";
      let text = rawText;

      const greenBlocks = [];
      const purpleBlocks = [];

      // Extract +++ blocks
      text = text.replace(/^\s*\+\+\+\s*\n([\s\S]*?)\n\s*\+\+\+/gm, (match, content) => {
        const idx = greenBlocks.length;
        greenBlocks.push(content);
        return `\n___HIGHLIGHT_GREEN_${idx}___\n`;
      });

      // Extract === blocks
      text = text.replace(/^\s*===\s*\n([\s\S]*?)\n\s*===/gm, (match, content) => {
        const idx = purpleBlocks.length;
        purpleBlocks.push(content);
        return `\n___HIGHLIGHT_PURPLE_${idx}___\n`;
      });

      // Extract ### page dividers
      text = text.replace(/^\s*###\s*$/gm, '\n___PAGE_DIVIDER___\n');

      const lines = text.split('\n');
      let html = '';
      let inList = false;

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('___HIGHLIGHT_GREEN_') && trimmed.endsWith('___')) {
          if (inList) { html += '</ul>'; inList = false; }
          const idx = parseInt(trimmed.replace('___HIGHLIGHT_GREEN_', '').replace('___', ''));
          const innerText = greenBlocks[idx] || '';
          html += `<div class="highlight-green">${escapeHTML(innerText)}</div>`;
        } else if (trimmed.startsWith('___HIGHLIGHT_PURPLE_') && trimmed.endsWith('___')) {
          if (inList) { html += '</ul>'; inList = false; }
          const idx = parseInt(trimmed.replace('___HIGHLIGHT_PURPLE_', '').replace('___', ''));
          const innerText = purpleBlocks[idx] || '';
          html += `<div class="highlight-purple">${escapeHTML(innerText)}</div>`;
        } else if (trimmed === '___PAGE_DIVIDER___') {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<div class="page-divider"></div>';
        } else if (line.startsWith('# ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<h1 style="font-size:1.3rem; font-weight:700; color:var(--accent); margin:14px 0 8px 0;">${escapeHTML(line.substring(2))}</h1>`;
        } else if (line.startsWith('## ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<h2 style="font-size:1.1rem; font-weight:700; color:var(--primary); margin:12px 0 6px 0;">${escapeHTML(line.substring(3))}</h2>`;
        } else if (line.startsWith('- ')) {
          if (!inList) { html += '<ul style="padding-left:20px; margin:8px 0;">'; inList = true; }
          html += `<li>${escapeHTML(line.substring(2))}</li>`;
        } else if (line.trim() === '') {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<br/>';
        } else {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<p style="margin:4px 0;">${escapeHTML(line)}</p>`;
        }
      });
      if (inList) html += '</ul>';
      return html;
    }

    // Helper for rendering a single PDF page section without trailing empty line tags
    function parseSinglePagePDFMarkdown(pageText) {
      if (!pageText) return "";
      let text = pageText.trim();

      const greenBlocks = [];
      const purpleBlocks = [];

      // Extract +++ blocks
      text = text.replace(/^\s*\+\+\+\s*\n([\s\S]*?)\n\s*\+\+\+/gm, (match, content) => {
        const idx = greenBlocks.length;
        greenBlocks.push(content);
        return `\n___HIGHLIGHT_GREEN_${idx}___\n`;
      });

      // Extract === blocks
      text = text.replace(/^\s*===\s*\n([\s\S]*?)\n\s*===/gm, (match, content) => {
        const idx = purpleBlocks.length;
        purpleBlocks.push(content);
        return `\n___HIGHLIGHT_PURPLE_${idx}___\n`;
      });

      const lines = text.split('\n');
      let html = '';
      let inList = false;

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('___HIGHLIGHT_GREEN_') && trimmed.endsWith('___')) {
          if (inList) { html += '</ul>'; inList = false; }
          const idx = parseInt(trimmed.replace('___HIGHLIGHT_GREEN_', '').replace('___', ''));
          const innerText = greenBlocks[idx] || '';
          html += `<div style="background:#dcfce7; border-left:5px solid #16a34a; padding:12px 16px; border-radius:6px; margin:10px 0; font-weight:600; white-space:pre-wrap;">${escapeHTML(innerText)}</div>`;
        } else if (trimmed.startsWith('___HIGHLIGHT_PURPLE_') && trimmed.endsWith('___')) {
          if (inList) { html += '</ul>'; inList = false; }
          const idx = parseInt(trimmed.replace('___HIGHLIGHT_PURPLE_', '').replace('___', ''));
          const innerText = purpleBlocks[idx] || '';
          html += `<div style="background:#f3e8ff; border-left:5px solid #9333ea; padding:12px 16px; border-radius:6px; margin:10px 0; font-weight:600; white-space:pre-wrap;">${escapeHTML(innerText)}</div>`;
        } else if (line.startsWith('# ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<h1 style="font-size:1.6rem; font-weight:800; color:#000000; margin:0 0 10px 0; border-bottom:2px solid #000000; padding-bottom:6px;">${escapeHTML(line.substring(2))}</h1>`;
        } else if (line.startsWith('## ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<h2 style="font-size:1.25rem; font-weight:700; color:#000000; margin:0 0 8px 0;">${escapeHTML(line.substring(3))}</h2>`;
        } else if (line.startsWith('- ')) {
          if (!inList) { html += '<ul style="padding-left:22px; margin:8px 0; color:#000000;">'; inList = true; }
          html += `<li style="color:#000000; font-size:1rem; margin-bottom:4px;">${escapeHTML(line.substring(2))}</li>`;
        } else if (line.trim() === '') {
          if (inList) { html += '</ul>'; inList = false; }
        } else {
          if (inList) { html += '</ul>'; inList = false; }
          html += `<p style="margin:4px 0; color:#000000; font-size:1rem; line-height:1.6;">${escapeHTML(line)}</p>`;
        }
      });
      if (inList) html += '</ul>';
      return html;
    }

    // Custom Note Parser Specifically Optimized for PDF Export
    // Clean section wrapper without min-height hacks or double page breaks.
    function parseNoteMarkdownForPDF(rawText) {
      if (!rawText) return "";
      const validChunks = rawText.split(/^\s*###\s*$/gm).filter(c => c.trim().length > 0);
      
      let fullHtml = '';
      validChunks.forEach((chunk, index) => {
        const isLastPage = (index === validChunks.length - 1);
        const pageHtml = parseSinglePagePDFMarkdown(chunk);
        const pageBreakStyle = isLastPage ? "" : "page-break-after: always; break-after: page;";
        
        fullHtml += `
          <div class="pdf-page-chunk" style="${pageBreakStyle} margin: 0; padding: 0;">
            ${pageHtml}
          </div>
        `;
      });

      return fullHtml;
    }

    // Supabase Configuration
    const SUPABASE_URL = "https://bxbihhulzbpdxdijphil.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4YmloaHVsemJwZHhkaWpwaGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NzA5NTcsImV4cCI6MjEwMzU0Njk1N30.k1BsY6_XgXwnWjG6gpYmuPG5uNPSJFFRFr6TH1yfpYE";
    let supabaseClient = null;
    let currentUser = null;
    let currentUsername = "";
    let currentSessionId = "";
    let sessionCheckTimer = null;
    let isNotePreviewMode = false;

    if (window.supabase) {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (err) {
        console.error("Supabase Init Error:", err);
      }
    }

    // Default Initial Subjects & Cards Data
    const defaultSubjectList = [
      { id: "sub_html5", name: "01_HTML5", category: "01_웹_프론트엔드(Web_Frontend)", runnerType: "web" },
      { id: "sub_css3", name: "02_CSS3", category: "01_웹_프론트엔드(Web_Frontend)", runnerType: "web" },
      { id: "sub_js", name: "03_JavaScript", category: "01_웹_프론트엔드(Web_Frontend)", runnerType: "web" },
      { id: "sub_python", name: "01_Python_기초", category: "02_프로그래밍_언어(Languages)", runnerType: "python" },
      { id: "sub_c", name: "02_C언어_입문", category: "02_프로그래밍_언어(Languages)", runnerType: "web" },
      { id: "sub_java", name: "03_Java_기초", category: "02_프로그래밍_언어(Languages)", runnerType: "web" },
      { id: "sub_ml", name: "01_머신러닝_입문", category: "03_응용_및_AI_(Applied_Tech)", runnerType: "python" },
      { id: "sub_cs", name: "01_컴퓨터구조_네트워크", category: "04_컴퓨터공학_기초(CS_Fundamentals)", runnerType: "diagram" },
      { id: "sub_ds", name: "02_자료구조_알고리즘", category: "04_컴퓨터공학_기초(CS_Fundamentals)", runnerType: "web" }
    ];

    const defaultAppData = {
      sub_html5: {
        title: "HTML5 학습",
        defaultNote: "# HTML5 웹 시맨틱 태그 노트\n- `<header>`, `<nav>`, `<main>`, `<footer>`로 구조화합니다.\n\n+++\n이 줄 사이의 그린 색상 강조 블록\n- 중요 핵심 요약 내용\n+++\n\n###\n\n# 2페이지: 입력 폼 요소\n\n===\n이 줄 사이의 퍼플 색상 강조 블록\n- `<input type=\"email\">` 및 `<form>` 검증 활용\n===",
        defaultCode: "<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; background: #0f172a; color: #fff; padding: 20px; }\n    h1 { color: #38bdf8; }\n  </style>\n</head>\n<body>\n  <h1>Hello HTML5!</h1>\n  <p>DevNote Pro 웹 실습 공간입니다.</p>\n</body>\n</html>",
        cards: [
          { name: "<header>", desc: "페이지 또는 섹션의 헤더 영역 정의", code: "<header>\n  <h1>로고</h1>\n</header>" },
          { name: "<main>", desc: "문서의 주요 핵심 콘텐츠 영역", code: "<main>\n  <article>내용</article>\n</main>" }
        ]
      },
      sub_js: {
        title: "JavaScript 학습",
        defaultNote: "# JavaScript ES6+ 핵심 요약\n- `const`와 `let` 블록 스코프\n- 화살표 함수 및 구조 분해 할당\n\n+++\n비동기 핵심 개념:\n- `async/await` 및 `Promise` 문법\n+++\n\n###\n\n# 2페이지: DOM 조작",
        defaultCode: "const items = ['HTML', 'CSS', 'JavaScript'];\nitems.forEach((item, index) => {\n  console.log(`${index + 1}. ${item}`);\n});",
        cards: [
          { name: "Array.map()", desc: "배열의 각 요소를 변환하여 새 배열 반환", code: "const doubled = [1, 2, 3].map(n => n * 2);" },
          { name: "fetch()", desc: "비동기 네트워크 HTTP 요청 수행", code: "const res = await fetch(url);\nconst data = await res.json();" }
        ]
      },
      sub_python: {
        title: "Python 학습",
        defaultNote: "# Python 리스트 및 딕셔너리\n- 리스트 컴프리핸션 활용법\n\n===\n주요 모듈:\n- sys, os, io, math\n===\n\n###\n\n# 2페이지: 함수 정의",
        defaultCode: "fruits = ['사과', '바나나', '체리']\nfruits.append('포도')\nfor i, f in enumerate(fruits, 1):\n    print(f'{i}: {f}')",
        cards: [
          { name: "len(s)", desc: "시퀀스 객체의 길이 반환", code: "length = len(arr)" },
          { name: "list.append(x)", desc: "리스트 끝에 요소 추가", code: "arr.append('item')" }
        ]
      }
    };

    let subjectList = JSON.parse(JSON.stringify(defaultSubjectList));
    let appData = JSON.parse(JSON.stringify(defaultAppData));
    let currentSubject = "sub_html5";
    let currentEditCardIdx = null;

    // View Screen Switcher
    function showScreen(screenId) {
      document.querySelectorAll(".screen-view").forEach(s => s.classList.remove("active-screen"));
      const target = document.getElementById(screenId);
      if (target) target.classList.add("active-screen");
    }

    // Storage Management
    function saveToStorage() {
      try {
        localStorage.setItem("devnote_subjectList", JSON.stringify(subjectList));
        localStorage.setItem("devnote_appData", JSON.stringify(appData));
      } catch (e) { console.error("LocalStorage save error:", e); }
    }

    function loadFromStorage() {
      try {
        const sList = localStorage.getItem("devnote_subjectList");
        const aData = localStorage.getItem("devnote_appData");
        if (sList) subjectList = JSON.parse(sList);
        if (aData) appData = JSON.parse(aData);
      } catch (e) { console.error("LocalStorage load error:", e); }
    }

    // Supabase Cloud Sync Management
    async function saveToSupabase() {
      if (!supabaseClient || !currentUser) return;
      try {
        const payload = {
          id: currentUser.id,
          user_id: currentUser.id,
          data: { subjectList, appData, targetPath: document.getElementById("target-save-path")?.value },
          updated_at: new Date().toISOString()
        };
        await supabaseClient.from('devnote_data').upsert(payload);
      } catch (err) { console.error("Supabase Save Error:", err); }
    }

    async function loadFromSupabase() {
      if (!supabaseClient || !currentUser) return false;
      try {
        const { data, error } = await supabaseClient.from('devnote_data').select('*').eq('id', currentUser.id).single();
        if (error || !data || !data.data) return false;
        if (data.data.subjectList) subjectList = data.data.subjectList;
        if (data.data.appData) appData = data.data.appData;
        if (data.data.targetPath && document.getElementById("target-save-path")) {
          document.getElementById("target-save-path").value = data.data.targetPath;
        }
        return true;
      } catch (err) { console.error("Supabase Load Error:", err); return false; }
    }

    // =========================================================
    // AUTHENTICATION & CONCURRENT LOGIN PREVENTION LOGIC
    // =========================================================

    // Username to Internal Email Helper
    function formatUserEmail(username) {
      return `${username.toLowerCase()}@devnote.com`;
    }

    // Register / Sign Up
    async function handleLandingSignup() {
      const username = document.getElementById("landing-signup-username").value.trim();
      const password = document.getElementById("landing-signup-password").value.trim();
      const confirmPassword = document.getElementById("landing-signup-confirm").value.trim();
      const errBox = document.getElementById("landing-signup-error");
      const succBox = document.getElementById("landing-signup-success");

      errBox.style.display = "none";
      succBox.style.display = "none";

      if (!username || !password) {
        errBox.innerText = "아이디와 비밀번호를 모두 입력해주세요.";
        errBox.style.display = "block";
        return;
      }
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
        errBox.innerText = "아이디는 3~20자의 영문, 숫자, _, - 만 사용 가능합니다.";
        errBox.style.display = "block";
        return;
      }
      if (password.length < 6) {
        errBox.innerText = "비밀번호는 최소 6자 이상이어야 합니다.";
        errBox.style.display = "block";
        return;
      }
      if (password !== confirmPassword) {
        errBox.innerText = "비밀번호 확인이 일치하지 않습니다.";
        errBox.style.display = "block";
        return;
      }

      if (!supabaseClient) {
        errBox.innerText = "Supabase 서버 연결 실패.";
        errBox.style.display = "block";
        return;
      }

      // Check if username exists in user_profiles
      const { data: existingProfiles } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .ilike('username', username);

      if (existingProfiles && existingProfiles.length > 0) {
        errBox.innerText = "이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.";
        errBox.style.display = "block";
        return;
      }

      const email = formatUserEmail(username);
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });

      if (error) {
        errBox.innerText = "회원가입 실패: " + error.message;
        errBox.style.display = "block";
        return;
      }

      if (data.user) {
        // Save to user_profiles table
        await supabaseClient.from('user_profiles').upsert({
          username,
          user_id: data.user.id,
          email
        });

        succBox.innerText = `아이디 '${username}' 회원가입 완료! 로그인 탭에서 로그인해주세요.`;
        succBox.style.display = "block";
        document.getElementById("landing-signup-username").value = "";
        document.getElementById("landing-signup-password").value = "";
        document.getElementById("landing-signup-confirm").value = "";
      }
    }

    // Login
    async function handleLandingLogin() {
      const username = document.getElementById("landing-login-username").value.trim();
      const password = document.getElementById("landing-login-password").value.trim();
      const errBox = document.getElementById("landing-login-error");
      errBox.style.display = "none";

      if (!username || !password) {
        errBox.innerText = "아이디와 비밀번호를 모두 입력해주세요.";
        errBox.style.display = "block";
        return;
      }

      if (!supabaseClient) {
        errBox.innerText = "Supabase 서버 연결 실패.";
        errBox.style.display = "block";
        return;
      }

      // 1. Fetch user_profiles by username (case-insensitive)
      const { data: profiles } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .ilike('username', username);

      const profile = (profiles && profiles.length > 0) ? profiles[0] : null;
      const email = profile ? profile.email : formatUserEmail(username);

      // 2. Sign in with email & password
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        errBox.innerText = "로그인 실패: 아이디 또는 비밀번호를 확인해주세요.";
        errBox.style.display = "block";
        return;
      }

      if (data.session && data.user) {
        currentUser = data.session.user;
        currentUsername = profile ? profile.username : username;

        // Generate unique Session ID for duplicate login check
        currentSessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem("devnote_session_id", currentSessionId);
        sessionStorage.setItem("devnote_username", currentUsername);

        // Delete old sessions & insert fresh active session
        try {
          await supabaseClient.from('user_sessions').delete().eq('user_id', currentUser.id);
          await supabaseClient.from('user_sessions').insert({
            user_id: currentUser.id,
            session_id: currentSessionId,
            last_active: new Date().toISOString()
          });
        } catch (e) { console.error("Session update error:", e); }

        // Start session monitoring for duplicate login prevention
        startSessionMonitoring();

        // Load user data and switch to workspace
        await loadFromSupabase();
        enterWorkspace();
      }
    }

    // Logout
    async function handleLogout() {
      stopSessionMonitoring();
      if (supabaseClient) {
        if (currentUser) {
          try {
            await supabaseClient.from('user_sessions').delete().eq('user_id', currentUser.id);
          } catch (e) { console.error("Session delete error:", e); }
        }
        await supabaseClient.auth.signOut();
      }
      currentUser = null;
      currentUsername = "";
      currentSessionId = "";
      sessionStorage.clear();

      document.getElementById("landing-login-username").value = "";
      document.getElementById("landing-login-password").value = "";
      document.getElementById("landing-login-error").style.display = "none";

      showScreen("auth-landing-screen");
    }

    // Duplicate Login (중복 로그인) Monitoring
    function startSessionMonitoring() {
      stopSessionMonitoring();
      sessionCheckTimer = setInterval(async () => {
        if (!supabaseClient || !currentUser || !currentSessionId) return;
        try {
          const { data } = await supabaseClient
            .from('user_sessions')
            .select('session_id')
            .eq('user_id', currentUser.id)
            .single();

          if (data && data.session_id !== currentSessionId) {
            stopSessionMonitoring();
            alert("⚠️ 다른 기기 또는 브라우저에서 동일한 아이디로 로그인되어 현재 세션이 종료됩니다.");
            handleLogout();
          }
        } catch (e) { console.error("Session check error:", e); }
      }, 3000); // Check every 3 seconds
    }

    function stopSessionMonitoring() {
      if (sessionCheckTimer) {
        clearInterval(sessionCheckTimer);
        sessionCheckTimer = null;
      }
    }

    function enterWorkspace() {
      document.getElementById("current-username-display").innerText = currentUsername || (currentUser ? currentUser.email.split('@')[0] : '유저');
      showScreen("app-workspace-screen");
      renderSubjectNav();
      loadSubject(currentSubject);
    }

    // Landing Tabs Toggle
    function switchLandingTab(tab) {
      const tabLogin = document.getElementById("tab-landing-login");
      const tabSignup = document.getElementById("tab-landing-signup");
      const formLogin = document.getElementById("form-landing-login");
      const formSignup = document.getElementById("form-landing-signup");

      if (tab === "login") {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        formLogin.style.display = "flex";
        formSignup.style.display = "none";
      } else {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        formSignup.style.display = "flex";
        formLogin.style.display = "none";
      }
    }

    // Navigation & Data Render
    function renderSubjectNav() {
      const nav = document.getElementById("subject-nav");
      if (!nav) return;
      nav.innerHTML = "";
      subjectList.forEach(sub => {
        const btn = document.createElement("button");
        btn.className = `subject-tab ${sub.id === currentSubject ? "active" : ""}`;
        btn.innerHTML = `<i class="fa-solid fa-bookmark"></i> ${escapeHTML(sub.name)}`;
        btn.onclick = () => loadSubject(sub.id);
        nav.appendChild(btn);
      });
      const addBtn = document.createElement("button");
      addBtn.className = "add-subject-btn";
      addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> 과목 추가`;
      addBtn.onclick = openSubjectModal;
      nav.appendChild(addBtn);
    }

    function loadSubject(id) {
      currentSubject = id;
      renderSubjectNav();
      if (!appData[id]) {
        const meta = subjectList.find(s => s.id === id);
        appData[id] = { title: meta ? meta.name : "과목", defaultNote: "", defaultCode: "", cards: [], runnerType: meta ? meta.runnerType : "web" };
      }
      const data = appData[id];
      const noteInput = document.getElementById("note-input");
      const codeEditor = document.getElementById("code-editor");
      if (noteInput) noteInput.value = data.defaultNote || "";
      if (codeEditor) codeEditor.value = data.defaultCode || "";

      if (isNotePreviewMode) updateNotePreview();

      renderCards();
      setupRunnerView();
      renderLibraryTree();
    }

    function toggleNoteViewMode() {
      isNotePreviewMode = !isNotePreviewMode;
      const noteInput = document.getElementById("note-input");
      const notePreview = document.getElementById("note-preview-box");
      const btn = document.getElementById("btn-toggle-note-view");

      if (isNotePreviewMode) {
        updateNotePreview();
        noteInput.style.display = "none";
        notePreview.style.display = "block";
        btn.classList.add("active");
        btn.innerHTML = `<i class="fa-solid fa-pen"></i> 편집`;
      } else {
        noteInput.style.display = "block";
        notePreview.style.display = "none";
        btn.classList.remove("active");
        btn.innerHTML = `<i class="fa-solid fa-eye"></i> 미리보기`;
      }
    }

    function updateNotePreview() {
      const noteInput = document.getElementById("note-input");
      const notePreview = document.getElementById("note-preview-box");
      if (noteInput && notePreview) {
        notePreview.innerHTML = parseNoteMarkdown(noteInput.value);
      }
    }

    function renderCards(filterText = "") {
      const list = document.getElementById("card-list");
      if (!list) return;
      list.innerHTML = "";
      const data = appData[currentSubject] || { cards: [] };
      const allCards = data.cards || [];
      const searchVal = (filterText !== undefined && filterText !== "") ? filterText : (document.getElementById("search-input")?.value || "");
      const sortMode = document.getElementById("sort-select")?.value || "latest";

      let entries = allCards.map((card, realIdx) => ({ card, realIdx }));

      if (searchVal.trim()) {
        const ft = searchVal.trim().toLowerCase();
        entries = entries.filter(({ card }) =>
          (card.name && card.name.toLowerCase().includes(ft)) ||
          (card.desc && card.desc.toLowerCase().includes(ft))
        );
      }

      if (sortMode === "latest") {
        entries.sort((a, b) => {
          const timeA = a.card.createdAt || (a.realIdx + 1);
          const timeB = b.card.createdAt || (b.realIdx + 1);
          return timeB - timeA;
        });
      } else if (sortMode === "name") {
        entries.sort((a, b) => (a.card.name || "").localeCompare(b.card.name || "", 'ko', { sensitivity: 'base' }));
      } else if (sortMode === "oldest") {
        entries.sort((a, b) => a.realIdx - b.realIdx);
      }

      if (entries.length === 0) {
        list.innerHTML = `<div style="color:var(--text-muted); font-size:0.8rem; text-align:center; padding:20px 0;">등록된 사전에 카드가 없습니다.</div>`;
        return;
      }

      entries.forEach(({ card: c, realIdx }) => {
        const div = document.createElement("div");
        div.className = "dict-card";
        div.innerHTML = `
          <div class="card-title-row">
            <div class="card-title">${escapeHTML(c.name)}</div>
            <div class="card-actions">
              <button class="card-action-btn" onclick="openCardModal(${realIdx})"><i class="fa-solid fa-pen"></i></button>
              <button class="card-action-btn delete" onclick="deleteCard(${realIdx})"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <div class="card-desc">${escapeHTML(c.desc)}</div>
          ${c.code ? `<div class="code-snippet">${escapeHTML(c.code)}</div>` : ""}
        `;
        list.appendChild(div);
      });
    }

    function openCardModal(idx = null) {
      currentEditCardIdx = idx;
      const modal = document.getElementById("card-modal");
      const title = document.getElementById("card-modal-title");
      const nameIn = document.getElementById("card-name-input");
      const descIn = document.getElementById("card-desc-input");
      const codeIn = document.getElementById("card-code-input");

      if (idx !== null && appData[currentSubject].cards[idx]) {
        title.innerText = "사전 카드 수정";
        const c = appData[currentSubject].cards[idx];
        nameIn.value = c.name;
        descIn.value = c.desc;
        codeIn.value = c.code || "";
      } else {
        title.innerText = "사전 카드 추가";
        nameIn.value = "";
        descIn.value = "";
        codeIn.value = "";
      }
      modal.classList.add("active");
    }

    function closeCardModal() {
      document.getElementById("card-modal").classList.remove("active");
    }

    function saveCardFromModal() {
      const name = document.getElementById("card-name-input").value.trim();
      const desc = document.getElementById("card-desc-input").value.trim();
      const code = document.getElementById("card-code-input").value.trim();

      if (!name) { alert("카드 이름을 입력하세요."); return; }
      if (!appData[currentSubject].cards) appData[currentSubject].cards = [];

      if (currentEditCardIdx !== null) {
        const existing = appData[currentSubject].cards[currentEditCardIdx];
        appData[currentSubject].cards[currentEditCardIdx] = {
          name, desc, code,
          createdAt: existing?.createdAt || Date.now()
        };
      } else {
        appData[currentSubject].cards.push({ name, desc, code, createdAt: Date.now() });
      }
      closeCardModal();
      renderCards();
      saveCurrentData();
    }

    function deleteCard(idx) {
      if (confirm("이 카드를 삭제하시겠습니까?")) {
        appData[currentSubject].cards.splice(idx, 1);
        renderCards();
        saveCurrentData();
      }
    }

    // Code Execution & Runner
    function clearCodeRunnerOutputs() {
      const previewFrame = document.getElementById("web-preview");
      const diagramView = document.getElementById("diagram-view");
      const consoleOutput = document.getElementById("console-output");

      if (previewFrame) previewFrame.srcdoc = "";
      if (diagramView) diagramView.innerHTML = "<p style='color:var(--text-sub); text-align:center; padding:20px;'>시각화 결과가 여기에 표시됩니다.</p>";
      if (consoleOutput) consoleOutput.innerText = "결과가 여기에 표시됩니다...";

      if (window.pyodideInstance) {
        try {
          window.pyodideInstance.runPython(`
import sys, io
for name in list(globals().keys()):
    if not name.startswith('__') and name not in ('sys', 'io'):
        del globals()[name]
sys.stdout = io.StringIO()
          `);
        } catch(e) {}
      }
    }

    function clearCodeRunner() {
      const codeEditor = document.getElementById("code-editor");
      if (codeEditor) {
        codeEditor.value = "";
        if (appData[currentSubject]) {
          appData[currentSubject].defaultCode = "";
          saveCurrentData();
        }
      }
      clearCodeRunnerOutputs();
    }

    function setupRunnerView() {
      const sub = subjectList.find(s => s.id === currentSubject);
      const runnerType = sub ? sub.runnerType : "web";
      const previewFrame = document.getElementById("web-preview");
      const diagramView = document.getElementById("diagram-view");
      const consoleOutput = document.getElementById("console-output");
      const codeEditor = document.getElementById("code-editor");
      const code = codeEditor ? codeEditor.value : "";

      if (runnerType === "web") {
        previewFrame.style.display = "block";
        diagramView.style.display = "none";
        consoleOutput.style.display = "none";
        if (code.trim()) updateWebPreview();
        else previewFrame.srcdoc = "";
      } else if (runnerType === "diagram") {
        previewFrame.style.display = "none";
        diagramView.style.display = "block";
        consoleOutput.style.display = "none";
        if (code.trim()) renderMermaidDiagram();
        else diagramView.innerHTML = "<p style='color:var(--text-sub); text-align:center; padding:20px;'>시각화 결과가 여기에 표시됩니다.</p>";
      } else {
        previewFrame.style.display = "none";
        diagramView.style.display = "none";
        consoleOutput.style.display = "block";
        consoleOutput.innerText = code.trim() ? "실행 버튼(▶)을 누르면 결과가 표시됩니다." : "결과가 여기에 표시됩니다...";
      }
    }

    function executeCurrentCode() {
      const sub = subjectList.find(s => s.id === currentSubject);
      const runnerType = sub ? sub.runnerType : "web";
      if (runnerType === "web") updateWebPreview();
      else if (runnerType === "diagram") renderMermaidDiagram();
      else runPythonCode();
    }

    function updateWebPreview() {
      const code = document.getElementById("code-editor").value;
      const frame = document.getElementById("web-preview");
      if (!frame) return;
      frame.srcdoc = code || "<html><body></body></html>";
    }

    async function renderMermaidDiagram() {
      const code = document.getElementById("code-editor").value;
      const view = document.getElementById("diagram-view");
      if (!view) return;
      if (!code.trim()) {
        view.innerHTML = "<p style='color:var(--text-sub); text-align:center; padding:20px;'>시각화 결과가 여기에 표시됩니다.</p>";
        return;
      }
      view.innerHTML = "";
      try {
        if (window.mermaid) {
          const uniqueId = 'mermaid-svg-' + Date.now();
          const { svg } = await mermaid.render(uniqueId, code);
          view.innerHTML = svg;
        }
      } catch (e) { view.innerHTML = "<p style='color:#ef4444;'>다이어그램 문법을 확인해주세요.</p>"; }
    }

    async function runPythonCode() {
      const code = document.getElementById("code-editor").value;
      const consoleOut = document.getElementById("console-output");
      if (!consoleOut) return;

      if (!code.trim()) {
        consoleOut.innerText = "실행할 코드가 없습니다. 코드를 입력해주세요.";
        return;
      }

      consoleOut.innerText = "파이썬 실행 중...";
      try {
        if (!window.pyodideInstance && window.loadPyodide) {
          window.pyodideInstance = await window.loadPyodide();
        }
        if (window.pyodideInstance) {
          window.pyodideInstance.runPython(`
import sys, io
for name in list(globals().keys()):
    if not name.startswith('__') and name not in ('sys', 'io'):
        del globals()[name]
sys.stdout = io.StringIO()
          `);
          await window.pyodideInstance.runPythonAsync(code);
          const out = window.pyodideInstance.runPython("sys.stdout.getvalue()");
          consoleOut.innerText = out || "실행 결과가 없습니다.";
        } else {
          consoleOut.innerText = "Pyodide 파이썬 인터프리터 로딩에 실패했습니다.";
        }
      } catch (e) { consoleOut.innerText = "실행 에러:\n" + e; }
    }

    // Modal Helpers & Events
    function openSubjectModal() { document.getElementById("subject-modal").classList.add("active"); }
    function closeSubjectModal() { document.getElementById("subject-modal").classList.remove("active"); }

    function createNewSubject() {
      const name = document.getElementById("new-subject-name").value.trim();
      const category = document.getElementById("new-subject-category").value;
      const runnerType = document.getElementById("new-subject-runner").value;

      if (!name) { alert("과목 이름을 입력해주세요."); return; }
      const newId = "sub_" + Date.now();
      subjectList.push({ id: newId, name, category, runnerType });
      appData[newId] = { title: name, defaultNote: `# ${name} 노트\n`, defaultCode: "// 예제 코드", cards: [] };

      closeSubjectModal();
      document.getElementById("new-subject-name").value = "";
      loadSubject(newId);
      saveCurrentData();
    }

    function toggleSidebar() {
      document.getElementById("sidebar-drawer").classList.toggle("active");
      document.getElementById("sidebar-overlay").classList.toggle("active");
    }

    function renderLibraryTree() {
      const tree = document.getElementById("library-tree-view");
      const path = (document.getElementById("target-save-path")?.value.trim()) || "내_학습_라이브러리";
      if (!tree) return;
      let text = `📂 ${path}/\n`;
      const categories = [...new Set(subjectList.map(s => s.category || "05_사용자_추가_과목"))];
      categories.forEach(cat => {
        text += ` ├── 📂 ${cat}/\n`;
        const subs = subjectList.filter(s => (s.category || "05_사용자_추가_과목") === cat);
        subs.forEach(s => { text += ` │    └── 📄 ${s.name}.md\n`; });
      });
      tree.innerText = text;
    }

    function saveCurrentData() {
      if (!appData[currentSubject]) appData[currentSubject] = {};
      const noteInput = document.getElementById("note-input");
      const codeEditor = document.getElementById("code-editor");
      if (noteInput) appData[currentSubject].defaultNote = noteInput.value;
      if (codeEditor) appData[currentSubject].defaultCode = codeEditor.value;
      saveToStorage();
      saveToSupabase();
      const status = document.getElementById("save-status");
      if (status) {
        status.innerHTML = '<i class="fa-solid fa-check"></i> 저장 완료!';
        setTimeout(() => { status.innerHTML = '<i class="fa-solid fa-cloud"></i> 자동 저장됨'; }, 1500);
      }
    }

    // Export PDF & ZIP
    function exportToPDF() {
      const sub = subjectList.find(s => s.id === currentSubject);
      const noteContent = document.getElementById("note-input").value;
      const element = document.createElement("div");
      element.style.padding = "20px";
      element.style.color = "#000000";
      element.style.backgroundColor = "#ffffff";
      element.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      element.innerHTML = `
        <div style="font-size:1.6rem; font-weight:800; color:#000000; margin-bottom:14px; border-bottom:3px solid #000000; padding-bottom:8px;">
          DevNote - ${sub ? escapeHTML(sub.name) : '학습노트'}
        </div>
        <div>${parseNoteMarkdownForPDF(noteContent)}</div>
      `;

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${sub ? sub.name : '학습노트'}_DevNote.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      if (window.html2pdf) {
        html2pdf().set(opt).from(element).save();
      } else {
        alert("PDF 라이브러리를 로드할 수 없습니다.");
      }
    }

    function exportDictToPDF() {
      const sub = subjectList.find(s => s.id === currentSubject);
      const data = appData[currentSubject] || { cards: [] };
      const allCards = data.cards || [];
      const searchVal = document.getElementById("search-input")?.value || "";
      const sortMode = document.getElementById("sort-select")?.value || "latest";

      let entries = allCards.map((card, realIdx) => ({ card, realIdx }));

      if (searchVal.trim()) {
        const ft = searchVal.trim().toLowerCase();
        entries = entries.filter(({ card }) =>
          (card.name && card.name.toLowerCase().includes(ft)) ||
          (card.desc && card.desc.toLowerCase().includes(ft))
        );
      }

      if (sortMode === "latest") {
        entries.sort((a, b) => {
          const timeA = a.card.createdAt || (a.realIdx + 1);
          const timeB = b.card.createdAt || (b.realIdx + 1);
          return timeB - timeA;
        });
      } else if (sortMode === "name") {
        entries.sort((a, b) => (a.card.name || "").localeCompare(b.card.name || "", 'ko', { sensitivity: 'base' }));
      } else if (sortMode === "oldest") {
        entries.sort((a, b) => a.realIdx - b.realIdx);
      }

      const sortModeNames = {
        latest: "최신순",
        name: "이름순 (가나다/ABC)",
        oldest: "등록순"
      };

      const element = document.createElement("div");
      element.style.padding = "20px";
      element.style.color = "#000000";
      element.style.backgroundColor = "#ffffff";
      element.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      let cardsHtml = "";
      if (entries.length === 0) {
        cardsHtml = `<div style="padding: 20px 0; color: #666666; font-size: 1rem;">등록되거나 검색된 핵심 기능 사전 카드가 없습니다.</div>`;
      } else {
        entries.forEach(({ card }, idx) => {
          cardsHtml += `
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:14px 18px; margin-bottom:14px; page-break-inside:avoid; break-inside:avoid;">
              <div style="font-size:1.1rem; font-weight:700; color:#0f172a; margin-bottom:6px;">
                ${idx + 1}. ${escapeHTML(card.name)}
              </div>
              <div style="font-size:0.95rem; color:#334155; line-height:1.5; white-space:pre-wrap; margin-bottom:8px;">
                ${escapeHTML(card.desc)}
              </div>
              ${card.code ? `
                <div style="background:#1e293b; color:#f8fafc; padding:10px 14px; border-radius:6px; font-family:Consolas, Monaco, monospace; font-size:0.85rem; white-space:pre-wrap; word-break:break-all;">
                  ${escapeHTML(card.code)}
                </div>
              ` : ""}
            </div>
          `;
        });
      }

      element.innerHTML = `
        <div style="font-size:1.6rem; font-weight:800; color:#000000; margin-bottom:10px; border-bottom:3px solid #000000; padding-bottom:8px;">
          DevNote - ${sub ? escapeHTML(sub.name) : '과목'} 핵심기능 사전
        </div>
        <div style="font-size:0.85rem; color:#475569; margin-bottom:16px; font-weight:600;">
          정렬 방식: ${sortModeNames[sortMode] || '최신순'} ${searchVal.trim() ? `| 검색어: "${escapeHTML(searchVal.trim())}"` : ''} | 총 ${entries.length}개 항목
        </div>
        <div>${cardsHtml}</div>
      `;

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${sub ? sub.name : '핵심기능사전'}_사전카드_DevNote.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      if (window.html2pdf) {
        html2pdf().set(opt).from(element).save();
      } else {
        alert("PDF 라이브러리를 로드할 수 없습니다.");
      }
    }

    function exportCurrentMarkdownFile() {
      const sub = subjectList.find(s => s.id === currentSubject);
      const data = appData[currentSubject];
      if (!sub || !data) return;
      let md = `# ${sub.name}\n\n## 1. 학습 노트\n${data.defaultNote || ''}\n\n## 2. 예제 코드\n\`\`\`\n${data.defaultCode || ''}\n\`\`\`\n`;
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sub.name}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }

    function exportHierarchyZip() {
      if (!window.JSZip) { alert("JSZip 라이브러리가 필요합니다."); return; }
      saveCurrentData();
      const zip = new JSZip();
      const path = (document.getElementById("target-save-path")?.value.trim()) || "내_학습_라이브러리";
      const folder = zip.folder(path);

      subjectList.forEach(sub => {
        const cat = sub.category || "05_사용자_추가_과목";
        const catFolder = folder.folder(cat);
        const data = appData[sub.id] || {};
        const content = `# ${sub.name}\n\n## 1. 학습 노트\n${data.defaultNote || ''}\n\n## 2. 실습 코드\n\`\`\`\n${data.defaultCode || ''}\n\`\`\`\n`;
        catFolder.file(`${sub.name}.md`, content);
      });

      zip.generateAsync({ type: "blob" }).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${path}_백업.zip`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    function exportDataJSON() {
      saveCurrentData();
      const obj = { subjectList, appData, targetPath: document.getElementById("target-save-path")?.value };
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DevNote_Backup_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    function importDataJSON(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed.subjectList && parsed.appData) {
            subjectList = parsed.subjectList;
            appData = parsed.appData;
            saveToStorage();
            loadSubject(subjectList[0].id);
            alert("성공적으로 데이터를 복원했습니다!");
            toggleSidebar();
          }
        } catch (err) { alert("JSON 파일 파싱 실패: " + err); }
      };
      reader.readAsText(file);
    }

    // Attach UI Event Handlers
    
    // Auto-convert Korean Won symbol (₩) to real Backslash (\) for Korean Keyboards
    function convertWonToBackslash(el) {
      if (!el) return;
      el.addEventListener("input", () => {
        if (el.value.includes('₩')) {
          const start = el.selectionStart;
          const end = el.selectionEnd;
          el.value = el.value.replace(/₩/g, '\\');
          el.setSelectionRange(start, end);
        }
      });
    }
  
    function attachEvents() {
      // Landing Screen Auth Events
      document.getElementById("tab-landing-login").addEventListener("click", () => switchLandingTab("login"));
      document.getElementById("tab-landing-signup").addEventListener("click", () => switchLandingTab("signup"));
      document.getElementById("btn-landing-login").addEventListener("click", handleLandingLogin);
      document.getElementById("btn-landing-signup").addEventListener("click", handleLandingSignup);

      document.getElementById("landing-login-password").addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleLandingLogin();
      });
      document.getElementById("landing-signup-confirm").addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleLandingSignup();
      });

      // Workspace Logout Event
      document.getElementById("btn-workspace-logout").addEventListener("click", handleLogout);

      // Workspace Buttons
      document.getElementById("btn-open-sidebar").addEventListener("click", toggleSidebar);
      document.getElementById("btn-close-sidebar").addEventListener("click", toggleSidebar);
      document.getElementById("sidebar-overlay").addEventListener("click", toggleSidebar);

      document.getElementById("btn-toggle-note-view").addEventListener("click", toggleNoteViewMode);
      document.getElementById("btn-export-pdf").addEventListener("click", exportToPDF);
      document.getElementById("btn-export-dict-pdf").addEventListener("click", exportDictToPDF);
      document.getElementById("btn-save-data").addEventListener("click", saveCurrentData);
      document.getElementById("btn-run-code").addEventListener("click", executeCurrentCode);
      document.getElementById("btn-clear-code").addEventListener("click", clearCodeRunner);
      document.getElementById("code-editor").addEventListener("input", (e) => {
        if (appData[currentSubject]) {
          appData[currentSubject].defaultCode = e.target.value;
        }
        if (!e.target.value.trim()) {
          clearCodeRunnerOutputs();
        }
      });
      document.getElementById("btn-open-card-modal").addEventListener("click", () => openCardModal());

      document.getElementById("btn-cancel-subject").addEventListener("click", closeSubjectModal);
      document.getElementById("btn-create-subject").addEventListener("click", createNewSubject);

      document.getElementById("btn-cancel-card").addEventListener("click", closeCardModal);
      document.getElementById("btn-save-card").addEventListener("click", saveCardFromModal);

      document.getElementById("btn-export-current-md").addEventListener("click", exportCurrentMarkdownFile);
      document.getElementById("btn-export-zip").addEventListener("click", exportHierarchyZip);
      document.getElementById("btn-export-json").addEventListener("click", exportDataJSON);
      document.getElementById("btn-import-json-trigger").addEventListener("click", () => document.getElementById("import-file-input").click());
      document.getElementById("import-file-input").addEventListener("change", importDataJSON);

      document.getElementById("search-input").addEventListener("input", (e) => renderCards(e.target.value));
      document.getElementById("sort-select").addEventListener("change", () => renderCards());
      convertWonToBackslash(document.getElementById("note-input"));
      convertWonToBackslash(document.getElementById("code-editor"));
      convertWonToBackslash(document.getElementById("card-code-input"));
      convertWonToBackslash(document.getElementById("card-desc-input"));

      // Markdown Toolbar Insert
      document.querySelectorAll("#markdown-toolbar .tool-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const insertText = btn.getAttribute("data-insert");
          const textarea = document.getElementById("note-input");
          if (!textarea || !insertText) return;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value = textarea.value.substring(0, start) + insertText + textarea.value.substring(end);
          textarea.focus();
          if (isNotePreviewMode) updateNotePreview();
        });
      });

      // Mobile Tabs
      document.getElementById("tab-btn-dict").addEventListener("click", () => switchMobileTab("panel-dict", "tab-btn-dict"));
      document.getElementById("tab-btn-note").addEventListener("click", () => switchMobileTab("panel-note", "tab-btn-note"));
      document.getElementById("tab-btn-runner").addEventListener("click", () => switchMobileTab("panel-runner", "tab-btn-runner"));
    }

    function switchMobileTab(panelId, tabId) {
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("mobile-active"));
      document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
      document.getElementById(panelId).classList.add("mobile-active");
      document.getElementById(tabId).classList.add("active");
    }

    // Initialization
    window.addEventListener("DOMContentLoaded", async () => {
      loadFromStorage();
      attachEvents();

      if (supabaseClient) {
        try {
          const { data } = await supabaseClient.auth.getSession();
          if (data && data.session) {
            currentUser = data.session.user;
            const savedSessionId = sessionStorage.getItem("devnote_session_id");
            const savedUsername = sessionStorage.getItem("devnote_username");

            if (savedSessionId && savedUsername) {
              currentSessionId = savedSessionId;
              currentUsername = savedUsername;

              // Check if session is still valid (not logged in elsewhere)
              const { data: sessData } = await supabaseClient
                .from('user_sessions')
                .select('session_id')
                .eq('user_id', currentUser.id)
                .single();

              if (!sessData || sessData.session_id === currentSessionId) {
                startSessionMonitoring();
                await loadFromSupabase();
                enterWorkspace();
                return;
              }
            }
          }
        } catch (e) { console.error("Auth Session Restore Error:", e); }
      }

      // Default: Show Landing / Auth Screen
      showScreen("auth-landing-screen");
    });