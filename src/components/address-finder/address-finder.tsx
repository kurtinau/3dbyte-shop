import React, { forwardRef, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { withFormik, FormikProps, Form, Formik } from "formik";
import { closeModal } from "@redq/reuse-modal";
import TextField from "components/forms/text-field";
import { Button } from "components/button/button";
import { useMutation } from "@apollo/client";
import { CREATE_ADDRESS, UPDATE_ADDRESS } from "graphql/mutation/address";
import { FieldWrapper, Heading } from "../address-card/address-card.style";
import { ProfileContext } from "contexts/profile/profile.context";
import { FormattedMessage } from "react-intl";
import Autosuggest from "react-autosuggest";
import { AddressFinderWrapper } from "./address-finder.style";
import { default as AutosuggestHighlightMatch } from "autosuggest-highlight/match";
import { default as AutosuggestHighlightParse } from "autosuggest-highlight/parse";
import { sliceAddress } from "utils/sliceStr";
import { useSession } from "next-auth/client";

interface AddressrResultType {
  sla?: string;
  highlight?: { sla: string };
  pid?: string;
}

//Shape of form values
interface FormValues {
  id?: number | null;
  line1?: string;
  line2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  sla?: string;
  pid?: string;
}

// The type of props MyForm receives
interface MyFormProps {
  item?: any | null;
}

const AddressValidationSchema = Yup.object().shape({
  line1: Yup.string().required("Address line 1 is required!"),
  suburb: Yup.string().required("Suburb is required"),
  state: Yup.string().required("State is required"),
  postcode: Yup.string().required("Postcode is required"),
});

const CreateOrUpdateAddress: React.FC<MyFormProps> = ({ item }) => {
  const initialValues = {
    id: item.id || null,
    line1: item.line1 || "",
    line2: item.line2 || "",
    suburb: item.suburb || "",
    state: item.state || "",
    postcode: item.postcode || "",
    sla: item.sla || "",
    pid: item.pid || "",
  };
  const [suggestions, setSuggestions] = useState<AddressrResultType[]>([]);
  const [value, setValue] = useState("");
  const [updateAddressMutation] = useMutation(UPDATE_ADDRESS);
  const [createAddressMutation] = useMutation(CREATE_ADDRESS);
  const [session] = useSession();
  const { state, dispatch } = useContext(ProfileContext);

  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = suggestion.sla;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    return (
      <span>
        {parts.map((part, index) => {
          const className = part.highlight ? "suggestion-highlight" : null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    );
  };

  const suggestionSelectedHandler = (suggestion, setFieldValue) => {
    const result = sliceAddress(suggestion.sla);
    console.log("suggestionSelected--result:: ", result);
    if (result) {
      setFieldValue("line1", result.line1);
      setFieldValue("line2", result.line2 || "");
      setFieldValue("suburb", result.suburb);
      setFieldValue("state", result.state);
      setFieldValue("postcode", result.postcode);
      setFieldValue("pid", suggestion.pid);
      setFieldValue("sla", suggestion.sla);
    }
  };

  const fetchAddressSuggestions = ({ value }) => {
    //TODO change addressr api to env local variable
    fetch("https://addressr.p.rapidapi.com/addresses?q=" + value, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "5984e3946bmsh4689fcc475ccd00p1ee9e2jsnc018914474ef",
        "x-rapidapi-host": "addressr.p.rapidapi.com",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          setSuggestions(result);
        },
        (error) => {
          console.log("error:: ", error);
        }
      );
  };

  const inputProps = {
    placeholder: "Search Address",
    value,
    onChange: (event, { newValue }) => setValue(newValue),
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    const { id, ...partialValues } = values;
    if (values.id) {
        const { data } = await updateAddressMutation({
        variables: {
          addressInput: { where: { id: id }, data: partialValues },
        },
        context: { headers: { Authorization: "Bearer " + session.jwt } },
      });
      dispatch({ type: "UPDATE_ADDRESS", payload: data.updateAddress.address });
    } else {
      if (!partialValues.pid) {
        partialValues.sla =
          partialValues.line1 +
          " " +
          (partialValues.line2 || "") +
          ", " +
          partialValues.suburb +
          " " +
          partialValues.state +
          " " +
          partialValues.postcode;
      }
      const { data } = await createAddressMutation({
        variables: { addressInput: { data: partialValues } },
        context: { headers: { Authorization: "Bearer " + session.jwt } },
      });
      values.id = data.createAddress.address.id;
      dispatch({ type: "ADD_ADDRESS", payload: data.createAddress.address });
    }

    closeModal();
    setSubmitting(false);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={AddressValidationSchema}
    >
      {({
        values,
        handleChange,
        handleBlur,
        isSubmitting,
        setFieldValue,
      }: FormikProps<FormValues>) => (
        <Form>
          <Heading>
            {item && item.id ? "Edit Address" : "Add New Address"}
          </Heading>
          <AddressFinderWrapper>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={fetchAddressSuggestions}
              onSuggestionsClearRequested={() => setSuggestions([])}
              getSuggestionValue={(suggestion) => suggestion.sla}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              focusInputOnSuggestionClick={false}
              onSuggestionSelected={(
                event,
                {
                  suggestion,
                  suggestionValue,
                  suggestionIndex,
                  sectionIndex,
                  method,
                }
              ) => suggestionSelectedHandler(suggestion, setFieldValue)}
              renderInputComponent={(inputProps) => {
                return (
                  <FieldWrapper>
                    <TextField
                      id="address"
                      as="textarea"
                      onChange={inputProps.onChange}
                      {...inputProps}
                    />
                  </FieldWrapper>
                );
              }}
            />
          </AddressFinderWrapper>
          <FieldWrapper>
            <TextField
              id="line1"
              type="text"
              placeholder="Address line 1"
              // error={touched.line1 && errors.line1}
              value={values.line1 || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              // onChange={() => {}}
              // onBlur={() => {}}
              required
            />
          </FieldWrapper>

          <FieldWrapper>
            <TextField
              id="line2"
              type="text"
              placeholder="Address line 2"
              // error={touched.line2 && errors.line2}
              value={values.line2 || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              // onChange={() => {}}
              // onBlur={() => {}}
            />
          </FieldWrapper>

          <FieldWrapper>
            <TextField
              id="suburb"
              type="text"
              placeholder="Suburb"
              // error={touched.suburb && errors.suburb}
              value={values.suburb || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              // onChange={() => {}}
              // onBlur={() => {}}
              required
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="state"
              type="text"
              placeholder="State"
              // error={touched.state && errors.state}
              value={values.state || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              // onChange={() => {}}
              // onBlur={() => {}}
              required
            />
          </FieldWrapper>
          <FieldWrapper>
            <TextField
              id="postcode"
              type="text"
              placeholder="Postcode"
              // error={touched.postcode && errors.postcode}
              value={values.postcode || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              // onChange={() => {}}
              // onBlur={() => {}}
              required
            />
          </FieldWrapper>

          <input id="sla" type="text" hidden={true} value={values.sla || ""} readOnly/>

          <input id="pid" type="text" hidden={true} value={values.pid || ""} readOnly/>

          <Button
            disabled={isSubmitting}
            type="submit"
            style={{ width: "100%", height: "44px" }}
          >
            <FormattedMessage
              id="savedAddressId"
              defaultMessage="Save Address"
            />
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateOrUpdateAddress;
