import * as ResultCode from "../constants/resultCode"
function appVersionToResult(appVersion) {
  return {
    id: appVersion.id
  }
}

export async function getAppConfig() {
  // const appVersions = await AppVersionModel.find({ isActive: true });
  const appVersion = {id:"SAAS demo api"}
  const appVersionsResult = appVersionToResult(appVersion);
  const result = {
    serverTimestamp: Date.now(),
    appVersions: appVersionsResult
  };
  return { result: ResultCode.SUCCESS, data: result };
}
