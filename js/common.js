/**
 * 공통
 */
(function ($) {
  // template
  $.hmtmpl = function (template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
      var keys = key.split('.'), value = data[keys.shift()]
      $.each(keys, function () {
        value = value[this]
      })
      return (value === null || value === undefined) ? '' : value
    })
  }

  // ajax global setting
  $.ajaxSetup({
    cache: true,
    timeout: 360000,
    dataType: 'json',
    beforeSend: function (jqXHR, settings) {
    },
    complete: function (jqXHR, textStatus) {
    },
    error: function (jqXHR, textStatus, errorThrown) {

    }
  })
})(jQuery)
