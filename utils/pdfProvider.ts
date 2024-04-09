import { PDFDocument, PDFPage } from "pdf-lib";

async function mergeBetweenPDF(
  pdfFileList: File[],
): Promise<{ pdfFile: Uint8Array | null; pdfNotMergedList: string[] }> {
  let returnObj: { pdfFile: Uint8Array | null; pdfNotMergedList: string[] } = {
    pdfFile: null,
    pdfNotMergedList: [],
  };

  if (pdfFileList.length > 0) {
    const pdfDoc: PDFDocument = await PDFDocument.create();
    let pdfNotMergedList: string[] = [];

    // Get all file URLs into a list using Promises and fetch API
    const pdfPromises = pdfFileList.map(async (pdfFile) => {
      try {
        const fileArrayBuffer = await pdfFile.arrayBuffer();
        const tempDoc = await PDFDocument.load(fileArrayBuffer);

        const copiedPages: PDFPage[] = await pdfDoc.copyPages(
          tempDoc,
          tempDoc.getPageIndices(),
        );

        copiedPages.forEach((page) => {
          pdfDoc.addPage(page);
        });
      } catch (err) {
        console.log(err);
        pdfNotMergedList.push(pdfFile.name);
      }
    });

    try {
      await Promise.all(pdfPromises);

      returnObj.pdfFile = await pdfDoc.save();
      returnObj.pdfNotMergedList = pdfNotMergedList;
      return returnObj;
    } catch (err) {
      console.log(err);
      returnObj.pdfFile = null;
      returnObj.pdfNotMergedList = pdfNotMergedList;
      return returnObj;
    }
  }

  return returnObj;
}

export default {
  mergeBetweenPDF,
};
