import { CardHeader } from "components/card-header/card-header";
import RadioCard from "components/radio-card/radio-card";
import RadioGroup from "components/radio-group/radio-group";
import { ProfileContext } from "contexts/profile/profile.context";
import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

interface Props {
  increment?: boolean;
}

const Shippings = ({ increment = false }: Props) => {
  const {
    state: { schedules },
    dispatch,
  } = useContext(ProfileContext);

//   const [shippingCost, setShippingCost] = useState(0);

  //   useEffect(() => {
  //       const fetchAuPostCostData = async () => {
  //         fetch(process.env.AUPOST_SHIPPING_SERVICES_ENDPOINT, {
  //                 method: "POST",
  //                 headers: {
  //                   "AUTH-KEY": process.env.AUPOST_SHIPPING_API_KEY,
  //                 },
  //               })
  //                 .then((res) => {
  //                   if (!res.ok) {
  //                     throw new Error(res.statusText);
  //                   }
  //                   return res.json();
  //                 })
  //                 .then(
  //                   (result) => {
  //                     // setSuggestions(result);
  //                   },
  //                   (error) => {
  //                     console.log("error:: ", error);
  //                   }
  //                 );
  //       }

  //       const fetchFastwayCostData = async () => {

  //       }
  //   }, []);

  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id="shippingMethod"
          defaultMessage="Shipping"
        />
      </CardHeader>
      <RadioGroup
        items={[{ id: 1, title: "Free Shipping" }]}
        component={(item: any) => (
          <RadioCard
            id={item.id}
            key={item.id}
            title={item.title}
            content={
            //   item.time_slot + (shippingCost !== 0 ? " $" + shippingCost : "")
            ''
            }
            name="shippingCost"
            // checked={item.type === "primary"}
            checked={true}
            withActionButtons={false}
            onChange={() =>{}
            //   dispatch({
            //     type: "SET_PRIMARY_SCHEDULE",
            //     payload: item.id.toString(),
            //   })
            }
          />
        )}
      />
    </>
  );
};

export default Shippings;
