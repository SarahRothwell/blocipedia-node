const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

describe("#create()", () => {

  it("should create a User object with a valid email address, username, and password", (done) => {
    User.create({
      username: "sarah",
      email: "user@example.com",
      password: "1234567890"
    })
    .then((user) => {
      expect(user.email).toBe("user@example.com");
      expect(user.username).toBe("sarah");
      expect(user.id).toBe(1);
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  it("should not create a user with an invalid email", (done) => {
    User.create({
      username: "marcus",
      email: "This-isn't-an email_address",
      password: "1234567890"
    })
    .then((user) => {
      done();
    })
    .catch((err) => {
      expect (err.message).toContain("Validation error: must be a valid email");
      done();
    });
  });

  it("should not create an email address that is already taken", (done) => {
    User.create({
      username: "Jamie",
      email: "user@example.com",
      password: "1234567890"
    })
    .then((user) => {
      User.create({
        username: "henry",
        email: "user@example.com",
        password: "738484729"
    })
    .then ((user) => {
      done();
    })
    .catch((err) => {
      expect(err.message).toContain("Validation Error");
      done();
    })
    done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

});


});
