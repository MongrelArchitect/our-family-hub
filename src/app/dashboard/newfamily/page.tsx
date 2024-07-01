"use client";
import { useState } from "react";

export default function NewFamily() {
  const defaultFormInfo = {
    // we just have one field for now, might want more in the future
    surname: {
      typing: false, // for the input's "moving label" effect
      value: "",
      valid: false,
    },
  };

  const [formInfo, setFormInfo] = useState(defaultFormInfo);

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { id } = target;
    switch (id) {
      // makes it easier to add more fields in the future if needed
      case "surname":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            surname: {
              typing: true,
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      default:
        break;
    }
  };

  const handleFocus = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { id } = target;
    switch (id) {
      // makes it easier to add more fields in the future if needed
      case "surname":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            surname: {
              ...formInfo.surname,
              typing:
                document.activeElement && document.activeElement.id === id
                  ? true
                  : false,
            },
          };
        });
        break;
      default:
        break;
    }
  };

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    // XXX TODO XXX
    // input validation
    try {
      const result = await fetch("/api/families", {
        method: "POST",
        body: JSON.stringify({
          surname: formInfo.surname.value,
        }),
      });
      console.log(await result.json());
      // XXX TODO XXX
      // add loading & redirect
    } catch (err) {
      // XXX TODO XXX
      // show to user
      console.error("Error submitting new family: ", err);
    }
  };

  return (
    <main className="p-2">
      <h2 className="text-2xl">Create New Family</h2>
      <form
        action={""}
        className="flex flex-col gap-4 text-lg"
        onSubmit={submit}
        noValidate
      >
        <div className="relative flex flex-col">
          <label
            className={`${formInfo.surname.typing || formInfo.surname.value ? "-translate-x-1.5 -translate-y-3 scale-75 text-neutral-400" : ""} absolute left-2 top-3 text-neutral-600 transition-all`}
            htmlFor="surname"
          >
            Surname
          </label>
          <input
            className="border-2 border-neutral-600 p-2 pt-4"
            id="surname"
            maxLength={255}
            name="surname"
            onBlur={handleFocus}
            onChange={handleChange}
            onFocus={handleFocus}
            required
            type="text"
            value={formInfo.surname.value || ""}
          />
        </div>
        <button
          className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
          type="submit"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
