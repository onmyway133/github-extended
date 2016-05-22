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
  fetch('https://api.github.com/users/' + username + '/repos?visibility=public&affiliation=owner&per_page=100').then(function (response) {
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

  add(processedRepositories);
}

function add(repositories) {
  var ul = popularRepositoriesElement();
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
    $(li).find('.stars').contents().filter(function (node) {
      return node.nodeType == 3;
    }).each(function (node) {
      node.textContent = node.textContent.replace(repo.stargazers_count);
    });

    // Description
    $(li).find('.repo-description.css-truncate-target').text(repo.description);

    $(ul).append(li);
  });
}

function popularRepositoriesElement() {
  var element = $('.contributions-tab .columns.popular-repos .column.one-half:first-child .boxed-group.flush ul');
  return element;
}