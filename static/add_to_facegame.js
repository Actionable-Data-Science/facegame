const allAUValues = [
  {
    number: 1,
    description: "Inner Brow Raiser",
    region: "Brows",
    code: "AU1",
  },
  {
    number: 2,
    description: "Outer Brow Raiser (unilateral, right side)",
    region: "Brows",
    code: "AU2",
  },
  {
    number: 4,
    description: "Brow Lowerer",
    region: "Brows",
    code: "AU4",
  },
  {
    number: 5,
    description: "Upper Lid Raiser",
    region: "Eyes",
    code: "AU5",
  },
  {
    number: 6,
    description: "Cheek Raiser",
    region: "Cheeks",
    code: "AU6",
  },
  {
    number: 7,
    description: "Lid Tightener",
    region: "Eyes",
    code: "AU7",
  },
  {
    number: 9,
    description: "Nose Wrinkler",
    region: "Nose",
    code: "AU9",
  },
  {
    number: 10,
    description: "Upper Lip Raiser",
    region: "Mouth and Lips",
    code: "AU10",
  },
  {
    number: 11,
    description: "Nasolabial Deepener",
    region: "Cheeks",
    code: "AU11",
  },
  {
    number: 12,
    description: "Lip Corner Puller",
    region: "Mouth and Lips",
    code: "AU12",
  },
  {
    number: 13,
    description: "Cheek Puffer",
    region: "Cheeks",
    code: "AU13",
  },
  {
    number: 14,
    description: "Dimpler",
    region: "Cheeks",
    code: "AU14",
  },
  {
    number: 15,
    description: "Lip Corner Depressor",
    region: "Mouth and Lips",
    code: "AU15",
  },
  {
    number: 16,
    description: "Lower Lip Depressor",
    region: "Mouth and Lips",
    code: "AU16",
  },
  {
    number: 17,
    description: "Chin Raiser",
    region: "Chin",
    code: "AU17",
  },
  {
    number: 18,
    description: "Lip Puckerer",
    region: "Mouth and Lips",
    code: "AU18",
  },
  {
    number: 20,
    description: "Lip Stretcher",
    region: "Mouth and Lips",
    code: "AU20",
  },
  {
    number: 22,
    description: "Lip Funneler",
    region: "Mouth and Lips",
    code: "AU22",
  },
  {
    number: 23,
    description: "Lip Tightener",
    region: "Mouth and Lips",
    code: "AU23",
  },
  {
    number: 24,
    description: "Lip Pressor",
    region: "Mouth and Lips",
    code: "AU24",
  },
  {
    number: 25,
    description: "Lips Part",
    region: "Mouth and Lips",
    code: "AU25",
  },
  {
    number: 26,
    description: "Jaw Drop",
    region: "Mouth and Lips",
    code: "AU26",
  },
  {
    number: 27,
    description: "Mouth Stretch",
    region: "Mouth and Lips",
    code: "AU27",
  },
  {
    number: 28,
    description: "Lip Suck",
    region: "Mouth and Lips",
    code: "AU28",
  },
  {
    number: 41,
    description: "Lid Droop",
    region: "Eyes",
    code: "AU41",
  },
  {
    number: 42,
    description: "Slit",
    region: "Eyes",
    code: "AU42",
  },
  {
    number: 43,
    description: "Eyes Closed",
    region: "Eyes",
    code: "AU43",
  },
  {
    number: 44,
    description: "Squint",
    region: "Eyes",
    code: "AU44",
  },
  {
    number: 45,
    description: "Blink",
    region: "Eyes",
    code: "AU45",
  },
  {
    number: 46,
    description: "Wink",
    region: "Eyes",
    code: "AU46",
  },
  {
    number: 51,
    description: "Head Turn Left",
    region: "Head",
    code: "AU51",
  },
  {
    number: 52,
    description: "Head Turn Right",
    region: "Head",
    code: "AU52",
  },
  {
    number: 53,
    description: "Head Up",
    region: "Head",
    code: "AU53",
  },
  {
    number: 54,
    description: "Head Down",
    region: "Head",
    code: "AU54",
  },
  {
    number: 55,
    description: "Head Tilt Left",
    region: "Head",
    code: "AU55",
  },
  {
    number: 56,
    description: "Head Tilt Right",
    region: "Head",
    code: "AU56",
  },
  {
    number: 57,
    description: "Head Forward",
    region: "Head",
    code: "AU57",
  },
  {
    number: 58,
    description: "Head Back",
    region: "Head",
    code: "AU58",
  },
  {
    number: 61,
    description: "Eyes Turn Left",
    region: "Eyes",
    code: "AU61",
  },
  {
    number: 62,
    description: "Eyes Turn Right",
    region: "Eyes",
    code: "AU62",
  },
  {
    number: 63,
    description: "Eyes Up",
    region: "Eyes",
    code: "AU63",
  },
  {
    number: 64,
    description: "Eyes Down",
    region: "Eyes",
    code: "AU64",
  },
];

function handleFileSelect(evt) {
  var files = evt.target.files;
  for (var i = 0, f; (f = files[i]); i++) {
    if (!f.type.match("image.*")) continue;
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        var image = e.target.result;
        processImage(image); // Pass the image to the processImage function
      };
    })(f);
    reader.readAsDataURL(f);
  }
}

var imageInput = document.getElementById("image-input");
// imageInput.addEventListener('change', handleFileSelect, false);
// imageInput.addEventListener('change', function () {
//     var fileName = this.value.split('\\').pop();
//     // this.nextElementSibling.innerText = fileName;
//
//     // document.querySelector('.custom-file').style.display = 'none';
// });

document.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();
  imageInput.classList.add("is-dragover");
});

document.addEventListener("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
  imageInput.classList.remove("is-dragover");
});

document.addEventListener("drop", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var files = e.dataTransfer.files;
  if (files.length > 0) {
    imageInput.files = files;
    imageInput.classList.remove("is-dragover");
    document.getElementById("add-button").style.display = "block";
    document.querySelector(".custom-file").style.display = "none";
  }
});

function centerPreviewImage() {
  var previewImage = document.getElementById("preview-image");
  var previewSection = document.getElementById("preview-section");
  var previewWidth = previewImage.width;
  var previewHeight = previewImage.height;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var leftPosition = (windowWidth - previewWidth) / 2;
  var topPosition = (windowHeight - previewHeight) / 2;
  previewSection.style.display = "block";
  previewImage.style.left = leftPosition + "px";
  previewImage.style.top = topPosition + "px";
}

imageInput.addEventListener("change", function (e) {
  handleFileSelect(e);
  var file = this.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    document.getElementById("preview-image").src = reader.result;
    centerPreviewImage();
  };
  if (file) {
    reader.readAsDataURL(file);
  }

  document.getElementById("add-button").style.display = "block";
});

function processImage(imageSrc) {
  console.log("Process image called");
  const image = new Image();
  image.onload = () => {
    const ouface = new OUFace(image);
    ouface
      .withActionUnits()
      .startDetection()
      .then((results) => {
        addToForm(results);
      });
  };
  image.src = imageSrc;
}

function addToForm(results) {
  console.log("Add to form called");

  form = document.getElementById("upload-form");

  const activatedValues = results.actionUnits;

  const regions = {
    brows: "Brows",
    eyes: "Eyes",
    nose: "Nose",
    mouth: "Mouth and Lips",
    chin: "Chin",
    head: "Head",
  };

  // Create a container for each face region
  Object.values(regions).forEach((regionName) => {
    const regionContainer = document.createElement("div");
    regionContainer.className = "mb-3"; // Add Bootstrap margin bottom class
    const regionHeader = document.createElement("h5");
    regionHeader.textContent = regionName;
    regionContainer.appendChild(regionHeader);

    // Filter the AU values based on the current face region
    const regionAUs = allAUValues.filter((au) =>
      au.region.includes(regionName)
    );

    // Create checkboxes for the AU values in the current face region
    // JavaScript code to generate checkboxes
    const checkboxesContainer = document.getElementById("checkboxes");

    regionAUs.forEach((au) => {
      const checkboxContainer = document.createElement("div");
      checkboxContainer.className =
        "form-check form-check-inline form-check-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = au.number;
      checkbox.id = `checkbox${au.number}`;
      checkbox.name = `checkbox`; // Assign a unique name to each checkbox

      if (activatedValues.includes(au.number)) {
        checkbox.checked = true;
      }

      checkboxContainer.appendChild(checkbox);

      const label = document.createElement("label");
      label.htmlFor = `${au.number}`;
      label.className = "form-check-label";

      const labelText = `AU${au.number}: ${au.description}`;
      label.appendChild(document.createTextNode(labelText));

      checkboxContainer.appendChild(label);

      checkboxesContainer.appendChild(checkboxContainer);
    });
  });
}
