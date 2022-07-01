function requireLogin(req, res, next){
  if(req.session.user){
    next();
  }else{
    if(req.xhr){
      res.json({errors: {message: '로그인이 필요한 서비스입니다.'}});
    }else{
      req.session.backurl = req.originalUrl;
      res.redirect('/users/login');
    }
  }
}
module.exports = requireLogin;