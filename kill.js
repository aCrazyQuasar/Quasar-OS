async function killDOM() {
  try {
    const response = await fetch('/kill.html');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const htmlString = await response.text();
    
    document.open();
    document.write(htmlString);
    document.close();
  } catch (error) {
    console.error('Error loading HTML:', error);
  }
}
killDOM();