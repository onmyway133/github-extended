jest.dontMock('../sprint.js');

describe('add', function() {
  it('should add elements of a selector', function() {
    var $ = require('../sprint.js');
    document.body.innerHTML =
      '<div id="a">A</div>' +
      '<div id="b">B</div>';

    expect($('#a').html()).toEqual('A');
    expect($('#b').html()).toEqual('B');

    $('#a').add('#b').html("C");

    expect($('#a').html()).toEqual('C');
    expect($('#b').html()).toEqual('C');
  });

  it('should join Sprint instances', function() {
    var $ = require('../sprint.js');
    document.body.innerHTML =
      '<div id="a">A</div>' +
      '<div id="b">B</div>';

    expect($('#a').html()).toEqual('A');
    expect($('#b').html()).toEqual('B');

    $('#a').add($('#b')).html('C');

    expect($('#a').html()).toEqual('C');
    expect($('#b').html()).toEqual('C');
  });
});
