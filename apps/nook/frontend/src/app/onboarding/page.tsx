import Onboarding from '@/features/onboarding';

/**
 * 
 IdP(auth 서버)에서 최초 회원가입 후, nook DB에 유저 정보가 없을 때 표시되는 온보딩 페이지입니다.
 */
export default function OnboardingPage() {
  return <Onboarding />;
}
