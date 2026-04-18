async function test() {
  try {
    const url = "https://www.youtube.com/watch?v=jNQXAC9IVRw";
    
    // 1. Analyze
    const analyzeUrl = "https://www.y2mate.com/mates/analyzeV2/ajax";
    const formData = new URLSearchParams();
    formData.append('k_query', url);
    formData.append('k_page', 'home');
    formData.append('hl', 'en');
    formData.append('q_auto', '1');

    const resAnalyz = await fetch(analyzeUrl, {
      method: "POST",
      body: formData.toString(),
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91"
      }
    });
    const analyzeData = await resAnalyz.json();
    console.log("Analyze Vid:", analyzeData.vid);

    if (analyzeData.links && analyzeData.links.mp4) {
      const videoOpts = Object.values(analyzeData.links.mp4);
      if (videoOpts.length > 0) {
        const bestOpt = videoOpts[0]; // usually highest quality
        console.log("Best option key:", bestOpt.k);

        // 2. Convert to get direct link
        const convertUrl = "https://www.y2mate.com/mates/convertV2/index";
        const convData = new URLSearchParams();
        convData.append('vid', analyzeData.vid);
        convData.append('k', bestOpt.k);

        const resConv = await fetch(convertUrl, {
           method: "POST",
           body: convData.toString(),
           headers: { 
             "Content-Type": "application/x-www-form-urlencoded",
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91"
           }
        });
        const convertData = await resConv.json();
        console.log("Convert output direct link:", convertData.dlink);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
test();
