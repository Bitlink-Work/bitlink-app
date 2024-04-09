import {
  FaceLivenessWebComponent,
  IFaceLiveness,
} from "@regulaforensics/vp-frontend-face-components";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { EnumTypeProfile } from "./public/utils/constants";

export {};
declare module "*.mp4" {
  export default string;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "face-liveness": DetailedHTMLProps<
        IFaceLiveness & HTMLAttributes<FaceLivenessWebComponent>,
        FaceLivenessWebComponent
      >;
    }
  }
  interface Icon {
    width?: number;
    height?: number;
  }

  interface IProfileUpdate {
    first_name: string;
    last_name: string;
    phone_number?: string;
    company_name: string;
    country: string;
    region: string;
    city: string;
    postal_code: string;
    address_line_1: string;
    address_line_2: string;
    public_address: string;
    tax_number: string;
  }
  interface IProfileUpdateType {
    user_id: string;
    type: EnumTypeProfile;
    email: string;
  }

  interface IProfile {
    user_id: string;
    name: string;
    email_google: string;
    phone_number?: string;
    avatar: string;
    type: EnumTypeProfile;
    is_verified: boolean;
    is_new: boolean;
    created_time: Date;
    first_name: string;
    last_name: string;
    company_name: string;
    country: string;
    region: string;
    city: string;
    postal_code: string;
    address_line_1: string;
    address_line_2: string;
    tax_number: string;
    public_address: string;
    logo: string;
  }

  type TClient = {
    email: string;
    companyName: string;
    firstName: string;
    lastName: string;
    country: string;
    region: string;
    city: string;
    postal: string;
    address: string;
    address1: string;
    tax: number;
  };
  type TCurrency = {
    currency_name: string;
    currency_symbol: string;
    currency_address: string;
    logo: string;
    decimal: number;
  };
  type TPayment = {
    chain_id: number;
    chain_name: string;
    currencies: Array<TCurrency>;
  };
  type TItemAmount = {
    description: number;
    quantity: number;
    amount: number;
    unit_price: number;
    tax: number;
  };
  type TypeFormCreateInvoice = {
    companyName: string;
    firstName: string;
    lastName: string;
    country: string;
    region: string;
    city: string;
    postal: number;
    address: string;
    address1: string;
    tax: number;
    img: string;
    client: TClient;
    dataPayment: TPayment;
    wallet: string;
    items: Array<TItemAmount>;
    totalAmountData: number;
  };

  type TypeInformationFrom = {
    from_company: string;
    from_first_name: string;
    from_last_name: string;
    from_country: string;
    from_region: string;
    from_city: string;
    from_postal_code: string;
    from_address_line_1: string;
    from_address_line_2: string;
    from_tax_number: string;
    from_company_logo: string;
    from_type: EnumTypeProfile;
  };
  type TypeInformationTo = {
    to_id?: string;
    to_email: string;
    to_company: string;
    to_first_name: string;
    to_last_name: string;
    to_region: string;
    to_country: string;
    to_city: string;
    to_postal_code: string;
    to_address_line_1: string;
    to_address_line_2: string;
    to_tax_number: string;
    to_wallet: string;
    to_type: EnumTypeProfile;
    to_logo: string;
  };
  interface TypeInvoice extends TypeInformationFrom, TypeInformationTo {
    created_time: Date;
    day_expired: Date;
    currency: string;
    chain: string;
    reference: string;
    standard: string;
    items: Array<TItemAmount>;
    dataChain?: IChain;
    dataNetwork?: IChain;
  }
  interface IPartnerUpdate {
    partner_id: string;
    partner_email: string;
    partner_company: string;
    partner_first_name: string;
    partner_last_name: string;
    partner_region: string;
    partner_country: string;
    partner_city: string;
    partner_postal_code: string;
    partner_address_line1: string;
    partner_address_line2: string;
    partner_tax_number: string;
    type: string;
    logo: string;
  }
  interface ICurrency {
    currency_name: string;
    currency_symbol: string;
    currency_address: string;
    logo: string;
    decimal: number;
  }
  interface IChain {
    chain_id: string;
    chain_name: string;
    currencies: Array<ICurrency>;
  }

  interface IProfileOwner {
    partner_id: string;
    user_id: string;
    partner_email: string;
    partner_company: string;
    partner_first_name: string;
    partner_last_name: string;
    partner_region: string;
    partner_country: string;
    partner_city: string;
    partner_postal_code: string;
    partner_address_line1: string;
    partner_address_line2: string;
    partner_tax_number: string;
    type: EnumTypeProfile;
  }
}
