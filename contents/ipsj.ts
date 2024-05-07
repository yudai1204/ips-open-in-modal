import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://ipsj.ixsq.nii.ac.jp/ej/*"],
};

const onClick = () => {
  const element = document.querySelector("meta[name='citation_pdf_url']");
  const pdfURL = element?.getAttribute("content");

  const titleElement = document.querySelector("meta[name='citation_title']");
  const title = titleElement?.getAttribute("content");

  if (pdfURL) {
    chrome.storage.local.set({ pdfURL, title }, () => {
      chrome.runtime.sendMessage({ message: "openOption" });
    });
  }
};

document.body.insertAdjacentHTML(
  "beforeend",
  `
<div style="position: fixed; bottom: 10px; right: 10px;background-color: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);cursor: pointer;" id="hoge">
  OPEN PDF
</div>
`,
);

document.getElementById("hoge")?.addEventListener("click", onClick);
