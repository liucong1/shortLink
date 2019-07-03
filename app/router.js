'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  router.get('/shortLink', controller.shortLink.index);

  router.post('/shortLink/generate', controller.shortLink.generate);

  router.get('/s/:shortLink', controller.shortLink.redirect);
};
