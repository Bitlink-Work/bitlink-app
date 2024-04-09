export const checkFileType = (file: File) => {
  const partName = file.name.split(".");

  return partName[partName.length - 1].toLowerCase();
};
