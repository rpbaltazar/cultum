document.addEventListener("DOMContentLoaded", function () {

  function insertLocksmithText() {
    const container = document.querySelector("#locksmith-content");
    const button = container ? container.querySelector("button") : null;

    if (button && !document.querySelector(".custom-locksmith-text")) {

      const extraText = document.createElement("div");
      extraText.className = "custom-locksmith-text";
      extraText.innerHTML = "Con l'acquisto di tre prodotti riceverai la chiave per accedere al Giardino Segreto. Con una Lotion, l'accesso è immediato. Vai allo <a href=\"/collections/all\" class=\"locksmith-shop-link\">SHOP</a>";

      button.parentNode.insertAdjacentElement("afterend", extraText);
    }
  }

  // Locksmith loads dynamically → observe DOM changes
  const observer = new MutationObserver(insertLocksmithText);
  observer.observe(document.body, { childList: true, subtree: true });

});
