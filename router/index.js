var express = require('express');
var router = express.Router();




/* GET home page. */

// router.get('/home', function(req, res) {
//   if (req.isAuthenticated()) {
//     res.render('templates/home', { username: req.username });
//   } else {
//     res.render('templates/home');
//   }
// });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


router.get('/home', function(req, res, next) {
  res.render('templates/home',  { username: req.user ? req.user.username : null });
});


  
// router.get('/sign', function(req, res, next) {
//   res.render('templates/home', { title: 'Express' });
// });


router.get('/login', function(req, res, next) {
    res.render('templates/login', { title: 'Express' });
  });


  router.get('/register', function(req, res, next) {
    res.render('templates/register', { title: 'Express' });
  });
  

  // router.get('/logout', function (req, res) {
  //     req.logout();
  //     res.redirect('/hom');
  //   });
  

// // GET ALL USERS
// router.get('/users', async function(req, res, next) {
//   const users = await userService.getAll();
//   res.render('users', {users: users});
// });


module.exports = router;