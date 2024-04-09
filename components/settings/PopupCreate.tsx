import { getChainCurrency } from "@/public/actions";
import { invoiceServices } from "@/public/api/invoiceServices";
import { useAppDispatch, useAppSelector } from "@/public/hook/hooks";
import copy from "@/public/images/settings/copy.svg";
import { selectCurrency } from "@/public/reducers/invoiceSlice";
import { COUNTRY } from "@/public/utils/constants";
import { copyTextToClipboard } from "@/public/utils/lib";
import { zoomIn } from "@/public/utils/motion";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import MainButton from "../button/MainButton";
import SelectField from "../fields/SelectField";
import InputField from "../inputfield/InputField";
import SessionTitle from "../title/SessionTitle";

const FormWallet = ({ onSubmit, setShowPopup }: any) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    register,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm();
  const [disable, setDisable] = useState(true);
  const currencies = useAppSelector(selectCurrency);
  const [listNetwork, setListNetwork] = useState<any>([]);
  const [isValidWallet, setIsValidWallet] = useState(false);

  const dispatch = useAppDispatch();

  const fetchListCurrencies = async () => {
    dispatch(getChainCurrency({}));
  };

  useEffect(() => {
    fetchListCurrencies();
  }, []);

  useEffect(() => {
    if (currencies) {
      setListNetwork(
        currencies?.map((item: any) => {
          const { logo } = item.currencies[0];
          const chain_name = item.chain_name;
          return { icon: logo, label: chain_name, value: chain_name };
        }),
      );
    }
  }, [currencies]);

  const onVerifyWalletAddress = async (data: any) => {
    if (String(watch("payment_network")).toLowerCase() === "solana") {
      const res = await invoiceServices.verifyWalletAddress({
        public_address: data?.public_address,
      });

      if (!res?.data?.is_valid) {
        setIsValidWallet(false);
        setError("address", {
          type: "manual",
          message: "Invalid wallet address",
        });
      } else {
        setIsValidWallet(true);
        clearErrors("address");
      }
    } else {
      setIsValidWallet(true);
      clearErrors("address");
    }
  };

  useEffect(() => {
    if (String(watch("payment_network")).toLowerCase() === "solana") {
      if (watch("address") !== "") {
        onVerifyWalletAddress({ public_address: watch("address") || "" });
      }
    } else {
      clearErrors("address");
    }
  }, [watch("payment_network"), watch("address")]);

  useEffect(() => {
    if (
      watch("wallet_name") !== "" &&
      watch("address") !== "" &&
      watch("payment_network") &&
      isValidWallet
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [
    watch("wallet_name"),
    watch("address"),
    watch("payment_network"),
    isValidWallet,
  ]);

  const handleIconClick = () => {
    copyTextToClipboard(watch("address"));
    toast.success("Copied to clipboard", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      transition: Bounce,
    });
  };

  return (
    <>
      <form className="space-y-6">
        <InputField
          name={"wallet_name"}
          label="Wallet name *"
          register={register}
          errors={errors}
          watch={watch}
          handleChange={(e) => {
            e.stopPropagation();
            // const rex = new RegExp(/^[a-zA-Z\s]*$/);
            if (
              // !rex.test(e.target.value) ||
              e.target.value.trim() === ""
            ) {
              setError("wallet_name", {
                message: "Invalid Wallet Name",
              });
              setValue(
                "wallet_name",
                e.target.value.replace(/^\s+|\s+$/gm, ""),
              );
            } else {
              setValue("wallet_name", e.target.value);
              clearErrors("wallet_name");
            }
          }}
          // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
          setError={setError}
          clearErrors={clearErrors}
          setValue={setValue}
          className=""
          placeholder="Wallet name *"
          required
          type="text"
          widthFull={true}
          maxLength={50}
        />
        {/* <SelectField className='h-[57px]' placeholder='Payment Network' data={[]} /> */}
        <SelectField
          data={listNetwork}
          formField="payment_network"
          placeholder="Payment Network"
          searchPlaceholder="Type a Network"
          required
          errorText="This field is required"
          errors={errors}
          control={control}
          setValue={setValue}
        />

        <InputField
          name={"address"}
          widthFull
          label="Wallet Address/Domain ENS"
          required
          handleChange={(e) => {
            e.stopPropagation();
            if (e.target.value.trim() === "") {
              setValue("address", e.target.value.replace(/^\s+|\s+$/gm, ""));
            } else {
              setValue("address", e.target.value);
              clearErrors("address");
            }
          }}
          icon={copy}
          handleIconClick={handleIconClick}
          register={register}
          errors={errors}
          watch={watch}
          // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
          setError={setError}
          clearErrors={clearErrors}
          setValue={setValue}
          className=""
          placeholder="Wallet Address/Domain ENS"
          type="text"
          maxLength={100}
        />
      </form>
      <div className="flex items-center justify-between">
        <MainButton
          title="Cancel"
          outline
          // bold
          // hideBorder
          onClick={() => {
            setShowPopup(false);
          }}
        />
        <MainButton
          disabled={disable}
          bold
          hideBorder
          title="Save Wallet"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </>
  );
};

const FormBank = ({ onSubmit, setShowPopup }: any) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    register,
  } = useForm();

  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (
      watch("bank_account_name") !== "" &&
      watch("first_name") !== "" &&
      watch("last_name") !== "" &&
      watch("company_name") !== "" &&
      watch("bank_name") !== "" &&
      watch("country") !== "" &&
      watch("account_currency") !== "" &&
      watch("account_number") !== "" &&
      watch("swift_code") !== ""
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [
    watch("bank_account_name"),
    watch("first_name"),
    watch("last_name"),
    watch("company_name"),
    watch("bank_name"),
    watch("country"),
    watch("account_currency"),
    watch("account_number"),
    watch("swift_code"),
  ]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          name={"bank_account_name"}
          widthFull
          label="Bank Account Name *"
          required
          handleChange={(e) => {
            if (e.target.value.length > 0) {
              if (e.target.value.trim() !== "") {
                setValue("bank_account_name", e.target.value);
                clearErrors("bank_account_name");
              } else {
                setError("bank_account_name", {
                  message: "Invalid Bank Account Name",
                });
              }
            } else {
              setError("bank_account_name", {
                message: "Bank account name is required",
              });
            }
          }}
          register={register}
          errors={errors}
          watch={watch}
          // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
          setError={setError}
          setValue={setValue}
          className=""
          placeholder="Bank Account Name *"
          type="text"
          maxLength={50}
        />
        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <InputField
            name={"first_name"}
            label="First name *"
            register={register}
            errors={errors}
            watch={watch}
            handleChange={(e) => {
              // const rex = new RegExp(/^[a-zA-Z\s]*$/);
              if (
                // !rex.test(e.target.value) ||
                e.target.value.trim() === ""
              ) {
                setError("first_name", {
                  message: "Invalid First Name",
                });
                setValue(
                  "first_name",
                  e.target.value.replace(/^\s+|\s+$/gm, ""),
                );
              } else {
                setValue("first_name", e.target.value);
                clearErrors("first_name");
              }
            }}
            // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
            setError={setError}
            clearErrors={clearErrors}
            setValue={setValue}
            className=""
            placeholder="First name *"
            required
            type="text"
            widthFull={true}
            maxLength={50}
          />
          <InputField
            name={"last_name"}
            label="Last name *"
            register={register}
            errors={errors}
            watch={watch}
            handleChange={(e) => {
              // const rex = new RegExp(/^[a-zA-Z\s]*$/);
              if (
                // !rex.test(e.target.value) ||
                e.target.value.trim() === ""
              ) {
                setError("last_name", {
                  message: "Invalid Last Name",
                });
                setValue(
                  "last_name",
                  e.target.value.replace(/^\s+|\s+$/gm, ""),
                );
              } else {
                setValue("last_name", e.target.value);
                clearErrors("last_name");
              }
            }}
            // pattern={/^[a-zA-Z]+[ a-zA-Z]*$/}
            setError={setError}
            clearErrors={clearErrors}
            setValue={setValue}
            className=""
            placeholder="Last name *"
            required
            type="text"
            widthFull={true}
            maxLength={50}
          />
          <InputField
            name={"company_name"}
            widthFull
            label="Company Name *"
            required
            handleChange={(e) => {
              if (e.target.value.length > 0) {
                if (e.target.value.trim() !== "") {
                  setValue("company_name", e.target.value);
                  clearErrors("company_name");
                } else {
                  setError("company_name", {
                    message: "Invalid Company Name",
                  });
                }
              } else {
                setError("company_name", {
                  message: "Company name is required",
                });
              }
            }}
            register={register}
            errors={errors}
            watch={watch}
            // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
            setError={setError}
            setValue={setValue}
            className=""
            placeholder="Company Name *"
            type="text"
            maxLength={100}
          />
          <InputField
            name={"bank_name"}
            widthFull
            label="Bank Name *"
            required
            handleChange={(e) => {
              if (e.target.value.length > 0) {
                if (e.target.value.trim() !== "") {
                  setValue("bank_name", e.target.value);
                  clearErrors("bank_name");
                } else {
                  setError("bank_name", {
                    message: "Invalid Bank Name",
                  });
                }
              } else {
                setError("bank_name", {
                  message: "Bank name is required",
                });
              }
            }}
            register={register}
            errors={errors}
            watch={watch}
            // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
            setError={setError}
            setValue={setValue}
            className=""
            placeholder="Bank Name *"
            type="text"
            maxLength={100}
          />
          {/* <SelectField className='h-[57px]' placeholder='Country' data={[]} /> */}
          <Controller
            control={control}
            name="country"
            render={({ field }) => {
              return (
                <FormControl fullWidth style={{ border: "none" }}>
                  <InputLabel htmlFor="field.name">Country</InputLabel>
                  <Select
                    label="Country"
                    value={field.value}
                    onChange={field.onChange}
                    id={field.name}
                    style={{ border: "none", outline: "none" }}
                  >
                    {COUNTRY.map((element, index) => {
                      return (
                        <MenuItem
                          style={{
                            fontSize: "14px",
                          }}
                          key={index}
                          value={element.name}
                        >
                          {element.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              );
            }}
          />
          {/* <SelectField className='h-[57px]' placeholder='Account Currency' data={[]} /> */}
          <SelectField
            data={[{ label: "None" }, { label: 123, value: 123 }]}
            formField="account_currency"
            placeholder="Account Currency"
            searchPlaceholder="Type a Currency"
            required
            errorText="This field is required"
            errors={errors}
            control={control}
            setValue={setValue}
          />
          <InputField
            name={"account_number"}
            widthFull
            label="Account Number *"
            required
            handleChange={(e) => {
              const rex = new RegExp(/^[0-9]*$/);
              if (!rex.test(e.target.value) || e.target.value.trim() === "") {
                setError("account_number", {
                  message: "Invalid Account Number",
                });
                setValue(
                  "account_number",
                  e.target.value.replace(
                    /^[[a-zA-Z]^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
                    "",
                  ),
                );
              } else if (e.target.value.length < 10) {
                setError("account_number", {
                  message: "Account number must be 10 digits long",
                });
                setValue("account_number", e.target.value);
              } else {
                setValue("account_number", e.target.value);
                clearErrors("account_number");
              }
            }}
            register={register}
            errors={errors}
            watch={watch}
            // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
            setError={setError}
            clearErrors={clearErrors}
            setValue={setValue}
            className=""
            placeholder="Account Number *"
            type="text"
            maxLength={20}
            minLength={10}
          />
          <InputField
            name={"swift_code"}
            widthFull
            label="Swift Code *"
            required
            handleChange={(e) => {
              if (e.target.value.trim() === "") {
                setValue(
                  "swift_code",
                  e.target.value.replace(/^\s+|\s+$/gm, ""),
                );
              } else {
                setValue("swift_code", e.target.value);
                clearErrors("swift_code");
              }
            }}
            register={register}
            errors={errors}
            watch={watch}
            // pattern={/^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/}
            setError={setError}
            clearErrors={clearErrors}
            setValue={setValue}
            className=""
            placeholder="Swift Code *"
            type="text"
            maxLength={50}
          />
        </div>
      </form>
      <div className="flex items-center justify-between">
        <MainButton
          title="Cancel"
          outline
          // bold
          // hideBorder
          onClick={() => {
            setShowPopup(false);
          }}
        />
        <MainButton
          disabled={disable}
          bold
          hideBorder
          title="Save Bank Account"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </>
  );
};

const PopupCreate = ({ selectedForm, setShowPopup }: any) => {
  // const form = useForm({ defaultValues: selectedForm.defaultForm });
  const onSubmit = (data: any) => {
    console.log("data", data);
    setShowPopup(false);
  };

  return (
    <div className="flex justify-center">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={zoomIn(0, 0.4)}
        className="h-[min-content] w-[800px] space-y-8 rounded-xl bg-white px-[60px] py-10"
      >
        <SessionTitle title="How do you want to receive funds?" />
        {selectedForm == "crypto" ? (
          <FormWallet onSubmit={onSubmit} setShowPopup={setShowPopup} />
        ) : (
          <FormBank onSubmit={onSubmit} setShowPopup={setShowPopup} />
        )}
      </motion.div>
    </div>
  );
};

export default PopupCreate;
