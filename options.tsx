import { useEffect, useState } from "react";

const View = () => {
  const [durl, setUrl] = useState<string | null>("");
  const [title, setTitle] = useState<string>("Loading...");

  const [stateCnt, setStateCnt] = useState<number>(0);

  useEffect(() => {
    const fetchMain = async (url: string) => {
      if (!url) return;
      setStateCnt(1);
      const bgurl: string = await chrome.runtime.sendMessage({
        message: "fetch",
        url,
      });
      setStateCnt(2);
      const response = await fetch(bgurl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setUrl(blobUrl);
      setStateCnt(3);
    };

    chrome.storage.local.get(["pdfURL", "title"], (result) => {
      setStateCnt(0);
      console.log("result", result);
      setTitle(result.title);
      const url = result.pdfURL;
      fetchMain(url);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: 0,
      }}
    >
      <h2>{title}</h2>
      <h3>state: {stateCnt}</h3>
      {durl && (
        <a href={durl} target="_blank" rel="noreferrer">
          Open in new tab
        </a>
      )}
      <iframe
        src={durl}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
      />
    </div>
  );
};

export default View;
