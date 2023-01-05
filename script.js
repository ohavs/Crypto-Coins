let cards = document.getElementById("cards")
let coins = []
let search = document.getElementById("search")
let url = `https://api.coingecko.com/api/v3/coins`
let coinsObj = []
let checkedCoins = []
let modalBtn = document.getElementById("modalBtn")
let closeModal = document.querySelector(".close-modal")
let home = document.getElementById("home")
let about = document.getElementById("about")
// let liveReports = document.getElementById("live-reports")


//pages
about.addEventListener("click", () => {
  document.querySelector(".home").classList.add("hidden")
  // document.querySelector(".liveReports").classList.add("hidden")
  document.querySelector(".about").classList.remove("hidden")
  $(".search-coins-input").attr("disabled", true)
  $(".search-btn").attr("disabled", true)
})

home.addEventListener("click", () => {
  document.querySelector(".home").classList.remove("hidden")
  document.querySelector(".about").classList.add("hidden")
  // document.querySelector(".liveReports").classList.add("hidden")
  $(".search-coins-input").attr("disabled", false)
  $(".search-btn").attr("disabled", false)
})
// liveReports.addEventListener("click", () => {
//   document.querySelector(".home").classList.add("hidden")
//   document.querySelector(".about").classList.add("hidden")
//   $(".search-coins-input").attr("disabled", true)
//   $(".search-btn").attr("disabled", true)
//   document.querySelector(".liveReports").classList.remove("hidden")
// })

//loaders

// $(window).on("load", function () {
//   $(".loader").fadeOut("slow");
// });

setTimeout(() => {
  document.querySelector(".home").classList.remove("hidden")
  document.querySelector(".loader-div").classList.add("hidden")
},1500)

$(window).scroll(function () {
  if ($(this).scrollTop() > 800) {
    $('.top').removeClass('hide');
  } else {
    $('.top').addClass('hide');
  }
});

$('.top').click(function () {
  $('html, body').animate({ scrollTop: 0 }, 100);
  return false;
});

//functions
function getCoins(url) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    beforeSend: function () {
        $(".loader").fadeOut("slow");

    },
    complete: function () {
      $(`.loader`).addClass("hide");
    },
    success: function (data) {
      data.forEach(coin => {
        coin = {
          id: coin.id,
          image: coin.image,
          symbol: coin.symbol,
          name: coin.name,
          checked: false
        }

        coinsObj.push(coin)
        
      })
      console.log(coinsObj);
      createCard(coinsObj)
      loadFromLocalStorage(coinsObj)
     
    },
    error: function (error) {
      console.log("error:", error);
    }
  })

}
getCoins(url)




function filterCoins(search) {
  let coinCards = document.querySelectorAll(".card")
  let count=0
  document.querySelector(".parallax").classList.add("hidden")
  document.querySelector(".select-coins").classList.add("hidden")
  coinCards.forEach(card => {
    card.parentElement.classList.add("hide")
   
    if (card.children[2].children[0].children[0].innerHTML.toLowerCase().includes(search) || card.children[2].children[0].children[1].innerHTML.toUpperCase().includes(search)) {
      // card.classList.remove("hide")
      card.parentElement.classList.remove("hide")
      $(".not-found").addClass("hide")
     
      count+=1
    }if(count===0){
      $(".not-found").removeClass("hide")
    }
    // console.log(card.children[2].children[0].children[0].innerHTML); ////coin name
    // console.log(card.children[2].children[0].children[1].innerHTML);  //// coin code name
  })
  if (search === "") {
    document.querySelector(".parallax").classList.remove("hidden")
  document.querySelector(".select-coins").classList.remove("hidden")

  }
}



function createCard(coinsObj) {
  cards.innerHTML = ``
  coinsObj.forEach(coin => {
    let inputId = coin.id
    let card = document.createElement("div")
    card.innerHTML = `
    <div class="card col rounded-3 ">
    <div class="form-check form-switch ">
    <input onchange="checkCoins(coinsObj,id)" class="form-check-input coinsCheck" type="checkbox" id="${inputId}">
    <label class="form-check-label" for="switch"></label>
    </div>

    <div class="img">
    <img src="${coin.image.large} "
    class="card-img-top coin-img" alt="...">
    </div>
   
    <div class="card-body">
    
    <div class="coin-name">
        <h3 class="card-title">${coin.id}</h3>
        <h5 class="card-symbol">${coin.symbol}</h5>
        <div class="dot-wave hide" id="load${coin.id}">
        <div class="dot-wave__dot"></div>
        <div class="dot-wave__dot"></div>
        <div class="dot-wave__dot"></div>
        <div class="dot-wave__dot"></div>
        </div>
      </div>

      <div class="price hidden">
      <h6 id="usd ${coin.id.toLowerCase()}" class="h6 usd"></h6>
      <h6 id="eur ${coin.id.toLowerCase()}" class="h6 eur"></h6>
      <h6 id="ils ${coin.id.toLowerCase()}" class="h6 ils"></h6>
      </div>

      <button onclick="unHidePrice(id)" type="button" id=${coin.id.toLowerCase()} class="btn btn-primary info mt-3">More Info</button>
      </div>
      </div>
      `
    if (coinsObj[coin] == false) {
      document.querySelectorAll(".coinsCheck").checked = false
    } else if (coinsObj[coin] == true) {
      document.querySelectorAll(".coinsCheck").checked = true
    }
   


    cards.appendChild(card)
    inputId++
  });
}





function unHidePrice(id) {
  let btn = document.querySelectorAll(".info")
  let usd = document.getElementById(`usd ${id}`)
  let eur = document.getElementById(`eur ${id}`)
  let ils = document.getElementById(`ils ${id}`)
  url = `https://api.coingecko.com/api/v3/coins/${id}`
  console.log(url);
  getPrice(url, btn, usd, eur, ils, id)

}

function getPrice(url, btn, usd, eur, ils, id) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    beforeSend: function () {
      $(`#load${id}`).removeClass("hide");
    },
    complete: function () {
      $(`#load${id}`).addClass("hide");
    },
    success: function (data) {
      let prices = {
        usd: data.market_data.current_price.usd,
        eur: data.market_data.current_price.eur,
        ils: data.market_data.current_price.ils
      }
      console.log(prices);
      btn.forEach(button => {
        if (button.id == id) {
          if(button.innerHTML==`More Info`){
            button.innerHTML=`Less Info`
          }
          
         else if(button.innerHTML=`Less Info`){
            button.innerHTML=`More Info`
          }
          button.previousElementSibling.classList.toggle("hidden")
          usd.innerHTML = `USD: ${prices.usd}$`
          eur.innerHTML = `EUR:${prices.eur}€`
          ils.innerHTML = `ILS:${prices.ils}₪`
        }
      })
    },
    error: function (error) {
      console.log("error:", error);
    }
  })
}




function checkCoins(coinsObj, inputId) {
  let coinsToggler = document.querySelectorAll(".coinsCheck") // קלאס של האינפוטים
  let toggledInput = document.getElementById(`${inputId}`) //האינפוט הנבחר
  console.log("input is " + toggledInput.checked);


  coinsToggler.forEach(toggle => {
    toggle.removeAttribute("disabled", "")
  })

  for (let i = 0; i < coinsObj.length; i++) {
    if (coinsObj[i].id == toggledInput.id) {
      coinsObj[i].checked == false ? coinsObj[i].checked = true : coinsObj[i].checked = false
      if (coinsObj[i].checked == true) {
        checkedCoins.push(coinsObj[i])
        saveToLocalStorage(coinsObj[i])
      } 
    }
  }
  if(toggledInput.checked==false){
    console.log(toggledInput);
    for(let i = 0; i < checkedCoins.length; i++){
      if(checkedCoins[i].id == toggledInput.id){
        checkedCoins[i].checked = false
        console.log(checkedCoins[i]);
        checkedCoins.splice(i, 1)
        removeFromLocalStorage(toggledInput)
      }
    }
  }



  console.group("checked coin")
  console.log(checkedCoins);
  if (checkedCoins.length == 5) {
    coinsToggler.forEach(toggle => {
      toggle.setAttribute("enabled", "")
    })
  }
  if (checkedCoins.length > 5) {
    coinsToggler.forEach(toggle => {
      toggle.setAttribute("disabled", "")
      if (toggle.checked == true) {
        toggle.removeAttribute("disabled", "")
      }
    })
    modal(checkedCoins, inputId, coinsObj)
  }

}




function modal(checkedCoins, inputId, coinsObj) {
  // console.group("modal")
  let modalCoins = document.querySelector(".modal-coins")
  modalCoins.innerHTML = ``
  for (let checked in checkedCoins) {
    let modal = document.createElement("div")
    modal.innerHTML = `
    <div class="modal-body" id="modal">
    <h1 class="coin-headline"> ${checkedCoins[checked].id}
    <div class="form-check form-switch ">
    <input onchange="uncheckCoin(coinsObj,id,checkedCoins)" checked class="form-check-input coin-input " type="checkbox" id="${checkedCoins[checked].id}">
    <label class="form-check-label" for="switch"></label>
    </div>
    </h1>
    </div>
    `

    modalCoins.appendChild(modal)


  }

  modalBtn.click()
}

function uncheckCoin(coinsObj, id, checkedCoins) {
  let inputs = document.querySelectorAll(".coinsCheck")
  // console.log(id);
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].id == id) {
      // console.log(inputs[i]);
      if (inputs[i].checked == true) {
        inputs[i].checked = false
        // console.log(inputs[i].checked);
      }
    }
  }



  //change checked status in the coins array
  for (let checkedCoin of coinsObj) {
    if (id == checkedCoin.id) {
      if (checkedCoin.checked == true) {
        checkedCoin.checked = false
      } 
      // else if (checkedCoin.checked == false)
      //   checkedCoin.checked = true
    }
  }





  for (let i = 0; i < checkedCoins.length; i++) {
    if (checkedCoins[i].id == id) {
      // console.log(id);
      // console.log(checkedCoins[i].checked);
      // console.log(checkedCoins[i]);
      if(checkedCoins[i].checked == true){
        checkedCoins[i].checked = false
    
      } 
      if(checkedCoins[i].checked == false){
        removeFromLocalStorage(checkedCoins[i])
        checkedCoins.splice(i, 1)
      }
    }
  }

  let coinsToggler = document.querySelectorAll(".coinsCheck")
  coinsToggler.forEach(toggle => {
    toggle.removeAttribute("disabled", "")
  })
  closeModal.click()
  console.log(checkedCoins);


}




//local storage methods
function saveToLocalStorage(checkedCoin){
  let checkedCoinsArray;
     if(localStorage.getItem("checkedCoinsArray")===null){
         checkedCoinsArray=[];
     }
     else{
         checkedCoinsArray=JSON.parse(localStorage.getItem("checkedCoinsArray"));
        }
        checkedCoinsArray.push(checkedCoin);
        localStorage.setItem("checkedCoinsArray",JSON.stringify(checkedCoinsArray))
        // console.log(checkedCoinsArray);
 }




 
 function loadFromLocalStorage(coinsObj){
  let checkedCoinsArray;
  if(localStorage.getItem("checkedCoinsArray")===null){
      checkedCoinsArray=[];
  }
  else{
      checkedCoinsArray=JSON.parse(localStorage.getItem("checkedCoinsArray"));
      checkedCoins=checkedCoinsArray
       
          let coinsInputs = document.querySelectorAll(".coinsCheck")
          // console.group("local storage coins")
          for(let i=0;i<coinsObj.length;i++){
            for(let j=0;j<checkedCoinsArray.length;j++){
              if(coinsObj[i].id==checkedCoinsArray[j].id){
                coinsObj[i].checked=true
                coinsInputs[i].checked=true
                // console.log(coinsObj[i].id);
                // console.log(coinsInputs[i]);
                      //  console.log(coinsInputs[i].id + " input is " + coinsInputs[i].checked);
              //  console.log(checkedCoinsArray[i] , + " " +"local storage");
              }
            }
          }

  }
}

function removeFromLocalStorage(coinToDelete){
  let checkedCoinsArray;

  if(localStorage.getItem("checkedCoinsArray")===null){
      checkedCoinsArray=[]
  }
  else{
      checkedCoinsArray=JSON.parse(localStorage.getItem("checkedCoinsArray"));
  }

// console.log(coinToDelete.id + " coin to delete");
 for(let i=0;i<checkedCoinsArray.length;i++){
  if(coinToDelete.id==checkedCoinsArray[i].id){
    // console.log(coinToDelete.id);
    checkedCoinsArray.splice(checkedCoinsArray.indexOf(checkedCoinsArray[i]),1);
  }
 }
  // console.log(checkedCoin);
 localStorage.setItem("checkedCoinsArray",JSON.stringify(checkedCoinsArray));
}



function removeAllCoins(){
  let coinsToggler = document.querySelectorAll(".coinsCheck")
  coinsToggler.forEach((coin) => {
    coin.checked=false
    coin.removeAttribute("disabled", "")
  })
  for(let coin of checkedCoins){
    coin.checked=false
  }
  for(let coin of coinsObj){
    coin.checked=false
  }
  checkedCoins.length=0
  localStorage.clear() 
  console.log(checkedCoins);
}

