'use strict';

function Option(title, value) {
  this.title = title;
  this.value = value;
}

var options = [new Option('🙂', 5), new Option('😀', 10), new Option('😬', 15)];

document.addEventListener('DOMContentLoaded', function () {
  check(location);
});

function check(location) {
  var parts = location.pathname.split('/');
  if (parts.length == 2) {
    var username = parts[1];
    fetchRepositories(username);
  }
}

function fetchRepositories(username) {
  fetch('https://api.github.com/users/' + username + '/repos?visibility=public&affiliation=owner&sort=updated&per_page=100').then(function (response) {
    return response.json();
  }).then(function (json) {
    process(json);
  });
}

function process(repositories) {
  var processedRepositories = repositories.filter(function (repo) {
    return repo.private == false && repo.fork == false;
  }).sort(function (repo1, repo2) {
    return repo1.stargazers_count < repo2.stargazers_count ? 1 : -1;
  });

  showOptions(processedRepositories);
}

function showOptions(repositories) {
  var buttonSet = makeButtonSet(options);

  // Box
  var box = popularRepositoriesElement();
  $(box).append(buttonSet);

  // Event
  var ul = popularRepositoriesElement().find('ul');
  var defaultItems = ul.find('li');

  $(buttonSet).change(function (e) {
    handle(e.target.value, repositories, defaultItems);
  });
}

function handle(optionValue, repositories, defaultItems) {
  var ul = popularRepositoriesElement().find('ul');
  var defaultValue = options[0].value;

  if (optionValue == defaultValue) {
    $(ul).empty().append($(defaultItems));
  } else {
    var items = makeItems(repositories, defaultValue, optionValue);
    $(ul).empty().append($(defaultItems)).append($(items));
  }
}

function makeItems(repositories, from, to) {
  var ul = $(popularRepositoriesElement()).find('ul');
  var sample_li = $(ul).find('li:first-child');

  return repositories.slice(from, to).map(function (repo) {
    var li = sample_li.clone();

    // URL
    $(li).find('a').attr('href', repo.html_url);

    // Name
    var name = $(li).find('.repo-and-owner.css-truncate-target .repo');
    $(name).attr('title', repo.name);
    $(name).text(repo.name);

    // Star
    var starIcon = $(li).find('.stars svg');
    $(li).find('.stars').text(repo.stargazers_count + ' ').append(starIcon);

    // Description
    $(li).find('.repo-description.css-truncate-target').text(repo.description);

    return $(li).get(0);
  });
}

function makeButtonSet(options) {
  // Create elements
  var div = $('<div />');

  options.forEach(function (value, index) {
    var id = 'extended-option' + index;

    var radio = $('<input />', { id: id }).attr('type', 'radio').attr('name', 'radio').attr('value', options[index].value);
    var label = $('<label />').attr('for', id).text(options[index].title).css('font-size', 17);

    if (index == 0) {
      radio.attr('checked', 'checked');
    }

    $(div).append(radio);
    $(div).append(label);
  });

  // Button Set
  var buttonSet = div.buttonset();
  $(buttonSet).find('label span').css('padding', '0px 10px');
  $(buttonSet).parent().css({ position: 'relative' });
  $(buttonSet).css({ top: 5, right: 3, position: 'absolute' });

  return buttonSet;
}

function popularRepositoriesElement() {
  var element = $('.contributions-tab .columns.popular-repos .column.one-half:first-child .boxed-group.flush');
  return element;
}