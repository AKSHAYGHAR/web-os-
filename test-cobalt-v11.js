async function testCobaltV11() {
  try {
     const res = await fetch("https://api.cobalt.tools/", {
        method: "POST",
        headers: {
           "Accept": "application/json",
           "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: "https://www.youtube.com/watch?v=jNQXAC9IVRw"
        })
     });
     console.log(res.status);
     console.log(await res.text());
  } catch(e) {
     console.log(e.message);
  }
}
testCobaltV11();
