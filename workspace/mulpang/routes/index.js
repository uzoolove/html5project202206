var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today.html');
});

router.get('/:page.html', function(req, res, next) {
  // /today.html -> today.ejs
  res.render(req.params.page, { title: 'Mulpang' });
});


module.exports = router;
