const routes = require('express').Router();



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });  
  res.render('home')
});
routes.use('/HotelInformation', require('./HotelInformation'));

routes.use('/EmailTemplate', require('./EmailTemplate'));
routes.use('/NewEmailTemplate', require('./NewEmailTemplate'));
routes.use('/EditEmailTemplate', require('./EditEmailTemplate'));
routes.use('/PreviewEmailTemplate', require('./PreviewEmailTemplate'));

routes.use('/EmailSystem', require('./EmailSystem'));
routes.use('/NewEmailSystem', require('./NewEmailSystem'));
routes.use('/EditEmailSystem', require('./EditEmailSystem'));

routes.use('/SendEmail', require('./SendEmail'));
routes.use('/Report', require('./Report'));
routes.use('/login', require('./login'));

routes.use('/Users', require('./Users'));
routes.use('/NewUsers', require('./NewUsers'));
routes.use('/EditUsers', require('./EditUsers'));
routes.use('/dash', require('./dash'));

module.exports = routes;