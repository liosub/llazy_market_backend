const expressJwt= require('express-jwt');

function authJwt(){
    const secret = process.env.JWT_SECRET;
    const api= process.env.API_URL;
    return expressJwt({
        secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
        {url:/\/api\/v3\/categories(.*)/,methods:['GET','OPTIONS']},
        {url:/\/api\/v3\/products(.*)/,methods:['GET','OPTIONS','PUT']},
        {url:/\/api\/v3\/products\/search(.*)/,methods:['GET','POST','OPTIONS']},
        {url:/\/api\/v3\/braintree(.*)/,methods:['GET','OPTIONS']},
        {url:/\/api\/v3\/order(.*)/,methods:['GET','POST','OPTIONS']},
        `${api}/signin`,
        `${api}/signup`, 
        `${api}/signout`
        ]
    })

}

async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null, true)
    }

done()
}

module.exports=authJwt