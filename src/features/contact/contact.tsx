import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import RadioGroup from "components/radio-group/radio-group";
import RadioCard from "components/radio-card/radio-card";
import { Button } from "components/button/button";
import { handleModal } from "features/checkouts/checkout-modal";
import { ProfileContext } from "contexts/profile/profile.context";
import CreateOrUpdateContact from "components/contact-card/contact-card";
import { useMutation } from "@apollo/client";
import { DELETE_CONTACT, SET_CONTACT_PRIMARY } from "graphql/mutation/contact";
import { CardHeader } from "components/card-header/card-header";
import { ButtonGroup } from "components/button-group/button-group";
import { Box } from "components/box";
import { Plus } from "assets/icons/PlusMinus";
interface Props {
  increment?: boolean;
  flexStart?: boolean;
  icon?: boolean;
  buttonProps?: any;
  token: string;
}

const Contact = ({
  increment = false,
  flexStart = false,
  icon = false,
  buttonProps = {
    size: "big",
    variant: "outlined",
    type: "button",
    className: "add-button",
  },
  token,
}: Props) => {
  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const [setContactPrimaryMutation] = useMutation(SET_CONTACT_PRIMARY);
  const {
    state: { contacts },
    dispatch,
  } = useContext(ProfileContext);
  const handleSetPrimary = async (id) => {
    await setContactPrimaryMutation({
      variables: { input: { where: { id: id } } },
      context: { headers: { Authorization: "Bearer " + token } },
    });
    dispatch({ type: "SET_PRIMARY_CONTACT", payload: id });
  };
  const handleOnDelete = async (item) => {
    await deleteContactMutation({
      variables: { input: { where: { id: item.id } } },
      context: { headers: { Authorization: "Bearer " + token } },
    });
    dispatch({ type: "DELETE_CONTACT", payload: item.id });
  };
  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id="contactNumberText"
          defaultMessage="Select Your Contact Number"
        />
      </CardHeader>
      <ButtonGroup flexStart={flexStart}>
        <RadioGroup
          items={contacts}
          component={(item: any) => (
            <RadioCard
              id={item.id}
              key={item.id}
              title={item.firstName + " " + item.lastName}
              content={item.phone}
              checked={item.isPrimary}
              onChange={() => handleSetPrimary(item.id)}
              name="contact"
              onEdit={() => handleModal(CreateOrUpdateContact, item)}
              onDelete={() => handleOnDelete(item)}
            />
          )}
          secondaryComponent={
            <Button
              {...buttonProps}
              onClick={() =>
                handleModal(CreateOrUpdateContact, "add-contact-modal")
              }
            >
              {icon && (
                <Box mr={2}>
                  <Plus width="10px" />
                </Box>
              )}
              <FormattedMessage
                id="addContactBtn"
                defaultMessage="Add Contact"
              />
            </Button>
          }
        />
      </ButtonGroup>
    </>
  );
};

export default Contact;
