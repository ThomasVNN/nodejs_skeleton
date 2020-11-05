import * as appService from "../services/AppService";
import { SUCCESS } from "../services/ResultCode";
import { connect } from "../db";
import { DATABASE_URL } from "../configs/config";

let mongoose;
describe("app service", () => {
  beforeAll(async () => {
    mongoose = await connect(DATABASE_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("can get app config", async () => {
    const appConfig = await appService.getAppConfig();

    expect(appConfig.result).toBe(SUCCESS);

    const data = appConfig.data;
    expect(data.appVersions.length).toBe(1);

    const app = data.appVersions[0];
    expect(app.forceUpdate).toBeFalsy();
    expect(app.version).toBe("1.30.0.9");
    expect(app.platform).toBe("IOS");
    expect(app.url).toBe("http://localhost");
  });
});
