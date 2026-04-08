export const MessageCode = {
  // 성공
  SIGNUP_SUCCESS: {
    code: 'S001',
    msg: '회원가입이 완료되었습니다.',
  },
  LOGIN_SUCCESS: {
    code: 'S002',
    msg: '로그인되었습니다.',
  },
  UPDATE_SUCCESS: {
    code: 'S003',
    msg: '정보가 수정되었습니다.',
  },
  // 설정
  NAME_REQUIRED: { code: 'U001', msg: '이름을 입력해주세요.' },
  NAME_UPDATE_SUCCESS: { code: 'U002', msg: '이름이 변경되었습니다.' },

  PASSWORD_REQUIRED: { code: 'U003', msg: '비밀번호를 입력해주세요.' },
  PASSWORD_MISMATCH: { code: 'U004', msg: '비밀번호가 일치하지 않습니다.' },
  PASSWORD_UPDATE_SUCCESS: { code: 'U005', msg: '비밀번호가 변경되었습니다.' },
  PASSWORD_INCORRECT: {
    code: 'U006',
    msg: '현재 비밀번호가 올바르지 않습니다.',
  },
  //유저XX
  USER_NOT_FOUND: {
    code: 'U007',
    msg: '사용자 정보를 찾을 수 없습니다.',
  },
};
