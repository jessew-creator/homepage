const storageKey = "oneworld-ethereal-lang";

const attributeMap = [
  ["alt", "zhAlt", "enAlt"],
  ["aria-label", "zhAriaLabel", "enAriaLabel"],
  ["title", "zhTitle", "enTitle"],
  ["content", "zhContent", "enContent"],
  ["placeholder", "zhPlaceholder", "enPlaceholder"]
];

function getBodyMeta(lang) {
  const suffix = lang === "zh" ? "Zh" : "En";
  return {
    title: document.body.dataset["title" + suffix] || "",
    description: document.body.dataset["description" + suffix] || ""
  };
}

function applyLanguage(lang) {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.body.dataset.lang = lang;

  const meta = getBodyMeta(lang);
  if (meta.title) {
    document.title = meta.title;
  }

  if (meta.description) {
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", meta.description);
    }
  }

  document.querySelectorAll("[data-zh][data-en]").forEach((node) => {
    node.textContent = lang === "zh" ? node.dataset.zh : node.dataset.en;
  });

  document.querySelectorAll("*").forEach((node) => {
    attributeMap.forEach(([attribute, zhKey, enKey]) => {
      const value = lang === "zh" ? node.dataset[zhKey] : node.dataset[enKey];
      if (value) {
        node.setAttribute(attribute, value);
      }
    });
  });

  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.langOption === lang);
  });
}

function setupLanguageToggle() {
  const preferred = localStorage.getItem(storageKey) || "zh";
  applyLanguage(preferred);

  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.langOption;
      localStorage.setItem(storageKey, lang);
      applyLanguage(lang);
    });
  });
}

function setupReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageToggle();
  setupReveal();
});
