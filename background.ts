export type Request = {
  message: string;
  url: string;
};

chrome.runtime.onMessage.addListener(
  (request: Request, _sender, sendResponse) => {
    if (request.message === "openOption") {
      chrome.runtime.openOptionsPage();
    } else if (request.message === "fetch") {
      const reader = new FileReader();
      reader.onload = function () {
        sendResponse(reader.result);
      };

      fetch(request.url, {
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
    }
    return true;
  },
);
