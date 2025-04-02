async function fetchExchangeRate(fromCurrency, toCurrency) {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        
        // Get the exchange rate
        const rate = json[fromCurrency][toCurrency];
        
        if (!rate) {
            throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
        }

        console.log(`Exchange rate from ${fromCurrency} to ${toCurrency}: ${rate}`);
        return rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
}

const dropdowns = document.querySelectorAll(".drop select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currcode in countryList) {
        let newOption = document.createElement("option"); 
        newOption.innerText = currcode;
        newOption.value = currcode;
        if (select.name === "from" && currcode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currcode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    if (!countryCode) {
        console.error(`No country code found for ${currCode}`);
        return;
    }

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    
    if (img) {
        img.src = newSrc;
    } else {
        console.error("Flag image element not found.");
    }
};
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === '' || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurr.value.toLowerCase()}.json`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

        if (!rate) {
            throw new Error(`Exchange rate not found for ${fromCurr.value} to ${toCurr.value}`);
        }

        let finalAmount = amtVal * rate;
        
        msg.innerHTML = `<h2>${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}</h2>`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerHTML = "<h2>Error fetching exchange rate.</h2>";
    }
});
