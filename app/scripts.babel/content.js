'use strict';

function Option(title, value) {
    this.title = title;
    this.value = value
}

const options = [
    new Option('🙂', 5),
    new Option('😀', 10),
    new Option('😬', 15)
];

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
  fetch('https://api.github.com/users/' + username + '/repos?visibility=public&affiliation=owner&sort=updated&per_page=100')
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

  addOptions(processedRepositories)
  add(processedRepositories)
}

function add(repositories) {
  const ul = $(popularRepositoriesElement()).find('ul')
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
    const starIcon = $(li).find('.stars svg')
    $(li).find('.stars').text(repo.stargazers_count + ' ').append(starIcon)

    // Description
    $(li).find('.repo-description.css-truncate-target').text(repo.description)

    $(ul).append(li)
  })
}

function addOptions(repositories) {
  // Create elements
  const div = $('<div />')

  options.forEach((value, index) => {
    const id = 'extended-option' + index

    const radio = $('<input />', {id: id}).attr('type', 'radio').attr('name', 'radio')
    const label = $('<label />').attr('for', id).text(options[index].title)

    if (index == 0) {
      radio.attr('checked', 'checked')
    }

    $(div).append(radio)
    $(div).append(label)
  })

  // Button Set
  const buttonSet = div.buttonset()
  $(buttonSet).find('label span').css('padding', '1px 10px')
  $(buttonSet).parent().css({position: 'relative'});
  $(buttonSet).css({top: 5, right: 3, position: 'absolute'});

  // Box
  const box = popularRepositoriesElement()
  $(box).append(buttonSet)

  // Event
  $(buttonSet).change((e) => {
    console.log(e)
  })
}

function popularRepositoriesElement() {
  const element = $('.contributions-tab .columns.popular-repos .column.one-half:first-child .boxed-group.flush')
  return element
}
