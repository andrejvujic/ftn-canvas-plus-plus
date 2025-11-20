chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Updates the visibility of the given course card
  // when the user toggles it in the extension popup.
  if (message.type === "setIsVisible") {
    // The target element ID isn't actually the ID of the
    // element in HTML - it's the aria-label value.
    const targetElementId = message.targetElementId;
    const isVisible = message.isVisible;

    const cards = Array.from(
      document.getElementsByClassName("ic-DashboardCard")
    );

    cards.forEach((element) => {
      const elementId = element.getAttribute("aria-label");
      if (elementId && elementId === targetElementId) {
        element.style = `display: ${isVisible ? "inline-block" : "none"}`;
      }
    });

    return;
  }
});

let container;
document.addEventListener("DOMContentLoaded", (e) => {
  // Makes the container invisible at first so that
  // the hiding of the cards isn't noticeable.
  container = document.getElementById("DashboardCard_Container");
  if (container) container.style = "display: block; opacity: 0;";
});

window.onload = () => {
  setTimeout(() => {
    // Loads the preferences from local storage and hides
    // the elements which were previously turned off. This runs
    // only once - on the initial page load after everything's
    // ready...
    const elements = Array.from(
      document.getElementsByClassName("ic-DashboardCard")
    );

    const cards = elements.map((element) => element.getAttribute("aria-label"));
    chrome.runtime.sendMessage({ cards, type: "setCards" });

    elements.forEach((element) => {
      const targetElementId = element.getAttribute("aria-label");

      if (targetElementId) {
        chrome.storage.local.get([targetElementId], (items) => {
          const isVisible =
            items[targetElementId] === undefined
              ? true
              : items[targetElementId];
          element.style = `display: ${isVisible ? "inline-block" : "none"}`;
        });
      }
    });

    // Once the required cards are hidden the container's
    // opacity will be animated and it will be made visible.
    if (container) {
      container.style = "display: block;";
      container.classList.add("fade-in");
    }
  }, 1200);
};
