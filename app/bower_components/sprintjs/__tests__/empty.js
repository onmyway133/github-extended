jest.dontMock("../sprint");

describe('empty', function() {
  it('empties an element with just text inside', function() {
    document.body.innerHTML = '<span id="example">test</span>';
    var $ = require("../sprint.js");

    expect($('#example').html()).toEqual('test');

    $('#example').empty();

    expect($('#example').html()).toEqual('');
  });

  it('empties an element of child elements', function() {
    document.body.innerHTML =
      '<span id="example">' +
      '<h1>test</h1>' +
      '</span>';
    var $ = require("../sprint.js");

    expect($('#example').html()).toEqual('<h1>test</h1>');

    $('#example').empty();

    expect($('#example').html()).toEqual('');
  });
});
