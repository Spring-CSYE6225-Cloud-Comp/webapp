const assert = require('chai').assert;
const { exec } = require('child_process');
 
describe('Syntax Validation', () => {
 
  it('should not have any syntax errors', (done) => {
    exec('node -c app.js', (error, stdout, stderr) => {
      if(error){
        console.error(stderr);
        assert.fail('JavaScript syntax error found');  
      }
      console.log(stdout);
      assert.isOk(stdout.includes(''));
      done();  
    });
  })
 
});