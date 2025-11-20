const targetUrl = "https://canvas.ftn.uns.ac.rs/";

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length === 0) return;
  const currentTab = tabs[0];
  const currentTabId = currentTab.id;
  const currentTabUrl = currentTab.url;

  if (currentTabUrl !== targetUrl) {
    // The FTN Canvas isn't the current tab...
    alert("Potrebno je otvoriti Canvas prije otvaranja ekstenzije.");
    return;
  }

  // Sends a request to the background service worker and
  // waits for the response.
  chrome.runtime.sendMessage({ type: "getCards" }, (response) => {
    if (response.cards) {
      const cards = response.cards;
      const list = document.createElement("ul");

      // Draws the title and checkbox for each
      // of the cards.
      cards.forEach((title) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.innerText = title;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${title}`;

        chrome.storage.local.get([title], (items) => {
          checkbox.checked = items[title] === undefined ? true : items[title];
        });

        li.appendChild(span);
        li.appendChild(checkbox);

        checkbox.addEventListener("click", (e) => {
          const targetElementId = e.target.id;
          const isVisible = e.target.checked;

          // If the user clicks on the checkbox the
          // visibility of the card is updated.
          chrome.storage.local.set({ [targetElementId]: isVisible });

          // Notify the content script that the visbility
          // has changed so it can hide or show the card.
          chrome.tabs.sendMessage(currentTabId, {
            targetElementId,
            isVisible,
            type: "setIsVisible",
          });
        });

        list.appendChild(li);
      });

      document.body.appendChild(list);
      return;
    }
  });
});
