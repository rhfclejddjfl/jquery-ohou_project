function List () {
  this.val = {
    page: 1,
    scrapList: JSON.parse(window.localStorage.getItem('scrap')) || []
  }
  this.temp = {
    list: '<li><div class="card"><div class="profile_wrapper"><img src="{profile_image_url}" class="profile_img"/><strong>{nickname}</strong></div><div class="thumbnail_wrapper"><img src="{image_url}" class="thumbnail_img" alt="{id} 이미지"><img src="{scrapIcon}" scrapTag="{scrapTag}" name="btnScrap" data-key="{id}" class="scrap_icon"/></div></div></li>'
  }
}

List.prototype.setValue = function () {
  $list.getList($list.val.page)
}

List.prototype.setEvent = function () {
  $('#btnScrapView').on('click', function () {
    $(this).toggleClass('active')

    var list = []
    if ($(this).hasClass('active')) {
      $.each($list.val.scrapList, function (i, v) {
        v['scrapIcon'] = './img/blue@2x.png'
        list.push($.hmtmpl($list.temp.list, v))
      })
      $(window).unbind('scroll')
      $('#list').empty().append(list.join(''))
    } else {
      $list.getList(1)
      $list.setEvent()
    }
  })

  $(document).on('click', '[name=btnScrap]', function () {
    if (typeof localStorage === 'undefined') {
      alert('죄송합니다 스크랩을 지원하지 않는 브라우져입니다.')
    } else {
      var scrap = {
        id: $(this).data('key'),
        image_url: $(this).parents('li').find('.thumbnail_img').attr('src'),
        nickname: $(this).parents('li').find('strong').text(),
        profile_image_url: $(this).parents('li').find('.profile_img').attr('src')
      }

      // 중복제거 후 새로운 객체이면 추가
      var result = $list.val.scrapList.filter(scraps => (scraps.id !== scrap.id))

      if (result.length === $list.val.scrapList.length) {
        $(this).attr('src', './img/blue@2x.png')
        $list.val.scrapList.push(scrap)
      } else {
        $(this).attr('src', './img/on-img@2x.png')
        $list.val.scrapList = result
      }

      window.localStorage.setItem('scrap', JSON.stringify($list.val.scrapList))
    }
  })

  $(window).on('scroll', function () {
    var scrollHeight = $(document).height()
    var scrollPosition = $(window).height() + $(window).scrollTop()

    if (scrollPosition > scrollHeight - 500) {
      $list.val.page += 1

      $list.getList($list.val.page)
    }
  })
}

$(function () {
  $list = new List()
  $list.setEvent()
  $list.setValue()
})

//
List.prototype.getList = function (page) {
  $.ajax({
    url: 'https://s3.ap-northeast-2.amazonaws.com/bucketplace-coding-test/cards/page_' + page + '.json',
    type: 'GET',
    async: false, // 더블클릭 방지
    dataType: 'json',
    success: function (rs, status) {
      if (!rs.length) {
        $(window).unbind('scroll')
      } else {
        var list = []
        $.each(rs, function (i, v) {
          v['scrapIcon'] = !$list.val.scrapList.every(scraps => { return scraps.id !== v.id }) ? './img/blue@2x.png' : './img/on-img@2x.png'
          list.push($.hmtmpl($list.temp.list, v))
        })

        if (page === 1) {
          $('#list').empty()
        }

        $('#list').append(list.join(''))
      }
    }
  })
}
