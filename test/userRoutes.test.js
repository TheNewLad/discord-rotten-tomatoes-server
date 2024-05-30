import { expect, use } from "chai";
import chaiHttp from "chai-http";
import { after, beforeEach, context, describe, it } from "mocha";
import { app } from "../index.js";
import { UserModel } from "../models/user.model.js";

const chai = use(chaiHttp);

describe("UserModel Routes", () => {
  const endpoint = "/api/users";

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  after(() => {
    process.exit(0);
  });

  describe(`GET ${endpoint}`, () => {
    context("when no action query param is provided", () => {
      it("should return 204 no content", async () => {
        const res = await chai.request(app).get(endpoint);
        expect(res).to.have.status(204);
      });
    });
  });
});
