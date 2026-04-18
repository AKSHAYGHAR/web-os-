async function testSnap() {
  const formData = new URLSearchParams();
  formData.append('url', 'https://www.instagram.com/reel/C5_8QY7xZ2O/');
  formData.append('action', 'post');
  try {
     const res = await fetch("https://snapinsta.app/action.php", {
       method: "POST",
       body: formData.toString(),
       headers: {
         "User-Agent": "Mozilla/5.0",
         "Content-Type": "application/x-www-form-urlencoded"
       }
     });
     console.log(res.status);
     const html = await res.text();
     console.log(html.substring(0, 500));
  } catch(e) {
     console.error(e);
  }
}
testSnap();
