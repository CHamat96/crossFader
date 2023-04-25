export const getHashParams = () => {
  return window.location.hash
  .substring(1)
  .split('&')
  .reduce((initial, item) => {
    if (item) {
      let parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1])
    }
    return initial
  }, {})
}

export const removeHashParams = () => {
  window.history.pushState('', document.title, window.location.pathname + window.location.search)
}