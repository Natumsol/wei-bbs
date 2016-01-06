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
            return done(null, false, { message: '��¼ʧ��.' });
        }
    }
));
passport.serializeUser(function (user, done) {//����user����req
    done(null, user);//����ͨ�����ݿⷽʽ����
});

passport.deserializeUser(function (user, done) {//ɾ��user����req
    done(null, user);//����ͨ�����ݿⷽʽ����
});
module.exports = function(app){
    app.post('/login',
        passport.authenticate('local', { successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true })
    );
    app.get("/login", function (req, res, next) {
        res.render("index", {info:"�����µ�¼����"});
    } );
};