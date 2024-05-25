import { expect, use } from "chai";
import chaiHttp from "chai-http";
import { after, beforeEach, describe, it } from "mocha";
import { app } from "../index.js";
import { User } from "../models/User.js";

const chai = use(chaiHttp);

describe("User Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(() => {
    process.exit(0);
  });

  describe("GET /api/users/check-profile/:supabaseId", () => {
    it("should return false if the user does not exist", async () => {
      const res = await chai
        .request(app)
        .get("/api/users/check-profile/nonexistentId");
      expect(res.body.exists).to.be.false;
    });

    it("should return true if the user exists", async () => {
      const user = new User({
        supabaseId: "existingId",
        reviewWeights: {},
        username: "username",
        discordUserId: "discordUserId",
      });
      await user.save();
      const res = await chai
        .request(app)
        .get("/api/users/check-profile/existingId");
      expect(res.body.exists).to.be.true;
    });
  });

  describe("POST /api/users/onboard", () => {
    it("should onboard a new user", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/onboard")
        .send({
          supabaseId: "newUserId",
          reviewWeights: { plot: 1, acting: 2 },
          discordUserId: "discordUserId",
          username: "username",
        });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property("supabaseId", "newUserId");
    });
  });
});
