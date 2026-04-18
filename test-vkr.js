async function test() {
  try {
     const res = await fetch("https://api.vkrdownloader.vercel.app/server?vkr=https://www.youtube.com/watch?v=jNQXAC9IVRw");
     const data = await res.json();
     console.log(data);
  } catch(e) { console.log(e); }
}
test();
