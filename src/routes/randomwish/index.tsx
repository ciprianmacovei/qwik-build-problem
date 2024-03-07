import { component$, useStore, $ } from "@builder.io/qwik";
import { Button } from "~/style/buttons/button";
import { Modal } from "~/components/modal";
import { TextFormControl } from "~/components/form-controls/text";

interface RandomWishboxState {
  personName: string;
  personArray: string[];
  randomArray: string[];
  santaClausMode: boolean | undefined;
  winnersNumber: string;
  showModal: {
    value: boolean;
  };
  winnersNumberValidation: boolean;
  winnersNumberValidationMessage: string;
}

export default component$(() => {
  const state = useStore<RandomWishboxState>({
    personName: "",
    personArray: [],
    randomArray: [],
    santaClausMode: undefined,
    winnersNumber: "1",
    showModal: {
      value: false,
    },
    winnersNumberValidation: false,
    winnersNumberValidationMessage: "",
  });

  const addPerson = $(() => {
    if (state.personName !== "") {
      state.personArray = [...state.personArray, state.personName];
      state.personName = "";
    }
  });

  const getPersonName = $(async (event: Event) => {
    state.personName = (event.target as HTMLInputElement).value;
    if ((event.target as HTMLInputElement).enterKeyHint) {
      await addPerson();
    }
  });

  const getWinnersNumber = $((event: Event) => {
    const number = Number((event.target as HTMLInputElement).value);
    if (
      number > 1 &&
      Number.isInteger(number) &&
      number < state.personArray.length - 1
    ) {
      state.winnersNumber = (event.target as HTMLInputElement).value;
    } else {
      state.winnersNumberValidation = true;
      state.winnersNumberValidationMessage =
        "Please provide a valid number of winners";
    }
  });

  const openRandModal = $(() => {
    state.showModal = { value: true };
  });

  const getRandomArbitrary = $((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  });

  const randomizePpl = $(async (santaClausMode?: boolean) => {
    state.santaClausMode = santaClausMode;
    let numberOfPeople = state.personArray.length;
    const arrayOfPeople = [...state.personArray];
    while (numberOfPeople >= 1) {
      const randomIndex = await getRandomArbitrary(0, numberOfPeople);
      state.randomArray = [...state.randomArray, arrayOfPeople[randomIndex]];
      arrayOfPeople.splice(randomIndex, 1);
      numberOfPeople--;
    }
    if (!santaClausMode) {
      state.showModal = { value: false };
    }
  });

  const resetRandomisation = $(() => {
    state.randomArray = [];
    state.personArray = [];
  });

  const santaClausRandomization = $(async () => {
    await randomizePpl(true);
  });

  return (
    <>
      <div class="mb-10 flex h-full w-full flex-col items-center justify-center gap-10">
        <div class="font-nuito flex w-[80%] flex-col gap-4 text-center">
          <article class="text-[2rem]">
            Hello, and hohoho, I'm a bit like santaclous, so u can add ppl and
            have 2 options:
          </article>
          <article class="text-[1rem]">
            1. from the list of ppl only the numbers u want to win the reandom
            present will win. You can notify them in app if they have an account
            or via email if u provide a valid email address
          </article>
          <article class="text-[1rem]">
            2. u can make groups so santaclous can be each one of u, if u
            provide a real username or email u will have the option to send an
            email so that your santaclaus can know what present you would like
          </article>
        </div>
        <div class="flex items-center justify-center gap-3">
          <TextFormControl
            hasNoValidation={true}
            id="person"
            name="person"
            label="Add Pers"
            type="text"
            onChangeEvent={getPersonName}
            value={state.personName}
          />
          <Button
            size="sm"
            w="100px"
            h="40px"
            text="Add Pers"
            onClick={addPerson}
            buttonType="button"
          />
        </div>
        <div class="flex flex-col items-center justify-center">
          {state.personArray.length > 0 &&
            state.randomArray.length === 0 &&
            state.personArray.map((person: string, index: number) => (
              <div key={"personid" + index}>
                {index + 1}. {person}
              </div>
            ))}
          {state.randomArray.length > 0 && (
            <div>
              {!state.santaClausMode && <span>And the winners are :</span>}
              {state.randomArray.map((person: string, index: number) => (
                <div key={"personidRandomized" + index}>
                  {!state.santaClausMode ? (
                    <div>
                      {index + 1}.{" "}
                      {index + 1 <= Number(state.winnersNumber) && (
                        <span class="text-red-600">WINNER </span>
                      )}{" "}
                      {person}
                    </div>
                  ) : (
                    <div>
                      {index < state.randomArray.length - 1 &&
                        index % 2 === 0 && (
                          <div class="flex gap-4">
                            <span>{state.randomArray[index]}</span>
                            <span class="text-red-600">{"<->"}</span>
                            <span>{state.randomArray[index + 1]}</span>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {state.personArray.length > 1 && (
          <div class="mt-auto flex gap-4">
            {state.randomArray.length === 0 ? (
              <Button
                text="Randomize"
                onClick={openRandModal}
                buttonType="button"
              />
            ) : (
              <Button
                text="Reset"
                onClick={resetRandomisation}
                buttonType="button"
              />
            )}
            {state.personArray.length % 2 === 0 &&
              state.randomArray.length === 0 && (
                <Button
                  background="red"
                  onClick={santaClausRandomization}
                  text="Secret Santa MODE"
                />
              )}
          </div>
        )}
      </div>
      <Modal title="Randomize" showModal={state.showModal}>
        <section class="flex flex-col gap-10">
          <article>
            <p>How many winners for this randomization?</p>
          </article>
          <article>
            <TextFormControl
              type="text"
              id="number_winners_randomization"
              label="Number of winners"
              name="number_winners_randomization"
              onChangeEvent={getWinnersNumber}
              validationError={state.winnersNumberValidation}
              validationMessage={state.winnersNumberValidationMessage}
              value={state.winnersNumber}
            />
          </article>
          <article class="flex w-full items-center justify-center">
            <Button onClick={randomizePpl} text="Randomize" />
          </article>
        </section>
      </Modal>
    </>
  );
});
