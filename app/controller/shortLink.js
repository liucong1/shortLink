'use strict';

const Controller = require('egg').Controller;

class ShortLinkController extends Controller {

  async index() {
    const { ctx } = this;

    await ctx.render('shortLink/index.tpl');
  }

  async generate() {
    const { ctx } = this;

    const { longLink } = ctx.request.body;

    const result = await ctx.service.shortLink.generate(longLink);

    if (result.data) result.data.prefixLink = ctx.app.config.shortLinkPrefix;

    return ctx.body = result;
  }

  async redirect() {

    const { ctx } = this;

    const shortLink = ctx.params.shortLink;

    const result = await ctx.service.shortLink.queryLink(shortLink);

    if (result.status === 0) {
      return ctx.redirect( result.data.longLink );
    }

    ctx.status = 404;
  }
}

module.exports = ShortLinkController;
