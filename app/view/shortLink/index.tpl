<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>短网址生成工具-Short Link Generation</title>
    <link rel="stylesheet" href="/public/css/common/reset.css"/>
    <link rel="stylesheet" href="/public/css/shortLink/index.css"/>
</head>
<body>
    <header>
        <h1>短网址生成工具</h1>
    </header>
    <div class="main-content">
        <h2>请输入需要缩短的网址：</h2>
        <input class="long-link" type="url" >
        <p class="error-tip"></p>
        <button class="btn-generate" title="点击生成短链接">生成</button>

        <div class="result-box">
            <p>生成的短网址为：</p>
            <p class="result"></p>
        </div>
    </div>

    <dl>
        <dt>使用说明：</dt>
        <dd>1、输入正确的长连接后，点击"生成"按钮，即可生成短链接</dd>
        <dd>2、本站生成的短链接长期有效</dd>
    </dl>
    <script src="http://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="/public/js/shortLink/index.js"></script>
</body>
</html>