const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const {createUser} = require('../../controllers/userController.js')

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


  // after(function () {
  //   if(testFailed){
  //     process.exit(1);
  //   }
  //   process.exit(0); // Use 0 for success, or any other value for failure
  // });

  it('Create an account, and using the GET call, validate account exists', async()=>{
    const reqBody = {
      firstName: "123",
      lastName: 'One',
      password: 'password',
      email: 'test20@example.com'

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

    console.log("before post"+testFailed);
    // if(!expect(getAccount).to.have.status(200)){
    //   testFailed = true;
    // }
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
    .put('/v1/user/self')
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
    .get('/v1/user/self')
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
//test_comment
