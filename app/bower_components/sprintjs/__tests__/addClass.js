jest.dontMock('../sprint.js');

describe('addClass', function() {
  it('correctly adds classnames', function() {
    var $ = require('../sprint.js');
    document.body.innerHTML = '<div id="a"></div>';

    $('#a').addClass('first');
    expect($('#a').get(0).className).toEqual('first');

    $('#a').addClass('second third');
    expect($('#a').get(0).className).toEqual('first second third');
  });
});
