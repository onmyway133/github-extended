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
    process(username, json)
  })
}

function process(username, repositories) {
  const processedRepositories =
  repositories
  .filter((repo) => {
    return repo.private == false && repo.fork == false
  }).sort((repo1, repo2) => {
    return repo1.stargazers_count < repo2.stargazers_count
  })

  console.log(processedRepositories)
}
