# 🤖 AI Prompt Specification: DevNote Pro 웹사이트 재현 기획서

> 본 문서는 어떤 LLM(Gemini, Claude, ChatGPT 등)에게 제공해도 **DevNote Pro 웹사이트의 UI/UX, 파서 규칙, Supabase 연동, 세션 방지 로직, PDF 생성기**를 100% 동일하게 구현해낼 수 있도록 작성된 **최상위 AI 프롬프트 기술 명세서**입니다.

---

## 🎯 1. System Prompt (AI 전달용 프롬프트)

```text
You are a World-Class Senior Full-Stack Web Developer.
Your task is to build a modern, high-performance Single-Page Application (SPA) named "DevNote Pro - Smart Developer Note & Dictionary".

Follow the exact technical specifications provided below. Do not omit any features, custom markdown rules, or security mechanisms.
```

---

## 📐 2. Application Architecture Overview

1. **단일 페이지 애플리케이션 (SPA) 뷰전환 구조**
   - `#auth-landing-screen` : 비로그인 시 표시되는 랜딩 및 회원가입/로그인 전용 화면.
   - `#app-workspace-screen` : 로그인 성공 시 접속되는 3열(사전 / 노트 / 실습실) 워크스페이스 메인 화면.

2. **디자인 시스템 (CSS Tokens)**
   - Dark Slate / Neon Accent 테마 적용
   - Main Background: `#0f172a`
   - Panel Background: `#1e293b`
   - Card Background: `#334155`
   - Border Color: `#475569`
   - Accent Blue: `#38bdf8`
   - Primary Indigo: `#6366f1`
   - Success Green: `#22c55e`
   - Danger Red: `#ef4444`

---

## 🔒 3. User Authentication & Concurrent Session Specification

### 3.1. Username-to-Email Mapping Rule
- 서비스는 사용자가 이메일 대신 **아이디(Username)**로 회원가입 및 로그인하도록 구현합니다.
- 내부적으로 Supabase Auth 연동 시 `username.toLowerCase() + "@devnote.com"` 형태로 이메일을 매핑합니다.

### 3.2. Auto Email Confirmation SQL Trigger
- Supabase 비밀번호 로그인 시 400 에러를 방지하기 위해 `auth.users`에 아래 SQL 트리가 선언되어야 합니다:
  ```sql
  CREATE OR REPLACE FUNCTION public.fn_auto_confirm_user()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.email_confirmed_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER tr_auto_confirm_user
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.fn_auto_confirm_user();
  ```

### 3.3. Real-time Duplicate Login Prevention (중복 로그인 차단)
- 로그인 성공 시 유일한 세션 토큰 `sess_${Date.now()}_${random}`을 생성하여 `sessionStorage`와 `user_sessions` DB 테이블에 기록합니다.
- `setInterval(checkSession, 3000)`으로 3초마다 `user_sessions`의 `session_id`를 검사합니다.
- 타 기기에서 동일 아이디로 새로 로그인하면 DB의 `session_id`가 갱신되어, 기존 접속자는 경고 알림 후 자동으로 로그아웃(`handleLogout`)됩니다.

---

## 📝 4. Custom Markdown & PDF Parsing Specification

### 4.1. Custom Note Command Parser Rules
1. **`+++` 그린 강조 블록**
   - 구문: `+++\n내용\n+++`
   - 웹 preview: `<div class="highlight-green">내용</div>` (배경: `rgba(34, 197, 94, 0.18)`, 테두리: `#22c55e`)
   - PDF export: `<div style="background:#dcfce7; border-left:5px solid #16a34a; padding:12px 16px; border-radius:6px; margin:10px 0; font-weight:600; white-space:pre-wrap;">내용</div>`
   - **중요**: 이스케이프 이중 변환 버그 방지를 위해 `___HIGHLIGHT_GREEN_0___` 토큰 플레이스홀더 패턴을 사용하여 추출 후 복원합니다.

2. **`===` 퍼플 강조 블록**
   - 구문: `===\n내용\n===`
   - 웹 preview: `<div class="highlight-purple">내용</div>` (배경: `rgba(168, 85, 247, 0.18)`, 테두리: `#a855f7`)
   - PDF export: `<div style="background:#f3e8ff; border-left:5px solid #9333ea; padding:12px 16px; border-radius:6px; margin:10px 0; font-weight:600; white-space:pre-wrap;">내용</div>`

3. **`###` 페이지 구획선 & PDF 페이지 넘김**
   - 웹 preview: `<div class="page-divider"></div>` (점선 구분선 표시)
   - PDF export: `rawText.split(/^\s*###\s*$/gm)`로 노트 텍스트를 청크 분리.
   - 마지막 청크를 제외한 모든 페이지 청크에만 `page-break-after: always; break-after: page;`를 부여하고 `margin: 0; padding: 0;` 적용.
   - 제목(`# `, `## `)의 `margin-top: 0`을 설정하여 **모든 `###` 뒤의 텍스트가 새 PDF 페이지의 맨 최상단 0px 위치부터 바로 작성**되도록 보장합니다.

4. **`# `, `## ` 헤더 기호 제거**
   - `# Heading 1` -> `<h1>Heading 1</h1>` (`# ` 문자 제거)
   - `## Heading 2` -> `<h2>Heading 2</h2>` (`## ` 문자 제거)

5. **PDF 글자색 및 여백 표준화**
   - 모든 PDF 본문 텍스트 색상은 `#000000`(순수 검은색)으로 통일합니다.

---

## 💻 5. Multi-Runner Code Execution Specification

1. **Web Preview Runner**
   - HTML/CSS/JavaScript 코드 실행.
   - `iframe.srcdoc = code` 방식으로 로컬 보안 정책 에러 없는 실시간 웹 렌더링.

2. **Python Interpreter Runner**
   - Pyodide WebAssembly 파이썬 엔진 사용.
   - `sys.stdout = io.StringIO()`를 이용해 파이썬 `print()` 출력을 콘솔 영역에 실시간 캡처 및 표시.

3. **Mermaid Diagram Visualizer**
   - Mermaid.js 10 버전 연동.
   - `mermaid.render('mermaid-svg', code)`를 통한 순서도 및 클래스 다이어그램 실시간 SVG 변환.

---

## 📦 6. Data Structure & Export Specification

```json
{
  "subjectList": [
    { "id": "sub_html5", "name": "01_HTML5", "category": "01_웹_프론트엔드(Web_Frontend)", "runnerType": "web" }
  ],
  "appData": {
    "sub_html5": {
      "title": "HTML5 학습",
      "defaultNote": "# HTML5 웹 시맨틱 태그 노트\n...",
      "defaultCode": "<!DOCTYPE html>...",
      "cards": [
        { "name": "<header>", "desc": "헤더 영역", "code": "<header></header>" }
      ]
    }
  }
}
```

- **JSZip 백업**: 카테고리별 폴더 구조 생성 후 과목별 `.md` 파일 압축 다운로드.
- **JSON 백업/복원**: Entire Application State 백업 및 파일 업로드 파싱 복원.

---

## 🏆 7. Definition of Done (검증 완료 기준)
1. `DevNote_Pro.html` / `index.html` 접근 시 아이디 로그인/회원가입 랜딩 페이지가 표시된다.
2. 회원가입 후 로그인 시 Supabase DB에 유저 세션 및 프로필 데이터가 생성된다.
3. 동일 아이디로 타 브라우저 로그인 시 기존 브라우저가 자동 로그아웃된다.
4. 노트 작성 시 `+++`, `===`, `###` 문법이 정상 렌더링되며, PDF 출력 시 `###` 뒤의 텍스트가 **다음 페이지 최상단**에 배치되고 **중간 빈 페이지가 0개**이다.
5. 웹/파이썬/Mermaid 실습실이 문제없이 동작한다.
