'use strict';

function Option(title, value) {
    this.title = title
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

  showOptions(processedRepositories)
}

function showOptions(repositories) {
  const buttonSet = makeButtonSet(options)

  // Box
  const box = popularRepositoriesElement()
  $(box).append(buttonSet)

  // Event
  const ul = popularRepositoriesElement().find('ul')
  const defaultItems = ul.find('li')

  $(buttonSet).change((e) => {
    handle(e.target.value, repositories, defaultItems)
  })
}

function handle(optionValue, repositories, defaultItems) {
  const ul = popularRepositoriesElement().find('ol')
  const defaultValue = options[0].value

  if (optionValue == defaultValue) {
    $(ul).empty().append($(defaultItems))
  } else {
    const items = makeItems(repositories, defaultValue, optionValue)
    $(ul).empty().append($(defaultItems)).append($(items))
  }
}

function makeItems(repositories, from, to) {
  const ul = $(popularRepositoriesElement()).find('ol')
  const sample_li = $(ul).find('li:first-child')

  return repositories.slice(from, to).map((repo) => {
    const li = sample_li.clone()

    // URL
    $(li).find('a').attr('href', repo.html_url)

    // Name
    const name = $(li).find('.repo.js-repo')
    $(name).attr('title', repo.name)
    $(name).text(repo.name)

    // Star & Language
    const starIcon = $(li).find('svg.octicon-star')
    const languageIcon = $(li).find('span.pinned-repo-language-color')
    languageIcon.css('background-color', github_language_colors[repo.language])

    const starAndLanguage = $(li).find('.mb-0.f6.text-gray')
    starAndLanguage.empty().append(starIcon).append(' ' + repo.stargazers_count)

    if (repo.language) {
      starAndLanguage.append(languageIcon).append(' ' + repo.language)
    }

    // Description
    var desc = repo.description
    desc = desc.replace(/:\w+:/g, function(m) {
      var name = m.replace(':', '').replace(':', '');

      for (var i=0; i<emoji_list.length; i++) {
        if (emoji_list[i].aliases[0] == name) {
          return emoji_list[i].emoji
        }
      }

      return m
    });

    $(li).find('.pinned-repo-desc').text(desc)

    return $(li).get(0)
  })
}

function makeButtonSet(options) {
  // Create elements
  const div = $('<div />')

  options.forEach((value, index) => {
    const id = 'extended-option' + index
    const description = 'Show ' + options[index].value + ' repositories'

    const radio = $('<input />', {id: id}).attr('type', 'radio').attr('name', 'radio').attr('value', options[index].value)
    const label = $('<label />').attr('for', id).text(options[index].title).css('font-size', 17).attr('title', description)

    if (index == 0) {
      radio.attr('checked', 'checked')
    }

    $(div).append(radio)
    $(div).append(label)
  })

  // Button Set
  const buttonSet = div.buttonset()
  $(buttonSet).find('label span').css('padding', '0px 10px')
  $(buttonSet).parent().css({position: 'relative'});
  $(buttonSet).css({top: -5, left: 160, position: 'absolute'});

  return buttonSet
}

function popularRepositoriesElement() {
  const element = $('.js-repo-filter.position-relative .mt-4 .js-pinned-repos-reorder-container')
  return element
}
