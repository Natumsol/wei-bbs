/**
 * Created by LiuJ on 2016/1/6.
 */
var LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(
    function (username, password, done) {
        var user = {
            id: '1',
            username: 'admin',
            password: 'pass'
        }; // ��������ͨ�����ݿⷽʽ��ȡ��½�˺�

        if (username !== user.username) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (password !== user.password) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {//����user����
    done(null, user);//����ͨ�����ݿⷽʽ����
});

passport.deserializeUser(function (user, done) {//ɾ��user����
    done(null, user);//����ͨ�����ݿⷽʽ����
});

app.get('/', routes.index);
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/users',
        failureRedirect: '/'
    }));

app.all('/users', isLoggedIn);
app.get('/users', user.list);
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}