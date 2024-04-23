const check = (el, default_) => (el ? el : default_);
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function loadCard(page, search, country) {
    try {
        let links = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&keyword=${search}&page=${page}&countryCode=${country}`
        let response = await fetch(links);
        response = await response.json();

        console.log(links);

        cont.innerHTML = "";
        pages.innerHTML = createPagination(Number(page), Number(response.page.totalPages) > 49 ? 49 : Number(response.page.totalPages) - 1);

        let data_now = new Date();
        let default_time = `${data_now.getFullYear()}-${data_now.getMonth()}-${data_now.getDay()}`;

        response._embedded.events.forEach((el) => {
            cont.innerHTML += `
                <div class="main__card" style="--from: ${random(-500, 500)}px; --time: ${random(500, 2000)}ms;">
                    <img src="${el.images[0].url}" class="main__card-preview">
                    <h2 class="main__card-title" data-id="${el.id}">${el.name}</h2>
                    <span class="main__card-data">${check(el.dates.start.localDate, default_time)}</span>
                    <span class="main__card-place">${check(el.dates.timezone, "America/New_York")}</span>
                </div>
                `;
        });
    } catch (error) {
        cont.innerHTML = "<h2 class='header__title'>NOT FOUND</h2>"
    }
}

function createPagination(page, totalPages){
  let liTag = '';
  let beforePage = page - 1;
  let afterPage = page + 1;

  if(page > 2) {
    liTag += `<li class="footer__numbers-number">1</li>`;
    if(page > 3){
      liTag += `<li class="footer__numbers-number">...</li>`;
    }
  }

  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }

  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage  = afterPage + 1;
  }

  for (let plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      continue;
    }
    if (plength == 0) {
      plength += 1;
    }
    liTag += `<li class="footer__numbers-number${page == plength ? " active" : ""}">${plength}</li>`;
  }

  if(page < totalPages - 1){
    if(page < totalPages - 2){
      liTag += `<li class="footer__numbers-number">...</li>`;
    }
    liTag += `<li class="footer__numbers-number">${totalPages}</li>`;
  }

  return liTag;
}