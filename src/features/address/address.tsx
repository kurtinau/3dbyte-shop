import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import RadioGroup from "components/radio-group/radio-group";
import RadioCard from "components/radio-card/radio-card";
import { Button } from "components/button/button";
import { handleModal } from "features/checkouts/checkout-modal";
import { ProfileContext } from "contexts/profile/profile.context";
import { useMutation } from "@apollo/client";
import { DELETE_ADDRESS, SET_ADDRESS_PRIMARY } from "graphql/mutation/address";
import { CardHeader } from "components/card-header/card-header";
import { ButtonGroup } from "components/button-group/button-group";
import { Box } from "components/box";
import { Plus } from "assets/icons/PlusMinus";
import CreateOrUpdateAddress from "components/address-finder/address-finder";

interface Props {
  increment?: boolean;
  icon?: boolean;
  buttonProps?: any;
  flexStart?: boolean;
  token: string;
}

const Address = ({
  increment = false,
  flexStart = false,
  buttonProps = {
    size: "big",
    variant: "outlined",
    type: "button",
    className: "add-button",
  },
  icon = false,
  token,
}: Props) => {
  const [deleteAddressMutation] = useMutation(DELETE_ADDRESS);
  const [setAddressPrimaryMutation] = useMutation(SET_ADDRESS_PRIMARY);
  const {
    state: { addresses },
    dispatch,
  } = useContext(ProfileContext);

  const handleSetPrimary = async (id) => {
    await setAddressPrimaryMutation({
      variables: { input: { where: { id: id } } },
      context: { headers: { Authorization: "Bearer " + token } },
    });
    dispatch({ type: "SET_PRIMARY_ADDRESS", payload: id });
  };
  const handleOnDelete = async (item) => {
    await deleteAddressMutation({
      variables: { input: { where: { id: item.id } } },
      context: { headers: { Authorization: "Bearer " + token } },
    });
    dispatch({ type: "DELETE_ADDRESS", payload: item.id });
  };
  const setAddressContent = (item) =>
    item.line1 +
    " " +
    (item.line2 || "") +
    ", " +
    item.suburb +
    " " +
    item.state +
    " " +
    item.postcode;
  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id="checkoutDeliveryAddress"
          defaultMessage="Select Your Delivery Address"
        />
      </CardHeader>
      <ButtonGroup flexStart={flexStart}>
        <RadioGroup
          items={addresses}
          component={(item: any) => (
            <RadioCard
              id={item.id}
              key={item.id}
              title={item.suburb}
              content={setAddressContent(item)}
              name="address"
              checked={item.isPrimary}
              onChange={() => handleSetPrimary(item.id)}
              onEdit={() => handleModal(CreateOrUpdateAddress, item)}
              onDelete={() => handleOnDelete(item)}
            />
          )}
          secondaryComponent={
            <Button
              {...buttonProps}
              onClick={() =>
                handleModal(CreateOrUpdateAddress, "add-address-modal")
              }
              // onClick={() => handleModal(UpdateAddress)}
            >
              {icon && (
                <Box mr={2}>
                  <Plus width="10px" />
                </Box>
              )}
              <FormattedMessage
                id="addAddressBtn"
                defaultMessage="Add Address"
              />
            </Button>
          }
        />
      </ButtonGroup>
    </>
  );
};
export default Address;
