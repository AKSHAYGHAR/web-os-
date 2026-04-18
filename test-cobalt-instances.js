async function checkCobalt(url) {
  try {
      const res = await fetch(url, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' })
      });
      console.log(url, res.status);
      const text = await res.text();
      console.log(text.slice(0, 100));
  } catch (e) {
      console.log(url, 'FAILED');
  }
}
const urls = [
    'https://api.cobalt.tools/',
    'https://co.wuk.sh/api/json',
    'https://cobalt-api.kwiatekm.me/',
    'https://api.cobalt.kwiatekm.me/',
    'https://api.cobalt.tools/api/json'
];
urls.forEach(checkCobalt);
