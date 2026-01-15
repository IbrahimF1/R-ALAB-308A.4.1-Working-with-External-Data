import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_Ijm3626aPGtf4RqpQNQnu2XAP1TTUDVnu6om8zcg2PtPY5ajOvdR8rsT28jVywST";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

const headers = new Headers({
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
});

let requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

async function initialLoad() {
  let catResponse = await fetch("https://api.thecatapi.com/v1/breeds", {
    headers: { "x-api-key": API_KEY },
  });
  let catBreeds = await catResponse.json();

  for (let breed of catBreeds) {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  }
  handleBreedSelect();
}

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

async function handleBreedSelect() {
  Carousel.clear();
  infoDump.innerHTML = "";

  let selectedBreedID = breedSelect.value;

  let catResponse = await fetch(
    `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreedID}`,
    { headers: { "x-api-key": API_KEY } }
  );

  let catImages = await catResponse.json();

  for (let imgData of catImages) {
    const carouselItem = Carousel.createCarouselItem(
      imgData.url,
      selectedBreedID,
      imgData.id
    );
    Carousel.appendCarousel(carouselItem);
  }

  if (catImages.length > 0 && catImages[0].breeds.length > 0) {
    const breedInfo = catImages[0].breeds[0];

    // Using a template literal to create the HTML structure
    infoDump.innerHTML = `
      <h3>${breedInfo.name}</h3>
      <hr>
      <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
      <p><strong>Origin:</strong> ${breedInfo.origin}</p>
      <p><strong>Description:</strong> ${breedInfo.description}</p>
      <p><em>Life Span: ${breedInfo.life_span} years</em></p>
    `;
  }

  Carousel.start();
}

breedSelect.addEventListener("change", handleBreedSelect);

initialLoad();
