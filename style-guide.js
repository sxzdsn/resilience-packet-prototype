(() => {
  const demo = document.querySelector("[data-page-system-view]");
  if (!demo) return;

  const buttons = [...demo.querySelectorAll("[data-page-system-toggle]")];
  const panels = [...demo.querySelectorAll("[data-page-system-panel]")];

  const setView = (view) => {
    demo.dataset.pageSystemView = view;

    buttons.forEach((button) => {
      const isActive = button.dataset.pageSystemToggle === view;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.pageSystemPanel === view;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.pageSystemToggle));
  });
})();
