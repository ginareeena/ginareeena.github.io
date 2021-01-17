/* eslint-disable no-alert */

// const { coffee, totalCPS, producers} = require("./data");

/**************
 *   SLICE 1
 **************/

// const data = require("./data.js");

function updateCoffeeView(coffeeQty) {
  document.getElementById("coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers
    .filter((obj) => coffeeCount >= obj.price / 2)
    .forEach((obj) => (obj.unlocked = true));
}

function getUnlockedProducers(data) {
  let newArr = data.producers.filter((obj) => obj.unlocked === true);
  return newArr;
}

console.log(
  "Check this function we commented it back in cuz it was commented out...:"
);
// function makeDisplayNameFromId(id) {
//   // your code here
//   // let newStr = id[0].toUpperCase + id.slice(1);
//   let newStrArr = id.split("_");
//   return newStrArr.forEach(
//     (x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()
//   );
// }

function capFirstChar(word) {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
}

function makeDisplayNameFromId(id) {
  let newStrArr = id.split("_");
  let capArr = newStrArr.map((x) => capFirstChar(x));

  return capArr.join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let producerContainer = document.getElementById("producer_container");

  producerContainer.innerHTML = "";

  unlockProducers(data.producers, data.coffee);

  let filteredData = data.producers.filter((x) => x.unlocked === true);

  filteredData.forEach((x) =>
    producerContainer.appendChild(makeProducerDiv(x))
  );
}

// we're going to use this to make the divs and append them: makeProducerDiv(producer)

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let producer = data.producers.filter((x) => x.id === producerId);
  return producer[0];
}

function canAffordProducer(data, producerId) {
  // console.log("data before:", data);
  let newData = data.producers.filter((x) => x.id === producerId);
  return data.coffee > newData[0].price;
}

function updateCPSView(cps) {
  let cpsDisplay = document.getElementById("cps");
  cpsDisplay.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let filteredData = data.producers.filter((x) => x.id === producerId);
  //if player can afford the producer:
  if (data.coffee > filteredData[0].price) {
    //increases quantity of the producer by 1
    filteredData[0].qty++;
    // decreases player's coffee by producer's price
    data.coffee -= filteredData[0].price;
    //update's producers price to 125% more if player bought it
    filteredData[0].price = updatePrice(filteredData[0].price);
    //returns true if player was able to afford original price
    data.totalCPS += filteredData[0].cps;
    updateCPSView(data.totalCPS);
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  if (event.target.id) {
    producerName = event.target.id;

    producerId = producerName.slice(4);

    console.log("data:", data);

    if (canAffordProducer(data, producerId)) {
      attemptToBuyProducer(data, producerId);
      renderProducers(data);
      updateCoffeeView(data.coffee);
    } else {
      window.alert("Not enough coffee!");
    }
  }
}

function tick(data) {
  // your code here
  let coffeeCount = (data.coffee += data.totalCPS);
  updateCoffeeView(coffeeCount);

  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");

  producerContainer.addEventListener("click", (event) => {
    // console.log("event.target.tagName:", event.target.tagName);
    // console.log("event", event);
    if (event.target.tagName === "BUTTON") {
      buyButtonClick(event, data);
    }

    // if (event.target.tagName !== "BUTTON" || event.target.id === undefined) {
    //   break;
    // } else {
    //   buyButtonClick(event, data);
    // }
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
