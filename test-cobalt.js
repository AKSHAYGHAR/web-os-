async function testCobalt() {
  try {
     const res = await fetch("https://api.cobalt.tools/api/json", {
        method: "POST",
        headers: {
           "Accept": "application/json",
           "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
          vQuality: "1080",
          vCodec: "h264",
          filenamePattern: "basic"
        })
     });
     console.log(res.status);
     console.log(await res.text());
  } catch(e) {
     console.log("Error:", e.message);
  }
}
testCobalt();
