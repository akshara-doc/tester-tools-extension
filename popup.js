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
document.getElementById('get-css-selector').addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: chrome.tabs.TAB_ID_NONE },
    function: () => {
      const element = document.activeElement;
      const selector = element.tagName.toLowerCase() +
        (element.id ? `#${element.id}` : '') +
        (element.className ? `.${element.className.replace(/\s+/g, '.')}` : '');
      alert(`CSS Selector: ${selector}`);
    }
  });
});

// XPath Generator
document.getElementById('get-xpath').addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: chrome.tabs.TAB_ID_NONE },
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
});
