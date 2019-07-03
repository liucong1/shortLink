const Service = require('egg').Service;

const SHORT_LINK_TABLE = 'short_link';

const SHORT_LINK_PREFIX = 'node:egg:shortlink';

// 默认存一年
const EXP_TIME = 365 * 24 * 60 * 60;

class ShortLinkService extends Service {

  // 生成短链接
  async generate(longLink) {

    if (!longLink) {
      return {
        status: -1,
        message: '参数错误',
      };
    }

    // 查询数据库中是否存在该链接，如果存在，就直接返回
    const searchResult = await this.searchByLinkInMySQL(longLink, 'longLink');

    if (searchResult && searchResult.length > 0) {
      return {
        status: 1001,
        message: '短链接已存在',
        data: searchResult[0],
      };
    }

    // 随机生成短链，并存入数据库和redis
    const shortLink = await this.generateShortLink();
    const storeResult = await this.storeShortLink({
      longLink,
      shortLink,
    });

    if (storeResult) {
      return {
        status: 0,
        message: '短链接已生成',
        data: {
          shortLink,
          longLink,
        },
      };
    }

    return {
      status: -1,
      message: '短链接生成失败，请联系网站开发人员解决或稍后重试',
    };

  }

  // 查询短链接
  async queryLink(shortLink) {

    const {ctx} = this;

    if (!shortLink || shortLink.length !== 6) {
      return {
        status: -1,
        message: '缺少参数或参数错误',
      };
    }

    try {
      // 先查redis
      const redisValue = await ctx.app.redis.get(`${PERMA_LINK_PREFIX}:${shortLink}`);

      if (redisValue) {
        return {
          status: 0,
          message: 'success',
          data: {
            longLink: redisValue,
          },
        };
      }
    } catch (err) {
      console.error(err);
    }

    // redis中没有就去查数据库
    const searchResult = await this.searchByLinkInMySQL(shortLink, 'shortLink');

    if (searchResult && searchResult.length > 0) {

      const longLink = searchResult[0].longLink;

      // 查询数据库后，需要同步写入redis
      await this.storeIntoRedis(shortLink, longLink);

      return {
        status: 0,
        message: 'success',
        data: {
          longLink,
        },
      };
    }
    return {
      status: -1,
      message: '短链不存在',
    };

  }

  // 获取唯一的Link
  async getShortLink() {
    const shortLink = this.generateShortLink();

    // 查询数据库中是否存在该链接，如果存在，就直接返回
    const searchResult = await this.searchByLinkInMySQL(shortLink, 'shortLink');

    if (searchResult && searchResult.length > 0) {
      // 如果permaLink已经存在，就遍历重新生成
      return this.getShortLink();
    }
    return shortLink;

  }

  // 生成随机的Link
  generateShortLink() {
    let str = '';
    const arr = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    ];

    for (let i = 0; i < 6; i++) {
      const pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  }

  // 查询链接是否已存在数据库中
  async searchByLinkInMySQL(link, type) {

    const { app } = this;

    let where = { longLink: link };

    if (type === 'shortLink') {
      where = { shortLink: link };
    }

    let row = null;
    try {
      row = await app.mysql.select(SHORT_LINK_TABLE, {where});
    } catch (err) {
      row = null;
    }
    return row;
  }

  async storeShortLink(params) {

    const { app } = this;
    const { longLink, shortLink } = params;

    let isSuccess = false;

    // 存数据库
    try {

      const result = await app.mysql.insert(SHORT_LINK_TABLE, params);
      if (result.affectedRows === 1) {
        isSuccess = true;
      }
    } catch (err) {
      console.error(err);
    }

    // 存redis
    if (isSuccess) {
      const redisSetResult = await this.storeIntoRedis(shortLink, longLink);
      isSuccess = redisSetResult === 'OK';
    }

    return isSuccess;
  }

  // 将长链、短链的映射关系存入redis，方便查询
  async storeIntoRedis(shortLink, longLink) {
    return await this.app.redis.set(`${SHORT_LINK_PREFIX}:${shortLink}`, longLink, 'EX', EXP_TIME, 'NX');
  }
}

module.exports = ShortLinkService;
