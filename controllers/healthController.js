const db = require('../models/databaseModel.js');
const contentType = require('content-type');

const healthCheck = async (req, res) => {
    const health = await db.dbConnectionCheck();
    res.setHeader('Cache-Control','no-cache, no-store, must-revalidate');
    if (req.method != 'GET') {
        res.status(405).send('');
    }else{
        console.log(req.url);
        if (req.url != '/healthz') {
            res.status(404).send('');
        }else{
            const reqContentType = req.headers['content-type'];
            if (Object.keys(req.body).length > 0 || reqContentType === 'text/html' || reqContentType === 'text/plain' || reqContentType === 'application/xml' || reqContentType === 'application/javascript') {
                // if(reqContentType === 'application/json' || reqContentType === 'text/plain' || reqContentType === 'text/plain'){
                    console.log(Object.keys(req.body).length)       
                    console.log(reqContentType)
                    console.log(contentType.parse(reqContentType).type)
                
                    res.status(400).send('');
            //    return;
            }
            else{
                if(health.status==200){
                    res.status(200).send('');
                }else{
                    if(health.status==503){
                        res.status(503).send('')
                    }else{
                        res.status(400).send('')
                    } 
                }
            }
          
           }   
        }
};

module.exports = {
  healthCheck,
};
