let cards = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setCards") {
    cards = message.cards;
  }

  if (message.type === "getCards") {
    sendResponse({ cards });
  }
});
