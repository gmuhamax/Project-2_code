const apiKey = "Wrom1SFhmivsqr0qBMcV6NJoa0MTYBhn";
const cont = document.querySelector(".container");
const modal = document.querySelector(".modal");
const wrapper_modal = document.querySelector(".wrapper__modal");
const pages = document.querySelector(".footer__numbers");
const header_wrapper = document.querySelector(".header__wrapper");

let request = ""

loadCard("1", request, "");

cont.addEventListener("click", async (e) => {
  if (e.target.className == "main__card-title") {
    let response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${e.target.dataset.id}?apikey=${apiKey}`
    );
    response = await response.json();

    response.priceRanges = response.priceRanges
      ? response.priceRanges
      : [{ min: 0, max: 0, currency: "$" }];

    modal.innerHTML = `
        <img src="${response.images[0].url}" alt="" class="modal__icon">
        <div class="modal__content">
          <img src="${response.images[0].url}" class="modal__preview"></img>
          <div class="modal__texts">
            <h2 class="modal__title">INFO</h2>
            <p class="modal__text">${response.info}</p>
            <h2 class="modal__title">WHEN</h2>
            <p class="modal__text">${response.dates.start.localDate} <br> ${response.dates.start.localTime} (${response.dates.timezone})</p>
            <h2 class="modal__title">WHERE</h2>
            <p class="modal__text">${response.dates.timezone}</p>
            <h2 class="modal__title">PRICES</h2>
            <p class="modal__text">Standart ${response.priceRanges[0].min}-${response.priceRanges[0].max} ${response.priceRanges[0].currency}</p>
            <button class="modal__btn">BUY TICKETS</button>
          </div>
        </div>
        `;

    wrapper_modal.style.display = "flex";
    modal.style.display = "block";
    document.body.style.overflowY = "hidden";
  }
});

wrapper_modal.addEventListener("click", () => {
  wrapper_modal.style.display = "none";
  modal.style.display = "none";
  document.body.style.overflowY = "scroll";
});

pages.addEventListener("click", (e) => {
  if (
    e.target.className == "footer__numbers-number" &&
    e.target.textContent != "..."
  ) {
    loadCard(e.target.textContent, request, "");
  }
});

header_wrapper.search.addEventListener("input", _.debounce(e => {
    request = e.target.value
    loadCard("1", e.target.value, header_wrapper.country.value)
}, 500))