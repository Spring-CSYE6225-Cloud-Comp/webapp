const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

chai.use(chaiHttp);
const {expect} = chai;
describe('/healthz endpoint', () => {
  it('should return status 200 and "OK" for GET request', async() => {
    const res = await chai.request(app).get('/healthz');
    expect(res).to.have.status(200);
    expect(res.text).to.equal('OK');
    
    after(function () {
      process.exit(0); // Use 0 for success, or any other value for failure
    });
  });


});