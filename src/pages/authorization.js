import axios from 'axios';

async function isUserAuthorized() {
  const { data: authorizationInfo } = await axios.get(`http://${location.host}/api/v1/is-authorized`);
  return authorizationInfo.isUserAuthorized;
}

async function isRequiredInstagramLogin() {
  const { data: loginRequire } = await axios.get(`http://${location.host}/api/v1/is-required-login`);
  return loginRequire.isRequiredLogin;
}

async function isRequiredLoginSecurityCode() {
  const { data: loginSecurity } = await axios.get(`http://${location.host}/api/v1/is-required-security-code`);
  return loginSecurity.isRequiredSecurityCode;
}

export { isUserAuthorized, isRequiredInstagramLogin, isRequiredLoginSecurityCode };
