/**
 * Created by LiuJ on 2016/1/6.
 */
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        var user = {
            username:"admin",
            password:"pass"
        };
        if(user.username === username && user.password == password) {
            return done(null, user);
        } else {
            return done(null, false, { message: '登录失败.' });
        }
    }
));
passport.serializeUser(function (user, done) {//保存user对象到req
    done(null, user);//可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) {//删除user对象到req
    done(null, user);//可以通过数据库方式操作
});
module.exports = function(app){
    app.post('/login',
        passport.authenticate('local', { successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true })
    );
    app.get("/login", function (req, res, next) {
        res.render("index", {info:"请重新登录！！"});
    } );
};