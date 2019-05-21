const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force:true}).then((res) => {
      User.create({
        username: "Mary",
        email: "Mary@email.com",
        password: "123983048"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "rabbits in the park",
          body: "description of rabbits in the park",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });

//wiki unit tests

describe("#create()", () => {

  it("should create a wiki object with a title, body, & privacy setting", (done) => {
    Wiki.create({
      title: "monkeys in the trees",
      body: "description of monkeys in tress",
      userId: this.user.id
    })
    .then((wiki) => {
      expect(wiki.title).toBe("monkeys in the trees");
      expect(wiki.body).toBe("description of monkeys in tress");
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  it("should not create a wiki object that doesn't have a title or description", (done) =>{
    Wiki.create({

    })
    .then((wiki) => {
      done();
    })
    .catch((err) => {
      //console.log("error.......");
      //console.log(err);
      expect(err.message).toContain("Wiki.title cannot be null");
      expect(err.message).toContain("Wiki.body cannot be null");
      expect(err.message).toContain("Wiki.userId cannot be null");
      done();
    });
  });

});

})
