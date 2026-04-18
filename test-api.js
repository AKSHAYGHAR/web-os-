async function check() {
  try {
    const res = await fetch('http://localhost:5173/api/download?url=' + encodeURIComponent("https://www.youtube.com/watch?v=jNQXAC9IVRw") + '&type=audio');
    console.log(res.status);
    console.log(res.headers.get("content-disposition"));
  } catch(e) {
    console.log("error", e.message);
  }
}
check();
