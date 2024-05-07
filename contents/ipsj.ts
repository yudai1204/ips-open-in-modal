import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://ipsj.ixsq.nii.ac.jp/ej/*"],
  run_at: "document_end",
};

let result = null;

const getPDF = async () => {
  const element = document.querySelector("meta[name='citation_pdf_url']");
  const pdfURL = element?.getAttribute("content");

  const reader = new FileReader();
  reader.onload = async () => {
    const response = await fetch(reader.result as string);
    const blob = await response.blob();
    result = URL.createObjectURL(blob);
    document.getElementById("extensionOpenPaperModal").textContent =
      "モーダルで開く";
    document
      .getElementById("extensionOpenPaperModal")
      .classList.remove("isLoading");
  };

  fetch(pdfURL, {
    method: "GET",
  })
    .then((response) => {
      if (response && response.ok) {
        return response.blob();
      }
    })
    .then((blob) => {
      reader.readAsDataURL(blob);
      return true;
    });
};

const onClick = () => {
  console.log(result);
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="pdfExtensionModal">
      <iframe src="${result}" id="pdfExtensionIframe"></iframe>
    </div>
    `,
  );

  document.getElementById("pdfExtensionModal").addEventListener("click", () => {
    document.getElementById("pdfExtensionModal")?.remove();
  });
  document
    .getElementById("pdfExtensionIframe")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
    });
};

const params = new URLSearchParams(window.location.search);
if (
  params.get("action") === "pages_view_main" &&
  params.get("active_action") === "repository_view_main_item_detail"
) {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("assets/main.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const openPaperButton = document.createElement("div");
  openPaperButton.id = "extensionOpenPaperModal";
  openPaperButton.textContent = "LOADING...";
  openPaperButton.classList.add("isLoading");
  document.body.appendChild(openPaperButton);

  document
    .getElementById("extensionOpenPaperModal")
    ?.addEventListener("click", onClick);
  getPDF();
}
