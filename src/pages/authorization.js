import axios from 'axios';

export default async function isUserAuthorized() {
  const { data: authorizationInfo } = await axios.get(`http://${location.host}/api/v1/is-authorized`);
  return authorizationInfo.isUserAuthorized;
}
