const checkLogin = (req, res, next) => {
    if (req.session.username === undefined) {
        res.locals.isLoggedIn = false;
        res.redirect('/');
    } else {
        res.locals.username = req.session.username;
        res.locals.role = 'SuperAdmin';
        res.locals.isLoggedIn = true;
        next();
    }
}

const isLogin = (req, res, next) => {
    if (req.session.username === undefined) {
        res.locals.isLoggedIn = false;
        next();

    } else {
        res.locals.username = req.session.username;
        res.locals.role = 'SuperAdmin';
        res.locals.isLoggedIn = true;
        res.redirect('/dashboard');

    }
}


module.exports = {
    checkLogin,
    isLogin
};