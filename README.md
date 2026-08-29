# 📚 DevNote Pro - 스마트 학습 노트 & 사전 (Smart Dev Note & Dictionary)

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-green.svg)](https://supabase.com)
[![JavaScript](https://img.shields.io/badge/Vanilla-ES6+-yellow.svg)]()

> **DevNote Pro**는 개발자를 위한 스마트한 학습 노트, 핵심 기능 사전, 그리고 멀티 실습실(HTML/JS, Pyodide Python, Mermaid 다이어그램)을 하나로 통합한 웹 애플리케이션입니다.

---

## ✨ 핵심 기능 (Key Features)

1. **🎨 랜딩페이지 & 아이디 기반 인증 (Landing Auth Screen)**
   - 메일주소 없이 영문/숫자 **아이디(Username)** 기반의 간편 로그인 & 회원가입.
   - 단독 랜딩 화면 구현으로 첫 방문 시 직관적인 로그인/회원가입 UI 제공.

2. **🔒 실시간 중복 로그인 방지 (Concurrent Session Control)**
   - Supabase `user_sessions` 테이블 연동으로 동일 아이디의 이중 접속을 실시간 감지.
   - 타 기기에서 새 로그인 발생 시 기존 세션 자동 종료 안내.

3. **☁️ Supabase 클라우드 데이터 동기화**
   - 사용자별 학습 노트, 사전 카드, 과목 목록을 Supabase DB(`devnote_data`)에 자동 보관.
   - 언제 어디서 접속하든 본인의 최신 학습 상태를 즉시 복원.

4. **📝 커스텀 마크다운 노트 & PDF 추출 기능**
   - **`###`** : 노트 페이지 넘김 분할 (PDF 출력 시 해당 위치부터 새 페이지 맨 최상단 작성).
   - **`+++ 내용 +++`** : 파스텔 그린 강조 블록 (`#dcfce7`).
   - **`=== 내용 ===`** : 파스텔 퍼플 강조 블록 (`#f3e8ff`).
   - **`# `, `## `** : PDF 및 웹 미리보기 시 `#` 기호 제거 후 깔끔한 제목 스타일링 적용.
   - **`html2pdf.js`** : 여백과 글자색(검은색 통일)이 완벽히 적용된 A4 표준 PDF 파일 생성 (중간 빈 페이지 0개 보장).

5. **⚡ 멀티 아키텍처 실습실 (Code Runner)**
   - **웹 프리뷰** : HTML / CSS / JS 즉시 렌더링 (`srcdoc` 보안 적용).
   - **Python 인터프리터** : 웹 브라우저 기반 Pyodide 엔진으로 파이썬 코드 즉시 실행.
   - **Mermaid 다이어그램** : 시퀀스 및 순서도 다이어그램 실시간 시각화.

6. **📁 모듈형 라이브러리 & 내보내기**
   - 과목별 계층 구조 정리 및 모듈별 `.md` 다운로드.
   - 전체 학습 라이브러리 `.zip` 구조적 압축 내보내기 및 JSON 백업/복원.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend / Database**: Supabase (PostgreSQL, Auth, RLS)
- **External Libraries**:
  - [FontAwesome 6.4.0](https://fontawesome.com/) (아이콘 시스템)
  - [html2pdf.js 0.10.1](https://github.com/eKoopmans/html2pdf.js) (PDF 문서화)
  - [JSZip 3.10.1](https://stuk.github.io/jszip/) (ZIP 백업)
  - [Mermaid 10](https://mermaid.js.org/) (다이어그램)
  - [Pyodide v0.23.4](https://pyodide.org/) (브라우저 파이썬 실행)

---

## 🗄️ Database Schema (Supabase)

```sql
-- 1. 유저 프로필 테이블
CREATE TABLE IF NOT EXISTS public.user_profiles (
  username TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 학습 노트 & 사전 데이터 테이블
CREATE TABLE IF NOT EXISTS public.devnote_data (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 활성 세션 테이블 (중복 로그인 방지)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  user_id UUID PRIMARY KEY,
  session_id TEXT NOT NULL,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 회원가입 이메일 자동 승인 트라이거
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

---

## 🚀 시작하기 (Local Setup)

1. 저장소를 클론합니다:
   ```bash
   git clone https://github.com/Aso-n07/DevNote_Pro.git
   ```
2. 해당 폴더에서 로컬 웹 서버(예: Live Server, http-server 등)로 `index.html` 또는 `DevNote_Pro.html`을 실행합니다.
   ```bash
   npx http-server -p 8080
   ```
3. 브라우저에서 `http://localhost:8080/index.html` 접속 후 학습을 시작합니다!
