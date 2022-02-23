var productList = botContext.getBotVariable("products"); // get the products from the context service
var desiredSize = botContext.getBotVariable("desiredSize"); // get user's desired size
var desiredFilter = botContext.getBotVariable("desiredFilter"); // get if they want to filter by color, style, fit, or design
var desiredDesign = botContext.getBotVariable("desiredDesign"); // get their desired design
var storeURL = botContext.getBotVariable("storeURL");
var carouselSize = 9; // we can set this to 10 max

botContext.printDebugMessage("NUMBER OF PRODUCTS: " + productList.length);
botContext.printDebugMessage("DESIRED SIZE: " + desiredSize);
botContext.printDebugMessage("DESIRED FILTER: " + desiredFilter);
botContext.printDebugMessage("DESIRED DESIGN: " + desiredDesign);


var tileArray = [];
tileArray.length = 0;
var addedItems = [];
// loop over all products
for (var i = 0; i < productList.length; i++) {
  botContext.printDebugMessage("item # " + i);
  botContext.printDebugMessage(productList[i].title);
  // for each product, loop over variants and check if there is one with the desired size and design
  for (var j = 0; j < productList[i].variants.length; j++) {
    if (productList[i].variants[j].option1 == desiredSize && // the variant is in the desired size
        productList[i].variants[j].inventory_quantity > 0 && // the variant is in stock
        addedItems.indexOf(productList[i].id) == -1 && // the product hasn't already been added to the carousel
        productList[i].title.split(' ')[0] == desiredDesign && // the product
        tileArray.length < carouselSize // the carousel isn't already full
       ) {
 // check for image and set it or set a placeholder
      var imageSrc = "";
      if (!productList[i].image) {
        imageSrc = ""; // put a placeholder URL for a product here if necessary
        botContext.printDebugMessage("the product has no image - using placeholder");
      } else if (!productList[i].variants[j].image_id) {
         log("no image associated with this variant");
         imageSrc = ""; // put a placeholder URL for a product here if necessary
        } else if (productList[i].variants[j].image_id) {
          var imageId = productList[i].variants[j].image_id;
          // loop through images to find a match with the variant that is vertical (this store has horizontal and vertical images)
          for (var q = 0; q < productList[i].images.length; q++) {
          if (productList[i].images[q].id == imageId && productList[i].images[q].height > productList[i].images[q].width) {
            log(q);
            imageSrc = productList[i].images[q].src;
            botContext.printDebugMessage("the product has an image");
          }
        }       
      } else {
        imageSrc = ""; // put a placeholder URL for a product here if necessary
      }
      // create the tile
  var tile = {
    type: "vertical",
    elements: []
  };
  // add the image to tile
  log(imageSrc);
  tile.elements.push({
        type: "image",
        url: imageSrc, // this will change once images are added (productList[i].images[0].src)
        click: {
          actions: [
            {
              type: "link",
              uri: storeURL + "/products/" + productList[i].handle + "?variant=" + productList[i].variants[j].id,
              target: "blank"
            }
          ]
        }
      });
  // add the title to tile
  tile.elements.push({
        type: "text",
        style: {
          bold: true,
          size: "large"
        },
        text: productList[i].title + " - " + productList[i].variants[j].option2,
        tooltip: productList[i].title + " - " + productList[i].variants[j].option2
      });
      // add a link to the product to the tile
      tile.elements.push({
        title: "See details",
        type: "button",
        click: {
          actions: [
            {
              type: "link",
              uri: storeURL + "/products/" + productList[i].handle + "?variant=" + productList[i].variants[j].id,
              target: "blank"
            }
          ]
        },
        tooltip: "See detailed info about " + productList[i].title
      });
      // Add an 'add to cart' button which will store the variant ID to later form a dyanamic cart link
      tile.elements.push({
        title: "Add to cart",
        type: "button",
        click: {
          actions: [
            {
              type: "publishText",
              text: "Product #: " + productList[i].variants[j].id
            }
          ]
        },
        tooltip: "Add " + productList[i].title + " to your cart"
      });
  tileArray.push(tile);
  addedItems.push(productList[i].id);
    }
  }
}

var carousel = {
  "padding": 10,
  "type": "carousel",
  "elements": tileArray
};
// handle single length array results
if (tileArray.length == 1) {
  var carouselJson = JSON.stringify(tileArray[0]);
} else {
  var carouselJson = JSON.stringify(carousel);
}
log(carouselJson);
botContext.setBotVariable("carousel", carouselJson, true, false);
botContext.printDebugMessage(tileArray.length);
botContext.printDebugMessage(addedItems);