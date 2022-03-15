const requests = ['description', 'prescription', 'prescription_negative'];

function auEncoding(listAu) {

  listAuEncoded = []
  
  return listAuEncoded
}


function faceExpressionToNaturalLanguage(listAu, feeDictionary, askFor = 'description') {
  const validRequest = askFor in requests;
  if (!validRequest) {
    console.log("Selected type of information does not exist in the dictionary.")
  }
  else if (listAu.length == 0) {
    console.log("The AU list is empty")

  } else {


  }




  return retVal
}

function fee(listAu, targetAuList = None) {

}
