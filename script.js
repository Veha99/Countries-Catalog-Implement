async function getDataAPI() {
  const response = await fetch(
    "https://restcountries.com/v3.1/all"
  );
  const countries = await response.json();
  return countries;
}

getDataAPI()
  .then((data) => {
    countries = data;
    displayCounties(countries);
  })
  .catch((error) => console.error(error));

let currentPage = 1;
const countriesPerPage = 25;
function displayCounties(countries) {
  const countryDisplay = document.getElementById("country_display");
  const startIndex = (currentPage - 1) * countriesPerPage;
  const endIndex = startIndex + countriesPerPage;
  const currentCountries = countries.slice(startIndex, endIndex);

  countryDisplay.innerHTML = "";
  currentCountries.forEach((country, index) => {
    const tr = document.createElement("tr");
    const tdNo = document.createElement("td")
    tdNo.textContent = index + 1;

    const tdFlag = document.createElement("td");
    tdFlag.classList.add("text-center");
    tdFlag.style.cursor = "pointer";
    tdFlag.style.width = "320px";
    tdFlag.setAttribute("data-toggle", "modal");
    tdFlag.setAttribute("data-target", "#countryModal");

    const img = document.createElement("img");
    img.src = country.flags.png;
    img.alt = "Flag";
    tdFlag.appendChild(img);

    const tdName = document.createElement("td");
    tdName.classList.add("text-center");
    tdName.textContent = country.name.official;

    const tdButton = document.createElement("td");
    tdButton.classList.add("text-center");

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-primary");
    btn.setAttribute("data-toggle", "modal");
    btn.setAttribute("data-target", "#countryModal");
    btn.textContent = "View Detail";
    tdButton.appendChild(btn);

    tr.appendChild(tdNo);
    tr.appendChild(tdFlag);
    tr.appendChild(tdName);
    tr.appendChild(tdButton);

    countryDisplay.appendChild(tr);
    tdFlag.addEventListener("click", () => getDetailCountry(country));
    btn.addEventListener("click", () => getDetailCountry(country));
  });

  updatePagination(countries.length);
}

function updatePagination(totalCountries) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalCountries / countriesPerPage);
  for (let page = 1; page <= totalPages; page++) {
    const paginationItem = document.createElement("li");
    paginationItem.classList.add("page-item");

    const paginationLink = document.createElement("a");
    paginationLink.classList.add("page-link");
    paginationLink.href = "#";
    paginationLink.textContent = page;
    paginationLink.addEventListener("click", () => {
      currentPage = page;
      displayCounties(countries);
    });
    
    paginationItem.appendChild(paginationLink);
    pagination.appendChild(paginationItem);
  }

  if(totalCountries <= 25) return pagination.innerHTML = "";
}

function getDetailCountry(country) {
  const countryImg = document.getElementById("country_img");
  const countryTitle = document.getElementById("country_title");
  const countryCCA2 = document.getElementById("cca2");
  const countryCCA3 = document.getElementById("cca3");
  const countryNativeName = document.getElementById("nativeName");
  const countryAltSpellings = document.getElementById("altSpellings");
  const countryIDD = document.getElementById("idd");
  const nativeNameProp = [
    "ara.official",
    "bre.official",
    "ces.official",
    "cym.official",
    "deu.official",
    "eng.official",
    "est.official",
    "fin.official",
    "fra.official",
    "hun.official",
    "hrv.official",
    "ita.official",
    "jpn.official",
    "khm.official",
    "kor.official",
    "nld.official",
    "nor.official",
    "per.official",
    "pol.official",
    "por.official",
    "rus.official",
    "slk.official",
    "spa.official",
    "swe.official",
    "tur.official",
    "urd.official",
    "zho.official",
  ];
  let nativeName;

  for (const lang of nativeNameProp) {
    const value = getProperty(country.name.nativeName, lang);
    if (value) {
      nativeName = value;
      break;
    }
  }

  if (!nativeName) {
    nativeName = "";
  }

  countryImg.src = country.flags.png;
  countryTitle.textContent = country.name.official;
  countryCCA2.textContent = country.cca2;
  countryCCA3.textContent = country.cca3;
  countryNativeName.textContent = nativeName == "" ? "No Native Name" : nativeName;
  countryAltSpellings.textContent = country.altSpellings;
  countryIDD.textContent = Object.keys(country.idd).length === 0 ?  "No Country Calling Codes" : (country.idd.root + country.idd.suffixes);
}

function getProperty(obj, propertyPath) {
  const properties = propertyPath.split(".");
  let value = obj;
  if(value == undefined) return false;
  for (const prop of properties) {
    value = value[prop];
    if (!value) {
      break;
    }
  }
  return value;
}

let countries = [];
function searchCountry() {
  const searchInput = document.getElementById("search_input");

  searchInput.addEventListener("input", () => {
    const filterInput = countries.filter((country) => {
      return country.name.official
        .toLowerCase()
        .includes(searchInput.value.toLocaleLowerCase());
    });
    displayCounties(filterInput);
  });
}
searchCountry();

function sortCountry() {
  const sortSelect = document.getElementById("sortCountry");

  sortSelect.addEventListener("change", () => {
    const searchInput = document.getElementById("search_input");
    const filterInput = countries.filter((country) => {
      return country.name.official
        .toLowerCase()
        .includes(searchInput.value.toLowerCase());
    });
    
    const countrySort = [...filterInput].sort((a, d) => {
      const countryA = a.name.official.toLowerCase();
      const countryD = d.name.official.toLowerCase();

      if (sortSelect.value == "asc") {
        if (countryA < countryD) return -1;
        if (countryA > countryD) return 1;
      } else if (sortSelect.value == "desc") {
        if (countryA < countryD) return 1;
        if (countryA > countryD) return -1;
      }
      return 0;
    });

    displayCounties(countrySort);
  });
}
sortCountry();
