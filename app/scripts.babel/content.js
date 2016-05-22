'use strict';

document.addEventListener('DOMContentLoaded', function () {
  check(location)
});

function check(location) {
  const parts = location.pathname.split('/')
  if (parts.length == 2) {
    const username = parts[1]
    fetchRepositories(username)
  }
}

function fetchRepositories(username) {
  fetch('https://api.github.com/users/' + username + '/repos?visibility=public&affiliation=owner&per_page=100')
  .then((response) => {
    return response.json()
  }).then((json) => {
    process(json)
  })
}

function process(repositories) {
  const processedRepositories =
  repositories
  .filter((repo) => {
    return repo.private == false && repo.fork == false
  }).sort((repo1, repo2) => {
    return (repo1.stargazers_count < repo2.stargazers_count) ? 1 : -1
  })

  add(processedRepositories)
}

function add(repositories) {
  const ul = popularRepositoriesElement()
  const sample_li = $(ul).find('li:first-child')

  repositories.forEach((repo) => {
    const li = sample_li.clone()

    // URL
    $(li).find('a').attr('href', repo.html_url)

    // Name
    const name = $(li).find('.repo-and-owner.css-truncate-target .repo')
    $(name).attr('title', repo.name)
    $(name).text(repo.name)

    // Star
    console.log($(li).find('.stars').contents().first())
    $(li).find('.stars').get(0).text(repo.stargazers_count)

    // Description
    $(li).find('.repo-description.css-truncate-target').text(repo.description)

    $(ul).append(li)
  })
}

function popularRepositoriesElement() {
  const element = $('.contributions-tab .columns.popular-repos .column.one-half:first-child .boxed-group.flush ul')
  return element
}
