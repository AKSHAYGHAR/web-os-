async function test() {
  const params = new URLSearchParams();
  params.append('q', 'https://www.youtube.com/watch?v=jNQXAC9IVRw');
  params.append('vt', 'home');

  const res = await fetch("https://yt1s.com/api/ajaxSearch/index", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });
  console.log(await res.text());
}
test();
