const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wikis", () => {

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
      //  console.log(user);
        this.user = user;

        Wiki.create({
          title: "Wiki title",
          body: "Wiki description",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
      //    console.log(wiki);
          this.wiki = wiki;
          done();
          })
        })
        /*
        .catch((err) => {
          console.log(err);
          done();
      });
      */
    });
  });

  describe("GET /wikis", () => {

    it("should return a status code of 200 and all wikis", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Public Wikis");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {

    it("should render a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Create a new wiki")
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "history of america",
        body: "description of the history of america",
        userId: 1,
        private: false
      }
    };

    it("should create a new wiki and redirect", (done) => {
      request.post(options, (err, res, body) => {
        Wiki.findOne({where: {title: "history of america"}})
        .then((wiki) => {
          expect(res.statusCode).toBe(303);
          expect(wiki.title).toBe("history of america");
          expect(wiki.body).toBe("description of the history of america");
          expect(wiki.userId).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  })

  describe("GET /wikis/:id", () => {

    it("should render a view of the wiki that the user selects", (done) => {

      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        console.log(this.wiki.title);
        expect(this.wiki.title).toContain("Wiki title");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {

    it ("should delete a wiki with the associated id", (done) =>{
      Wiki.findAll()
      .then((wikis) => {

        const wikiCountBeforeDelete = wikis.length;
        expect(wikiCountBeforeDelete).toBe(1);

        request.post(`${base}${this.wiki.id}/destroy`, (err,res, body) => {
          Wiki.findAll()
          .then((wikis) => {
            expect(err).toBeNull();
            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe("GET /wikis/:id/edit", () => {

    it("should render the edit view with a form to edit the wiki", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Wiki title");
        done();
        });
      });
    });

  describe("POST /wikis/:id/update", () => {

    it("should update the wiki with the given values", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "history of canada",
          body: "description of the history of america",
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Wiki.findOne({
          where: {id: this.wiki.id}
        })
        .then((wiki) => {
          expect(wiki.title).toBe("history of canada");
          done();
        });
      });
    });
  });
//end of describe
});
