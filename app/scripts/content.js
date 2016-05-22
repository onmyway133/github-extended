'use strict';

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

  addOptions(processedRepositories);
  add(processedRepositories);
}

function add(repositories) {
  var ul = $(popularRepositoriesElement()).find('ul');
  var sample_li = $(ul).find('li:first-child');

  repositories.forEach(function (repo) {
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

    $(ul).append(li);
  });
}

function addOptions(repositories) {
  var options = ['🙂', '😀', '😬'];

  // Create elements
  var div = $('<div />');

  options.forEach(function (value, index) {
    var id = 'extended-option' + index;

    var radio = $('<input />', { id: id }).attr('type', 'radio').attr('name', 'radio');
    var label = $('<label />').attr('for', id).text(options[index]);

    if (index == 0) {
      radio.attr('checked', 'checked');
    }

    $(div).append(radio);
    $(div).append(label);
  });

  // Button Set
  var buttonSet = div.buttonset();
  $(buttonSet).find('label span').css('padding', '1px 10px');
  $(buttonSet).parent().css({ position: 'relative' });
  $(buttonSet).css({ top: 5, right: 3, position: 'absolute' });

  // Box
  var box = popularRepositoriesElement();
  $(box).append(buttonSet);

  // Event
  $(buttonSet).change(function (e) {
    console.log(e);
  });
}

function popularRepositoriesElement() {
  var element = $('.contributions-tab .columns.popular-repos .column.one-half:first-child .boxed-group.flush');
  return element;
}