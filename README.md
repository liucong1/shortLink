# 短网址生成

> 本项目基于 `egg.js` 开发，使用 `mysql` 存储长网址、短网址之间的映射关系。同时为了提高短网址的打开效率，使用 `redis` 将短网址对应的长网址进行存储。

## 使用说明

demo页面参考：[短网址生成](http://www.ecool.fun/shortLink)

## 环境依赖

本项目依赖 [mysql](https://liucong1.github.io/2019/07/03/centos-mysql.html) 、 [redis](https://liucong1.github.io/2019/07/03/centos-redis.html) 、Node.js@10+ 、yarn 。

## 配置项

所有配置项都在 config 文件夹中，本地开发使用 `config.local.js` 文件，线上使用 `config.prod.js` 文件。

配置项说明：

* config.redis : redis 连接配置，具体配置方式见 [egg-redis](https://www.npmjs.com/package/egg-redis)

* config.mysql : mysql 链接配置，具体配置方式见 [egg-mysql](https://www.npmjs.com/package/egg-mysql)

* config.shortLinkPrefix : 生成的短网址域名（PS.目前短网址的path是以 /s 前缀开头，如果修改该前缀，请修改 `app/router.js` 中的短网址解析规则，否则会造成短网址无法跳转到对应的页面）

### 建数据表

执行以下命令建数据表：
```
DROP TABLE IF EXISTS `short_link`;
CREATE TABLE `short_link` (
  `longLink` char(255) NOT NULL COMMENT '原始链接',
  `shortLink` char(50) NOT NULL COMMENT '短链接',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`longLink`,`shortLink`),
  UNIQUE KEY `shortLink` (`shortLink`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
如果使用了其他数据表名，需要在 `app/service/shortLink.js` 中修改用于存储、查询的数据表名。

### 运行代码

在修改完配置项后，需要在项目根目录下执行 `yarn` ，安装依赖项。

然后执行以下命令启动服务：

```bash
$ npm run dev
```

在浏览器中打开：http://localhost:7001/shortLink 即可访问