const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const db = require('../../models/databaseModel.js');
const User = db.users;

let testFailed = false;
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
describe('Account creation and updation integration test',()=>{

  it('Create an account, and using the GET call, validate account exists', async()=>{
    const reqBody = {
      firstName: "123",
      lastName: 'One',
      password: 'password',
      email: 'test20@example.com',

    };
    console.log('trying to post')
    try{
      const createAccount = await chai.request(app)
      .post('/v5/user')
      .send(reqBody);
      console.log('after post')
      //console.log(createAccount);
      expect(createAccount).to.have.status('201');
      //verificationToken = createAccount.body.info.token;

      console.log(createAccount.body);
      // expect(verificationToken).to.exist;


    }catch(error){
      console.log(error);
    }

    const currUser = await User.findOne({where:{"email":reqBody.email}});
    const verifyToken = currUser.token;

    console.log('token=',verifyToken);

    const verifyEmailRes = await chai.request(app)
    .get(`/v5/user/verify?token=${verifyToken}`);

    expect(verifyEmailRes).to.have.status(200);

    console.log('verification successful');
    const getAccount = await chai.request(app)
    .get('/v5/user/self')
    .set('Authorization',`Basic ${Buffer.from(`${reqBody.email}:${reqBody.password}`).toString('base64')}`);

    expect(getAccount).to.have.status(200);
    expect(getAccount.body).to.have.property('id');
    expect(getAccount.body.email).to.equal(reqBody.email);

    console.log("before post"+testFailed);

    console.log("aft post"+testFailed);

  });
   
  
  it('Update the account and using the GET call, validate the account was updated', async()=>{

    const info = {
      firstName: 'NewFirstName',
      lastName: 'NewLastName',
      password: 'newPassword',

      email: 'test20@example.com'

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
    .put('/v5/user/self')
    .set('Authorization', `Basic ${Buffer.from(`${info.email}:${oldPwd}`).toString('base64')}`)
    .send(info);

    expect(updateAccount).to.have.status(204);
    // if(!expect(getAccount).to.have.status(204)){
    //   testFailed = true;
    // }
    }catch(error){
      console.log(error); 
    }
    const getAccount = await chai.request(app)
    .get('/v5/user/self')
    .set('Authorization',`Basic ${Buffer.from(`${info.email}:${updated.password}`).toString('base64')}`);

    expect(getAccount).to.have.status(200);
    expect(getAccount.body).to.have.property('id');
    expect(getAccount.body.email).to.equal(info.email);

    console.log("before put"+testFailed);
    // if(!expect(getAccount).to.have.status(200)){
    //   testFailed = true;
    // }
    console.log("aft put"+testFailed);

  });
    
});
