export const ErrorCode = {
  // 공통
  UNKNOWN: { code: 'E000', msg: '알 수 없는 오류가 발생했습니다.' },
  NETWORK: { code: 'E001', msg: '네트워크 오류가 발생했습니다.' },
  TIMEOUT: { code: 'E002', msg: '요청 시간이 초과되었습니다.' },

  // 인증
  LOGIN_FAILED: {
    code: 'A001',
    msg: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  EMAIL_EXISTS: { code: 'A002', msg: '이미 사용중인 이메일입니다.' },
  SESSION_EXPIRED: { code: 'A003', msg: '로그인 세션이 만료되었습니다.' },
  //회원가입실패->이메일 중복 처리로 변경
  REGISTER_FAILED: {
    code: 'A004',
    msg: '중복된 이메일 입니다.',
  },

  LOGIN_FAILED: {
    code: 'A001',
    msg: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },

  USER_UPDATE_FAILED: {
    code: 'U008',
    msg: '사용자 정보 수정에 실패했습니다.',
  },

  // 회원가입 validation
  REQUIRED: { code: 'V000', msg: '필수 입력 항목을 입력해주세요.' },
  INVALID_NAME: {
    code: 'V001',
    msg: '이름은 2자 이상 10자 이하로 입력해주세요.',
  },
  INVALID_EMAIL: { code: 'V002', msg: '이메일 형식이 올바르지 않습니다.' },
  PASSWORD_SHORT: { code: 'V003', msg: '비밀번호는 8자 이상이어야 합니다.' },
  PASSWORD_MISMATCH: { code: 'V004', msg: '비밀번호가 일치하지 않습니다.' },

  // 등록
  INVALID_AMOUNT: { code: 'T001', msg: '금액은 숫자만 입력 가능합니다.' },
  INVALID_AMOUNT_RANGE: { code: 'T002', msg: '금액은 1원 이상이어야 합니다.' },
  INVALID_DATE: { code: 'T003', msg: '날짜 형식이 올바르지 않습니다.' },
  FILE_TOO_LARGE: { code: 'T004', msg: '파일 용량은 5MB 이하입니다.' },
  INVALID_FILE_TYPE: { code: 'T005', msg: '지원하지 않는 파일 형식입니다.' },
  CREATE_FAILED: { code: 'T006', msg: '등록에 실패했습니다.' },

  // 리스트
  FETCH_FAILED: { code: 'L001', msg: '데이터를 불러오지 못했습니다.' },
  DELETE_FAILED: { code: 'L002', msg: '삭제에 실패했습니다.' },
  UPDATE_FAILED: { code: 'L003', msg: '수정에 실패했습니다.' },

  // 대시보드
  DASHBOARD_FAILED: { code: 'D001', msg: '통계 데이터를 불러오지 못했습니다.' },
  SUMMARY_FAILED: { code: 'D002', msg: '소비 패턴 분석 데이터를 불러오지 못했습니다.' },
};
