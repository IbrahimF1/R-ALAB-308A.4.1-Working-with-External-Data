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
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

async function initialLoad() {
  const { data: catBreeds } = await axios.get("/breeds");

  for (let breed of catBreeds) {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  }
  handleBreedSelect();
}

async function handleBreedSelect() {
  Carousel.clear();
  infoDump.innerHTML = "";

  let selectedBreedID = breedSelect.value;

  const { data: catImages } = await axios.get("/images/search", {
    params: {
      limit: 10,
      breed_ids: selectedBreedID,
    },
  });

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

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

axios.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };

    console.log(`Request started at: ${config.metadata.startTime}`);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    console.log(`Request to ${response.config.url} took ${duration}ms`);

    return response;
  },
  (error) => {
    const endTime = new Date();
    const duration = endTime - error.config.metadata.startTime;
    console.log(`Request failed after ${duration}ms`);

    return Promise.reject(error);
  }
);

initialLoad();
