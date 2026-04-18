async function testIG() {
   try {
      // Trying an alternative free instagram API
      const res = await fetch("https://instasupersave.com/api/ig/post", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
         },
         body: JSON.stringify({ url: "https://www.instagram.com/reel/C5_8QY7xZ2O/" })
      });
      console.log(res.status);
      console.log(await res.text());
   } catch(e) {
      console.log("Error", e.message);
   }
}
testIG();
