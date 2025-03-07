// Helper function to get the active tab's ID
function getActiveTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        resolve(tabs[0].id);
      } else {
        reject(new Error("No active tab found."));
      }
    });
  });
}

// JSONPath Generator
document.getElementById('get-jsonpath').addEventListener('click', () => {
  const json = prompt('Enter JSON:');
  const element = prompt('Enter element to find:');
  try {
    const jsonObj = JSON.parse(json);
    const paths = jsonpath(jsonObj, `$..[?(@ == ${element})]`);
    document.getElementById('output').innerText = `JSONPath: ${paths.join(', ')}`;
  } catch (error) {
    document.getElementById('output').innerText = 'Invalid JSON or element!';
  }
});

// CSS Selector Generator
document.getElementById('get-css-selector').addEventListener('click', async () => {
  try {
    const tabId = await getActiveTabId();
    chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        const element = document.activeElement;
        const selector = element.tagName.toLowerCase() +
          (element.id ? `#${element.id}` : '') +
          (element.className ? `.${element.className.replace(/\s+/g, '.')}` : '');
        alert(`CSS Selector: ${selector}`);
      }
    });
  } catch (error) {
    console.error(error);
    alert("Failed to get CSS Selector. Please try again.");
  }
});

// XPath Generator
document.getElementById('get-xpath').addEventListener('click', async () => {
  try {
    const tabId = await getActiveTabId();
    chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        const getXPath = (element) => {
          if (element.id) return `//*[@id="${element.id}"]`;
          let path = '';
          for (; element && element.nodeType === 1; element = element.parentNode) {
            let idx = Array.from(element.parentNode.children).indexOf(element) + 1;
            idx > 1 ? (idx = `[${idx}]`) : (idx = '');
            path = `/${element.tagName.toLowerCase()}${idx}${path}`;
          }
          return path;
        };
        const element = document.activeElement;
        alert(`XPath: ${getXPath(element)}`);
      }
    });
  } catch (error) {
    console.error(error);
    alert("Failed to get XPath. Please try again.");
  }
});
