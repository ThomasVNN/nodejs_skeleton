import Express from "express";
import AnalyticController from "../controllers/analyticController";
// import passport from "passport";
const cors = require("cors");

class AnalyticsRoutes {
  constructor() {
    this.router = Express().bind(this);
    this.router.use(cors());

    const analyticController = new AnalyticController();
    this.router.post("/store", analyticController.createAStore);
    this.router.post("/store/:id", analyticController.updateAStore);
    this.router.delete("/store/:id", analyticController.deleteAStore);

    this.router.post("/store-group-user", analyticController.createStoreGroupUser);
    this.router.post("/store-group-user/:id", analyticController.updateStoreGroupUser);
    this.router.delete("/store-group-user/:id", analyticController.deleteStoreGroupUser);

    this.router.post("/store-user", analyticController.createStoreUser);
    this.router.post("/store-user/:id", analyticController.updateStoreUser);
    this.router.delete("/store-user/:id", analyticController.deleteStoreUser);
    //
    this.router.post("/store-store-group", analyticController.createStoreStoreGroup);
    this.router.post("/store-store-group/:id", analyticController.updateStoreStoreGroup);
    this.router.delete("/store-store-group/:id", analyticController.deleteStoreStoreGroup);
    //
    this.router.post("/store-groups", analyticController.createStoreGroup);
    this.router.post("/store-groups/:id", analyticController.updateStoreGroup);
    this.router.delete("/store-groups/:id", analyticController.deleteStoreGroup);
    this.router.post("/sns/:id", analyticController.powerAPI);

    return this.router;
  }
}
export default AnalyticsRoutes;
