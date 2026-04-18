async function test() {
  try {
    const url = "https://www.youtube.com/watch?v=jNQXAC9IVRw";
    
    // 1. Analyze
    const analyzeUrl = "https://corsproxy.io/?url=" + encodeURIComponent("https://www.y2mate.com/mates/analyzeV2/ajax");
    const formData = new URLSearchParams();
    formData.append('k_query', url);
    formData.append('k_page', 'home');
    formData.append('hl', 'en');
    formData.append('q_auto', '1');

    const resAnalyz = await fetch(analyzeUrl, {
      method: "POST",
      body: formData.toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    const analyzeData = await resAnalyz.json();
    console.log("Analyze:", analyzeData);

    if (analyzeData.links && analyzeData.links.mp4) {
      // get 1080p or 720p
      const videoOpts = Object.values(analyzeData.links.mp4);
      if (videoOpts.length > 0) {
        const bestOpt = videoOpts[0];
        console.log("Best option:", bestOpt);

        // 2. Convert to get direct link
        const convertUrl = "https://corsproxy.io/?url=" + encodeURIComponent("https://www.y2mate.com/mates/convertV2/index");
        const convData = new URLSearchParams();
        convData.append('vid', analyzeData.vid);
        convData.append('k', bestOpt.k);

        const resConv = await fetch(convertUrl, {
           method: "POST",
           body: convData.toString(),
           headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        const convertData = await resConv.json();
        console.log("Convert:", convertData);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
test();
