import TextField from "components/forms/text-field";
import Switch from "components/switch/switch";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { CardHeader } from "../card-header/card-header";
import {
  FieldWrapper,
  FirstnameWrapper,
  RowFieldWrapper,
  LastnameWrapper,
  StateWrapper,
  PostcodeWrapper,
} from "./billing-address.style";

interface Props {
  increment?: boolean;
  icon?: boolean;
  buttonProps?: any;
  flexStart?: boolean;
}

const BillingAddress = ({
  increment = false,
  flexStart = false,
  buttonProps = {
    size: "big",
    variant: "outlined",
    type: "button",
    className: "add-button",
  },
  icon = false,
}: Props) => {
  const [billingForm, setBillingForm] = useState(false);
  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id="checkoutBillingAddress"
          defaultMessage="Billing Address"
        />
      </CardHeader>
      {/* when checked is false in page, the actual state is true */}
      <FieldWrapper>
        <Switch
          onUpdate={(state) => {
            setBillingForm(state);
          }}
          label="My billing address is the same as my shipping address."
          labelPosition="right"
          checked={true}
        />
      </FieldWrapper>
      {billingForm && (
        <>
          <RowFieldWrapper>
            <FirstnameWrapper>
              <TextField
                id="firstName"
                type="text"
                placeholder="First Name"
                // error={touched.line1 && errors.line1}
                value={""}
                onChange={() => {}}
                onBlur={() => {}}
                required
              />
            </FirstnameWrapper>
            <LastnameWrapper>
              <TextField
                id="lastName"
                type="text"
                placeholder="Last Name"
                // error={touched.line1 && errors.line1}
                value={""}
                onChange={() => {}}
                onBlur={() => {}}
                required
              />
            </LastnameWrapper>
          </RowFieldWrapper>

          <FieldWrapper>
            <TextField
              id="line1"
              type="text"
              placeholder="Address line 1"
              // error={touched.line1 && errors.line1}
              value={""}
              onChange={() => {}}
              onBlur={() => {}}
              required
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="line2"
              type="text"
              placeholder="Address line 2"
              // error={touched.line1 && errors.line1}
              value={""}
              onChange={() => {}}
              onBlur={() => {}}
              required
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="suburb"
              type="text"
              placeholder="Suburb"
              // error={touched.suburb && errors.suburb}
              value={""}
              onChange={() => {}}
              onBlur={() => {}}
              required
            />
          </FieldWrapper>
          <RowFieldWrapper>
            <StateWrapper>
              <TextField
                id="state"
                type="text"
                placeholder="State"
                // error={touched.state && errors.state}
                value={""}
                onChange={() => {}}
                onBlur={() => {}}
                required
              />
            </StateWrapper>
            <PostcodeWrapper>
              <TextField
                id="postcode"
                type="text"
                placeholder="Postcode"
                // error={touched.postcode && errors.postcode}
                value={""}
                onChange={() => {}}
                onBlur={() => {}}
                required
              />
            </PostcodeWrapper>
          </RowFieldWrapper>
        </>
      )}
    </>
  );
};

export default BillingAddress;
