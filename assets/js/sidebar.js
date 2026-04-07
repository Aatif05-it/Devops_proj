document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  // "html", "css", "js" etc. taken from data-section attribute
  const sectionId = sidebar.dataset.section || "html";

  // 1) point to your real JSON file
  fetch("../../assets/data/sidebar-link.json")
    .then((res) => res.json())
    .then((config) => {
      // 2) JSON must have { "sections": [ { id, title, basePath, links: [...] } ] }
      const section = config.sections.find((s) => s.id === sectionId);
      if (!section) return;

      // Heading: "HTML Tutorial", "CSS Tutorial", "JS Tutorial", etc.
      const h3 = document.createElement("h3");
      h3.textContent = section.title;
      sidebar.appendChild(h3);

      const currentFile = location.pathname.split("/").pop();

      section.links.forEach((link) => {
        const a = document.createElement("a");
        a.textContent = link.title;

        // ---- IMPORTANT PART ----
        // If link.file is already a simple file name (js-intro.html),
        // just use it. This keeps JS links inside /tutorials/js/
        // and avoids /tutorials/js/tutorials/js/... 404 errors. [web:79]
        if (
          link.file.startsWith("http://") ||
          link.file.startsWith("https://") ||
          link.file.startsWith("/")
        ) {
          // absolute URL or root-relative
          a.href = link.file;
        } else {
          // relative file in the SAME folder as the current page
          a.href = link.file;
          // If in future you really want a different folder, you can switch to:
          // a.href = (section.basePath || "") + link.file;
        }

        // Keep tutorial navigation in the same tab

        // Mark unpublished / coming soon links
        if (
          link.status &&
          link.status !== "published" &&
          link.status !== "ready"
        ) {
          a.classList.add("link-disabled");
        }

        // Highlight current page
        if (currentFile === link.file) {
          a.classList.add("active-link");
        }

        sidebar.appendChild(a);
      });
    })
    .catch((err) => console.error("Sidebar load error:", err));
});
