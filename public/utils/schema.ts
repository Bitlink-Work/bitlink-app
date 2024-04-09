import * as yup from "yup";

export const createNftSchema = yup.object().shape({
  creator_name: yup
    .string()
    .trim()
    .required("Creator name is required")
    .max(30, "Creator Name must not exceed 30 characters"),
  nft_name: yup
    .string()
    .trim()
    .required("NFT name is required")
    .max(30, "NFT Name must not exceed 30 characters"),
  image_url: yup.string().trim().required("Image url is required"),
  supply: yup
    .number()
    .typeError("Supply must be integer")
    .required("Supply field is required")
    .integer("Supply must be integer")
    .positive("Supply must be positive")
    .min(0, "Min is 0"),
});

export const schemaContact = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    message: yup.string().required("Message is required"),
  })
  .required();

export const createCollectionSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is a required field")
    .max(12, "Name must not exceed 12 characters"),
  symbol: yup
    .string()
    .trim()
    .required("Symbol is a required field")
    .matches(
      /^[A-Za-z]+$/,
      "Symbol not must be special characters, number or space",
    )
    .max(10, "Symbol must not exceed 10 characters"),
});
