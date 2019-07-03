(function() {
  const urlMatch = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;

  function checkURL(longLink) {

    let errorText = '';

    if (!longLink) {
      errorText = '请输入需要转换的长链接！';
    } else if (!urlMatch.test(longLink)) {
      errorText = '请输入正确的网址！';
    }
    $('.error-tip').text(errorText);
    return errorText === '';
  }

  $('.btn-generate').on('click', function() {
    const $longLink = $('.long-link');
    const link = $longLink.val();

    if (!checkURL(link)) {
      $longLink.focus();
      return false;
    }

    $.post('/shortLink/generate', { longLink: link }, function(result) {
      let shortLink = '';
      const { status, data, message } = result;
      if (status === 0 || status === 1001) {
        shortLink = data.prefixLink + (data.prefixLink.slice(-1) === '/' ? '' : '/') + data.shortLink;
      } else {
        shortLink = message;
      }
      console.log(shortLink);
      $('.result').text(shortLink);
      $('.result-box').show();
    });
  });
})();
