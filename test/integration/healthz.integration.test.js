const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const {createUser} = require('../../controllers/userController.js')


chai.use(chaiHttp);
const {expect} = chai;

//TEST 0
// describe('/healthz endpoint', () => {
//   it('should return status 200 and "OK" for GET request', async() => {
//     const res = await chai.request(app).get('/healthz');
//     expect(res).to.have.status(200);
//     //expect(res.text).to.equal('OK');
    
//     after(function () {
//       process.exit(0); // Use 0 for success, or any other value for failure
//     });
//   });


// });

//TEST 1
describe('Account creation integration test',()=>{

  it('Create an account, and using the GET call, validate account exists', async()=>{
    const reqBody = {
      firstName: "Test",
      lastName: 'One',
      password: 'password',
      email: 'test@example.com'
    };
    console.log('trying to post')
    try{
      const createAccount = await chai.request(app)
      .post('/v1/user')
      .send(reqBody);
      console.log('after post')
      //console.log(createAccount);
      expect(createAccount).to.have.status('201');
  
    }catch(error){
      console.log(error);
    }
   
    const getAccount = await chai.request(app)
    .get('/v1/user/self')
    .set('Authorization',`Basic ${Buffer.from(`${reqBody.email}:${reqBody.password}`).toString('base64')}`);

    expect(getAccount).to.have.status(200);
    expect(getAccount.body).to.have.property('id');
    expect(getAccount.body.email).to.equal(reqBody.email);
    
  });
    after(function () {
      process.exit(0); // Use 0 for success, or any other value for failure
    });
});

//TEST 2
describe('Account updation integration test',()=>{
  
  it('Update the account and using the GET call, validate the account was updated', async()=>{

    const info = {
      firstName: 'NewFirstName',
      lastName: 'NewLastName',
      password: 'newPassword',
      email: 'test@example.com'
    };
    const oldPwd = 'password'
    const updated = {
      firstName: info.firstName,
      lastName: info.lastName,
      password: info.password
    };
    const authToken = Buffer.from(`${info.email}:${oldPwd}`).toString('base64');
    console.log('')

    console.log('trying to put');
    try{
    const updateAccount = await chai.request(app)
    .put('/v1/user/self')
    .set('Authorization', `Basic ${Buffer.from(`${info.email}:${oldPwd}`).toString('base64')}`)
    .send(info);

    expect(updateAccount).to.have.status(204);
    }catch(error){
      console.log(error); 
    }
    const getAccount = await chai.request(app)
    .get('/v1/user/self')
    .set('Authorization',`Basic ${Buffer.from(`${info.email}:${updated.password}`).toString('base64')}`);

    expect(getAccount).to.have.status(200);
    expect(getAccount.body).to.have.property('id');
    expect(getAccount.body.email).to.equal(info.email);

  });
    after(function () {
      process.exit(0); // Use 0 for success, or any other value for failure
    });
})
