const prescriptionDict = {
  1: {
    description: [
      "Inner eyebrows are raised.",
      "Inner part of the eyebrows is pulled upwards",
    ],
    label: "inner brow raiser",
    prescription: ["Raise your inner eyebrows."],
    prescription_negative: [
      "Try not to raise the inner part of your eyebrows.",
    ],
    short_description: ["Inner brows raised."],
    short_prescription: ["Raise inner brows."],
    short_prescription_negative: ["Do not raise inner brows."],
  },
  2: {
    description: [
      "Outer eyebrows are raised.",
      "Outer part of the eyebrows is pulled upwards.",
    ],
    label: "outer brow raiser",
    prescription: ["Raise the outer part of your eyebrows."],
    prescription_negative: [
      "Try not to raise the outer part of your eyebrows.",
    ],
    short_description: ["Outer brows raised."],
    short_prescription: ["Raise outer brows."],
    short_prescription_negative: ["Do not raise outer brows."],
  },
  4: {
    description: [
      "Eyebrows are lowered and pulled together.",
      "Eyebrows are lowered.",
    ],
    label: "brow lowerer",
    prescription: ["Lower your eyebrows and pull them together."],
    prescription_negative: ["Try not to lower your eyebrows."],
    short_description: ["Brows lowered."],
    short_prescription: ["Lower brows."],
    short_prescription_negative: ["Do not lower brows."],
  },
  5: {
    description: ["Upper eyelid is raised."],
    label: "upper lid raiser",
    prescription: ["Raise your upper eyelids.", "Widen your eye aperture."],
    prescription_negative: ["Try not to raise your upper eyelids."],
    short_description: ["Upper eyelids raised."],
    short_prescription: ["Raise upper eyelids."],
    short_prescription_negative: ["Do not raise upper eyelids."],
  },
  6: {
    description: ["The cheeks are raised."],
    label: "cheek raiser",
    prescription: ["Raise your cheeks."],
    prescription_negative: ["Try not to raise your cheeks."],
    short_description: ["Cheeks raised."],
    short_prescription: ["Raise cheeks."],
    short_prescription_negative: ["Do not raise cheeks."],
  },
  7: {
    description: ["Eyelids are tightened."],
    label: "lid tightener",
    prescription: ["Tighten your eyelids.", "Narrow your eye aperture."],
    prescription_negative: ["Try not to tighten your eyelids."],
    short_description: ["Eyelids tightened."],
    short_prescription: ["Tighten eyelids."],
    short_prescription_negative: ["Do not tighten eyelids."],
  },
  9: {
    description: ["The skin around the nose is pulled upwards and wrinkled."],
    label: "nose wrinkler",
    prescription: ["Wrinkle your nose by pulling the skin around it upwards."],
    prescription_negative: ["Try not to wrinkle your nose."],
    short_description: ["Nose wrinkled."],
    short_prescription: ["Wrinkle nose."],
    short_prescription_negative: ["Do not wrinkle nose."],
  },
  10: {
    description: ["Upper lip is raised."],
    label: "upper lip raiser",
    prescription: ["Raise your upper lip."],
    prescription_negative: ["Try not to raise your upper lip."],
    short_description: ["Upper lip raised."],
    short_prescription: ["Raise upper lip."],
    short_prescription_negative: ["Do not raise upper lip."],
  },
  11: {
    description: [
      "Muscles next to the nose wings are deepened.",
      "Nasolabial furrows are deepened.",
    ],
    label: "nasolabial deepener",
    prescription: ["Deepen the muscles next to the nose wings."],
    prescription_negative: [
      "Try not to deepen the muscles next to the nose wings.",
    ],
    short_description: ["Muscles next to nose wings deepened."],
    short_prescription: ["Deepen muscles next to nose wings."],
    short_prescription_negative: ["Do not deepen muscles next to nose wings."],
  },
  12: {
    description: ["Lip corners are pulled back and upwards."],
    label: "lip corner puller",
    prescription: [
      "Pull the corners of your lips back and upwards.",
      "Smile more.",
    ],
    prescription_negative: [
      "Try not to pull the corners of your lips back and upwards.",
    ],
    short_description: ["Lip corners pulled back and upwards."],
    short_prescription: ["Pull lip corners back and upwards."],
    short_prescription_negative: ["Do not pull lip corners back and upwards."],
  },
  13: {
    description: [
      "The cheeks are evidently puffed out.",
      "Corner of the lips are pulled up at a sharp angle.",
    ],
    label: "cheek puffer",
    prescription: [
      "Pull the corners of your lips up at a sharp angle to puff your cheeks out.",
    ],
    prescription_negative: [
      "Try not to pull the corners of your lips up sharply so that your cheeks do not puff out.",
    ],
    short_description: ["Cheeks puffed out."],
    short_prescription: ["Puff out cheeks."],
    short_prescription_negative: ["Do not puff out cheeks."],
  },
  14: {
    description: [
      "Corners of the mouth are tightened.",
      "Dimples appear on the cheek, next to the lip corners.",
    ],
    label: "dimpler",
    prescription: [
      "Tighten the corners of your mouth to cause dimples to appear on your cheek.",
      "Press your cheeks against your teeth to cause dimples to appear on your cheek.",
    ],
    prescription_negative: [
      "Try not to tighten the corners of your mouth so that no dimple appears on your cheeks.",
      "Try not to press your cheeks against your teeth so that no dimple appears on your cheek.",
    ],
    short_description: ["Dimples appear."],
    short_prescription: ["Tighten mouth corners to display dimples."],
    short_prescription_negative: [
      "Do not tighten mouth corners to hide dimples.",
    ],
  },
  15: {
    description: ["Lip corners are pulled down."],
    label: "lip corner depressor",
    prescription: ["Pull the corners of your lips down."],
    prescription_negative: ["Try not to pull the corners of your lips down."],
    short_description: ["Lip corners pulled down."],
    short_prescription: ["Pull down lip corners."],
    short_prescription_negative: ["Do not pull down lip corners."],
  },
  16: {
    description: ["The lower lip is pulled down."],
    label: "lower lip depressor",
    prescription: ["Pull down your lower lip."],
    prescription_negative: ["Try not to pull down your lower lip."],
    short_description: ["Lower lip pulled down."],
    short_prescription: ["Pull down lower lip."],
    short_prescription_negative: ["Do not pull down lower lip."],
  },
  17: {
    description: ["Lower lip and the chin are raised."],
    label: "chin raiser",
    prescription: ["Push your lower lip and chin upwards."],
    prescription_negative: ["Try not to push your lower lip and chin upwards."],
    short_description: ["Chin raised."],
    short_prescription: ["Raise chin."],
    short_prescription_negative: ["Do not raise chin."],
  },
  20: {
    description: ["Lip corners are pulled sideways.", "Lips are stretched."],
    label: "lip stretcher",
    prescription: [
      "Stretch your lips sideways.",
      "Pull the corners of your lips sideways.",
    ],
    prescription_negative: [
      "Try not to stretch your lips sideways.",
      "Try not to pull the corners of your lips sideways.",
    ],
    short_description: ["Lip stretched sideways."],
    short_prescription: ["Stretch lip sideways."],
    short_prescription_negative: ["Do not stretch lip sideways."],
  },
  23: {
    description: ["Lips are tightened."],
    label: "lip tightener",
    prescription: ["Tighten your lips; make them thin."],
    prescription_negative: ["Try not to tighten your lips."],
    short_description: ["Lips tightened."],
    short_prescription: ["Tighten lips."],
    short_prescription_negative: ["Do not tighten lips."],
  },
  24: {
    description: ["Lips are pressed together."],
    label: "lip pressor",
    prescription: ["Press your lips together."],
    prescription_negative: ["Try not to press your lips together."],
    short_description: ["Lips pressed together."],
    short_prescription: ["Press lips together."],
    short_prescription_negative: ["Do not press lips together."],
  },
  25: {
    description: ["Lips part."],
    label: "lips part",
    prescription: ["Part your lips."],
    prescription_negative: ["Try not to part your lips."],
    short_description: ["Lips part."],
    short_prescription: ["Part lips."],
    short_prescription_negative: ["Do not part lips."],
  },
  26: {
    description: ["The jaw is dropped."],
    label: "jaw drop",
    prescription: ["Relax your mouth and let your jaw drop."],
    prescription_negative: ["Try not to drop your jaw."],
    short_description: ["Jaw dropped."],
    short_prescription: ["Let jaw drop."],
    short_prescription_negative: ["Do not let jaw drop."],
  },
  27: {
    description: ["Mouth is stretched and open."],
    label: "mouth stretch",
    prescription: ["Stretch open your mouth."],
    prescription_negative: ["Try not to stretch your mouth open."],
    short_description: ["Mouth streched open."],
    short_prescription: ["Stretch open mouth."],
    short_prescription_negative: ["Do not stretch open mouth."],
  },
  28: {
    description: ["Lips are sucked in."],
    label: "lip suck",
    prescription: ["Suck your lips in.", "Pull your lips into your mouth."],
    prescription_negative: ["Try not to suck your lips in."],
    short_description: ["Lips sucked in."],
    short_prescription: ["Suck lips in."],
    short_prescription_negative: ["Do not suck lips in."],
  },
  43: {
    description: ["Eyes are closed."],
    label: "eyes closed",
    prescription: ["Close your eyes.", "Close your eyes more."],
    prescription_negative: ["Try not to close your eyes."],
    short_description: ["Eyes closed."],
    short_prescription: ["Close eyes."],
    short_prescription_negative: ["Do not close eyes."],
  },
};

const feeDictionary = {
  cheeks: {
    "00": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "01": {
      au: "AU13",
      label: "cheek puffer",
      description: [
        "The cheeks are evidently puffed out.",
        "Corner of the lips are pulled up at a sharp angle.",
      ],
      prescription: [
        "Pull the corners of your lips up at a sharp angle to puff your cheeks out.",
      ],
      prescription_negative: [
        "Try not to pull the corners of your lips up sharply so that your cheeks do not puff out.",
      ],
    },
    10: {
      au: "AU6",
      label: "cheek raiser",
      description: ["The cheeks are raised."],
      prescription: ["Raise your cheeks."],
      prescription_negative: ["Try not to raise your cheeks."],
    },
    11: {
      au: "AU6, AU13",
      label: "cheek raiser, cheek puffer",
      description: ["The cheeks are both raised and puffed out."],
      prescription: [
        "Raise your cheeks, and pull the corners of your lips upward to puff your cheeks out.",
      ],
      prescription_negative: [
        "Try not to raise your cheeks, and not to ouff out your cheeks.",
      ],
    },
  },
  eyebrows: {
    "000": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "001": {
      au: "AU4",
      label: "brow lowerer",
      description: [
        "Eyebrows are lowered and pulled together.",
        "Eyebrows are lowered.",
      ],
      prescription: ["Lower your eyebrows and pull them together."],
      prescription_negative: ["Try not to lower your eyebrows."],
    },
    "010": {
      au: "AU2",
      label: "outer brow raiser",
      description: [
        "Outer eyebrows are raised.",
        "Outer part of the eyebrows is pulled upwards.",
      ],
      prescription: ["Raise the outer part of your eyebrows."],
      prescription_negative: [
        "Try not to raise the outer part of your eyebrows.",
      ],
    },
    "011": {
      au: "AU2, AU4",
      label: "outer brow raiser, brow lowerer",
      description: ["Outer eyebrows are raised, and inner brows are lowered."],
      prescription: ["Raise your eyebrows, and lower the inner brows."],
      prescription_negative: [
        "Try not to raise the outer part of the eyebrows, and not to lower the inner part of the eyebrows.",
      ],
    },
    100: {
      au: "AU1",
      label: "inner brow raiser",
      description: [
        "Inner eyebrows are raised.",
        "Inner part of the eyebrows is pulled upwards",
      ],
      prescription: ["Raise your inner eyebrows."],
      prescription_negative: [
        "Try not to raise the inner part of your eyebrows.",
      ],
    },
    101: {
      au: "AU1, AU4",
      label: "inner brow raiser, brow lowerer",
      description: [
        "Inner eyebrows are raised and pulled together, and the outer eyebrows are lowered.",
      ],
      prescription: [
        "Raise your inner eyebrows and pull them together while lowering the outer parts of the eyebrows.",
      ],
      prescription_negative: [
        "Try not to raise your inner eyebrows, and not to lower the outer part of your eyebrows.",
      ],
    },
    110: {
      au: "AU1, AU2",
      label: "",
      description: ["Entire eyebrow is pulled upwards."],
      prescription: ["Lift your eyebrows up."],
      prescription_negative: ["Try not to lift your eyebrows."],
    },
    111: {
      au: "AU1, AU2, AU4",
      label: "",
      description: [
        "Entire eyebrow is pulled upwards, and the eyebrows are pulled together.",
      ],
      prescription: ["Lift your eyebrows up and pull them together."],
      prescription_negative: [
        "Try not to lift your eyebrows and not to pull them together.",
      ],
    },
  },
  eyelids: {
    "000": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "001": {
      au: "AU43",
      label: "eyes closed",
      description: ["Eyes are closed."],
      prescription: ["Close your eyes.", "Close your eyes more."],
      prescription_negative: ["Try not to close your eyes."],
    },
    "010": {
      au: "AU7",
      label: "lid tightener",
      description: ["Eyelids are tightened."],
      prescription: ["Tighten your eyelids.", "Narrow your eye aperture."],
      prescription_negative: ["Try not to tighten your eyelids."],
    },
    "011": {
      au: "AU7, AU43",
      label: "lid tightener, eyes closed",
      description: ["Eyes are closed, and eyelids are tightened."],
      prescription: ["Close your eyes and tighten your eyelids."],
      prescription_negative: [
        "Try not to close your eyes, and not to tighten your eyelids.",
      ],
    },
    100: {
      au: "AU5",
      label: "upper lid raiser",
      description: ["Upper eyelid is raised."],
      prescription: ["Raise your upper eyelids.", "Widen your eye aperture."],
      prescription_negative: ["Try not to raise your upper eyelids."],
    },
    101: {
      au: "AU5, AU43",
      label: "upper lid raiser, eyes closed",
      description: ["ANOMALY: AU5 @ AU43"],
      prescription: ["ANOMALY: AU5 @ AU43"],
      prescription_negative: ["ANOMALY: AU5 @ AU43"],
    },
    110: {
      au: "AU5, AU7",
      label: "upper lid raiser, lid tightener",
      description: [
        "Upper eyelids are raised and the lower lids are tightened.",
      ],
      prescription: [
        "Raise your upper eyelids and then tighten the lower lids.",
      ],
      prescription_negative: [
        "Try not to raise your upper eyelids, and not to tighten the lower lids.",
      ],
    },
    111: {
      au: "AU5, AU7, AU43",
      label: "upper lid raiser, lid tightener, eyes closed",
      description: ["ANOMALY: AU5 @ AU43"],
      prescription: ["ANOMALY: AU5 @ AU43"],
      prescription_negative: ["ANOMALY: AU5 @ AU43"],
    },
  },
  lips: {
    "000": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "001": {
      au: "AU16",
      label: "lower lip depressor",
      description: ["The lower lip is pulled down."],
      prescription: ["Pull down your lower lip."],
      prescription_negative: ["Try not to pull down your lower lip."],
    },
    "010": {
      au: "AU15",
      label: "lip corner depressor",
      description: ["Lip corners are pulled down."],
      prescription: ["Pull the corners of your lips down."],
      prescription_negative: ["Try not to pull the corners of your lips down."],
    },
    "011": {
      au: "AU15, AU16",
      label: "lip corner depressor, lower lip depressor",
      description: ["The lower lips and the lip corners are pulled down."],
      prescription: ["Pull down your lower lips and lip corners."],
      prescription_negative: [
        "Try not to pull down your lower lips and lip corners.",
      ],
    },
    100: {
      au: "AU10",
      label: "upper lip raiser",
      description: ["Upper lip is raised."],
      prescription: ["Raise your upper lip."],
      prescription_negative: ["Try not to raise your upper lip."],
    },
    101: {
      au: "AU10, AU16",
      label: "upper lip raiser, lower lip depressor",
      description: ["Upper lip is raised, and lower lip is pulled down."],
      prescription: ["Raise your upper lip, and pull down your lower lip."],
      prescription_negative: [
        "Try not to raise your upper lip, and not to pull down your lower lip.",
      ],
    },
    110: {
      au: "AU10, AU15",
      label: "upper lip raiser, lip corner depressor",
      description: ["Upper lip is raised, and lip corners are pulled down."],
      prescription: [
        "Raise your upper lip, and pull down the corners of your lips.",
      ],
      prescription_negative: [
        "Try not to raise your upper lip, and not to pull down the corners of your lips.",
      ],
    },
    111: {
      au: "AU10, AU15, AU16",
      label: "upper lip raiser, lip corner depressor, lower lip depressor",
      description: [
        "The lower lips and the lip corners are pulled down, and the upper lip is raised.",
      ],
      prescription: [
        "Pull down your lower lips and lip corners, and raise your upper lip.",
      ],
      prescription_negative: [
        "Try not to pull down your lower lips and lip corners, and not to raise your upper lip.",
      ],
    },
  },
  chin_nose: {
    "00": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "01": {
      au: "AU17",
      label: "chin raiser",
      description: ["Lower lip and the chin are raised."],
      prescription: ["Push your lower lip and chin upwards."],
      prescription_negative: [
        "Try not to push your lower lip and chin upwards.",
      ],
    },
    10: {
      au: "AU9",
      label: "nose wrinkler",
      description: ["The skin around the nose is pulled upwards and wrinkled."],
      prescription: [
        "Wrinkle your nose by pulling the skin around it upwards.",
      ],
      prescription_negative: ["Try not to wrinkle your nose."],
    },
    11: {
      au: "AU9, AU17",
      label: "nose wrinkler, chin raiser",
      description: ["Nose is wrinkled, and the chin is also pulled upwards."],
      prescription: ["Wrinkle your nose, and raise your chin."],
      prescription_negative: [
        "Try not to wrinkle your nose, and not to raise your chin.",
      ],
    },
  },
  mouth: {
    "000": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "001": {
      au: "AU27",
      label: "mouth stretch",
      description: ["Mouth is stretched and open."],
      prescription: ["Stretch open your mouth."],
      prescription_negative: ["Try not to stretch your mouth open."],
    },
    "010": {
      au: "AU26",
      label: "jaw drop",
      description: ["The jaw is dropped."],
      prescription: ["Relax your mouth and let your jaw drop."],
      prescription_negative: ["Try not to drop your jaw."],
    },
    "011": {
      au: "AU26, AU27",
      label: "jaw drop, mouth stretch",
      description: ["ANOMALY: 26@27"],
      prescription: ["ANOMALY: 26@27"],
      prescription_negative: ["ANOMALY: 26@27"],
    },
    100: {
      au: "AU25",
      label: "lips part",
      description: ["Lips part."],
      prescription: ["Part your lips."],
      prescription_negative: ["Try not to part your lips."],
    },
    101: {
      au: "AU25, AU27",
      label: "lips part, mouth stretch",
      description: ["Mouth is strecthed open, and lips are wide apart."],
      prescription: ["Stretch open your mouth, and part your lips widely."],
      prescription_negative: [
        "Try not to stretch open your mouth, and not to part your lips.",
      ],
    },
    110: {
      au: "AU25, AU26",
      label: "lips part, jaw drop",
      description: ["The jaw is dropped, and the lips are part."],
      prescription: ["Let your jaw drop, and part your lips."],
      prescription_negative: [
        "Try not to let your jaw drop, and not to part your lips.",
      ],
    },
    111: {
      au: "AU25, AU26, AU27",
      label: "lips part, jaw drop, mouth stretch",
      description: ["ANOMALY: 26@27"],
      prescription: ["ANOMALY: 26@27"],
      prescription_negative: ["ANOMALY: 26@27"],
    },
  },
  horizontal: {
    "00": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "01": {
      au: "AU14",
      label: "dimpler",
      description: [
        "Corners of the mouth are tightened.",
        "Dimples appear on the cheek, next to the lip corners.",
      ],
      prescription: [
        "Tighten the corners of your mouth to cause dimples to appear on your cheek.",
        "Press your cheeks against your teeth to cause dimples to appear on your cheek.",
      ],
      prescription_negative: [
        "Try not to tighten the corners of your mouth so that no dimple appears on your cheeks.",
        "Try not to press your cheeks against your teeth so that no dimple appears on your cheek.",
      ],
    },
    10: {
      au: "AU20",
      label: "lip stretcher",
      description: ["Lip corners are pulled sideways.", "Lips are stretched."],
      prescription: [
        "Stretch your lips sideways.",
        "Pull the corners of your lips sideways.",
      ],
      prescription_negative: [
        "Try not to stretch your lips sideways.",
        "Try not to pull the corners of your lips sideways.",
      ],
    },
    11: {
      au: "AU14, AU20",
      label: "dimpler, lip stretcher",
      description: ["Lips are stretched, and dimples appear on the cheek."],
      prescription: [
        "Stretch your lips sideways, and tighten the corners of your lips to cause dimples to appear.",
      ],
      prescription_negative: [
        "Try not to stretch your lips sideways, and not to tighten the corners of your lips.",
      ],
    },
  },
  oblique: {
    "00": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "01": {
      au: "AU12",
      label: "lip corner puller",
      description: ["Lip corners are pulled back and upwards."],
      prescription: [
        "Pull the corners of your lips back and upwards.",
        "Smile more.",
      ],
      prescription_negative: [
        "Try not to pull the corners of your lips back and upwards.",
      ],
    },
    10: {
      au: "AU11",
      label: "nasolabial deepener",
      description: [
        "Muscles next to the nose wings are deepened.",
        "Nasolabial furrows are deepened.",
      ],
      prescription: ["Deepen the muscles next to the nose wings."],
      prescription_negative: [
        "Try not to deepen the muscles next to the nose wings.",
      ],
    },
    11: {
      au: "AU11, AU12",
      label: "nasolabial deepener, lip corner puller",
      description: [
        "Lip corners are pulled back and upwards, and the muscles next to the nose wings are deepened.",
      ],
      prescription: [
        "Smile more, and deepen the muscles next to your nose wings.",
      ],
      prescription_negative: [
        "Try not to pull the corners of your lips back and upwards, and not to deepen the muscles next to your nose wings.",
      ],
    },
  },
  orbital: {
    "000": {
      au: "",
      label: "",
      description: [""],
      prescription: [""],
      prescription_negative: [""],
    },
    "001": {
      au: "AU28",
      label: "lip suck",
      description: ["Lips are sucked in."],
      prescription: ["Suck your lips in.", "Pull your lips into your mouth."],
      prescription_negative: ["Try not to suck your lips in."],
    },
    "010": {
      au: "AU24",
      label: "lip pressor",
      description: ["Lips are pressed together."],
      prescription: ["Press your lips together."],
      prescription_negative: ["Try not to press your lips together."],
    },
    "011": {
      au: "AU24, AU28",
      label: "lip pressor, lip suck",
      description: ["Lips are sucked in and pressed together."],
      prescription: ["Press your lips together, and suck your lips in."],
      prescription_negative: [
        "Try not to press your lips together, and not to suck your lips in.",
      ],
    },
    100: {
      au: "AU23",
      label: "lip tightener",
      description: ["Lips are tightened."],
      prescription: ["Tighten your lips; make them thin."],
      prescription_negative: ["Try not to tighten your lips."],
    },
    101: {
      au: "AU23, AU28",
      label: "lip tightener, lip suck",
      description: ["Lips are tightened and sucked in."],
      prescription: ["Tighten your lips, and suck your lips in."],
      prescription_negative: [
        "Try not to tighten your lips, and not to suck your lips in.",
      ],
    },
    110: {
      au: "AU23, AU24",
      label: "lip tightener, lip pressor",
      description: ["Lips are tightened and pressed together."],
      prescription: ["Tighten your lips, and press them together."],
      prescription_negative: [
        "Try not to tighten your lips, and not to press them together.",
      ],
    },
    111: {
      au: "AU23, AU24, AU28",
      label: "lip tightener, lip pressor, lip suck",
      description: ["Lips are tightened, pressed together, and sucked in."],
      prescription: [
        "Tighten your lips, press them together, and suck them in.",
      ],
      prescription_negative: [
        "Try not to tighten your lips, not to press them together, and not to suck them in.",
      ],
    },
  },
};

// Supported AUs 1, 2, 4, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 20, 23, 24, 25,
// 26, 28, 43

const auLandmarkMap2 = {
  1: [21],
  2: [18],
  4: [19],
  6: [40, 40, 40, 40, 41, 41, 41, 41, 6], // updated
  5: [44],
  7: [44], // updated
  9: [32, 32, 32, 50],
  10: [50, 52], // updated
  11: [30, 30, 35, 35, 16], // updated
  12: [48],
  14: [48, 48, 48, 48, 3, 4], // updated
  15: [48, 48, 48, 48, 4, 5],
  16: [57],
  17: [8],
  18: [62],
  20: [48],
  22: [62],
  23: [48],
  24: [51],
  25: [51, 57],
  26: [8],
  27: [57],
  28: [62],
  41: [43],
  42: [43],
  43: [37],
  44: [37],
  45: [37],
  46: [37],
};

class FaceVisualizer {
  _visualizationCanvas;
  _visualizationCanvasContext;
  _actionUnitOn;
  _actionUnitDifferenceOn;
  _landmarks;
  _booked;

  constructor(width, height, landmarks) {
    this._visualizationCanvas = document.createElement("canvas");
    this._visualizationCanvas.width = width;
    this._visualizationCanvas.height = height;
    this._visualizationCanvasContext =
      this._visualizationCanvas.getContext("2d");
    this._actionUnitOn = false;
    this._actionUnitDifferenceOn = false;
    this._landmarks = landmarks;
    this._booked = [];
  }

  drawOnCanvas(canvas) {
    const destCtx = canvas.getContext("2d");
    destCtx.drawImage(this._visualizationCanvas, 0, 0);
  }

  analyzeImageAnimation(canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const scannerWidth = 2;
    const scannerSpeed = 10;
    const landmarks = this._landmarks; // Assuming landmarks are accessible

    let scannerPosition = 0;
    const detectedLandmarks = new Set(); // Store the landmarks that have been detected

    const drawLandmark = (landmark) => {
      const distance = Math.abs(landmark._x - scannerPosition); // Calculate the distance from the scanner line
      const maxDistance = width / 2; // Maximum distance for full opacity
      const alpha = 1 - distance / maxDistance; // Calculate the alpha value based on the distance

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // Use alpha value for fading effect
      ctx.fillRect(landmark._x, landmark._y, 2, 2);
    };

    const animate = () => {
      scannerPosition += scannerSpeed;
      if (scannerPosition > width) {
        // Stop the animation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawOnCanvas(canvas);
        return this;
      }

      ctx.clearRect(0, 0, width, height); // Clear the entire canvas

      for (const landmark of landmarks) {
        if (landmark._x <= scannerPosition) {
          drawLandmark(landmark); // Draw the landmarks that have been detected by the scanner
          detectedLandmarks.add(landmark); // Add the landmark to the detectedLandmarks set
        }
      }

      // Draw the glowing green scanner line
      const gradient = ctx.createLinearGradient(
        scannerPosition,
        0,
        scannerPosition + scannerWidth,
        0
      );
      gradient.addColorStop(0, "rgba(0, 255, 0, 0.5)");
      gradient.addColorStop(0.5, "rgba(0, 255, 0, 1)");
      gradient.addColorStop(1, "rgba(0, 255, 0, 0.5)");

      ctx.fillStyle = gradient;
      ctx.fillRect(scannerPosition, 0, scannerWidth, height);

      requestAnimationFrame(animate);
    };

    animate(); // Start the animation

    return this; // Return the instance for chaining
  }

  visualizeActionUnits(actionUnits) {
    if (!this._actionUnitDifferenceOn) {
      this._actionUnitOn = true;
    } else {
      throw Error("Can not visualize AUs and AU Difference at the same time");
    }

    this.drawAUs(actionUnits, actionUnits, this._landmarks, true);

    return this;
  }

  visualizeActionUnitDifference(actionUnits, targetActionUnits) {
    if (!this._actionUnitOn) {
      this._actionUnitDifferenceOn = true;
    } else {
      throw Error("Can not visualize AUs and AU Difference at the same time");
    }

    this.drawAUs(targetActionUnits, actionUnits, this._landmarks, false);

    return this;
  }

  visualizeTargetAUs(targetActionUnits) {
    this._visualizationCanvasContext.fillStyle = "white";
    this._visualizationCanvasContext.font = `${10}pt Monospace`;
    this._visualizationCanvasContext.fillText(
      "Expected: " + targetActionUnits,
      30,
      30
    );
    return this;
  }

  visualizeDetectedAUs(actionUnits) {
    this._visualizationCanvasContext.fillStyle = "white";
    this._visualizationCanvasContext.font = `${10}pt Monospace`;
    this._visualizationCanvasContext.fillText(
      "Detected: " + actionUnits,
      30,
      50
    );
    return this;
  }

  visualizeJaccardIndex(actionUnits, targetActionUnits) {
    const score = this.calculateJaccardIndex(actionUnits, targetActionUnits);
    this._visualizationCanvasContext.fillStyle = "white";
    this._visualizationCanvasContext.font = `${30}pt Monospace`;
    this._visualizationCanvasContext.fillText(
      "Score: " + score.toString(),
      150,
      320
    );
    return this;
  }

  calculateJaccardIndex(actionUnits, targetActionUnits) {
    const set1 = new Set(actionUnits);
    const set2 = new Set(targetActionUnits);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    const score = intersection.size / union.size;
    return (score * 100).toFixed(0);
  }

  visualizeFaceLandmarks() {
    this.drawLandmarks();
    return this;
  }

  drawLandmarks() {
    this._visualizationCanvasContext.fillStyle = "white";
    this._landmarks.forEach((landmark) => {
      this._visualizationCanvasContext.fillRect(landmark._x, landmark._y, 2, 2);
    });
  }

  visualizeFaceBoundingBox(faceBoundingBox) {
    this._visualizationCanvasContext.fillStyle = "red";
    this._visualizationCanvasContext.strokeRect(
      faceBoundingBox._x,
      faceBoundingBox._y,
      faceBoundingBox._width,
      faceBoundingBox._height
    );
    return this;
  }

  visualizeAge(age) {
    this._visualizationCanvasContext.fillStyle = "black";
    this._visualizationCanvasContext.font = `${10}pt Monospace`;
    this._visualizationCanvasContext.fillText("Age: " + age.toString(), 10, 20);
    return this;
  }

  visualizeEmotion(emotion) {
    this._visualizationCanvasContext.fillStyle = "black";
    this._visualizationCanvasContext.font = `${10}pt Monospace`;
    const maxEmotion = Object.keys(emotion).reduce(function (a, b) {
      return emotion[a] > emotion[b] ? a : b;
    });
    this._visualizationCanvasContext.fillText(
      "Emotion: " + maxEmotion.toString(),
      10,
      40
    );
    return this;
  }

  visualizeGender(gender) {
    this._visualizationCanvasContext.fillStyle = "black";
    this._visualizationCanvasContext.font = `${10}pt Monospace`;
    this._visualizationCanvasContext.fillText(
      ", Gender: " + gender.toString(),
      70,
      20
    );
    return this;
  }

  checkAUs(activeAUs, targetAUs) {
    const falsePositiveAUs = [];
    const falseNegativeAUs = [];
    const correctAUs = [];
    targetAUs.forEach((au) => {
      if (!activeAUs.includes(au)) {
        falseNegativeAUs.push(au);
      }
    });
    activeAUs.forEach((au) => {
      if (!targetAUs.includes(au)) {
        falsePositiveAUs.push(au);
      }
    });

    targetAUs.forEach((au) => {
      if (activeAUs.includes(au)) {
        correctAUs.push(au);
      }
    });

    return {
      falsePositive: falsePositiveAUs,
      falseNegative: falseNegativeAUs,
      correct: correctAUs,
    };
  }

  drawAUs(goldActionUnits, userActionUnits, landmarks, drawCorrectAUs) {
    // console.log("Landmarks", landmarks)

    const checkedAUs = this.checkAUs(userActionUnits, goldActionUnits);
    const falseNegativeAUs = checkedAUs["falseNegative"];
    const falsePositiveAUs = checkedAUs["falsePositive"];
    const correctAUs = checkedAUs["correct"];

    const combinedActionUnits = userActionUnits.concat(goldActionUnits);
    const uniqueActionUnits = [...new Set(combinedActionUnits)];
    const actionUnits = this.sortAUsByLocations(uniqueActionUnits, landmarks);

    actionUnits.forEach((actionUnit) => {
      const drawType = falseNegativeAUs.includes(actionUnit)
        ? "short_prescription"
        : falsePositiveAUs.includes(actionUnit)
        ? "short_prescription_negative"
        : "short_description";

      if (drawType != "short_description" || drawCorrectAUs) {
        this.drawAU(actionUnit, drawType);
      }
    });
  }

  drawAU(actionUnit, textKind) {
    const colorDict = {
      short_description: "#00FF00",
      short_prescription: "rgba(90, 169, 230, 0.75)",
      short_prescription_negative: "rgba(255, 99, 146, 0.75)",
    };

    const fontColor = colorDict[textKind];

    const text = this.getText(actionUnit, textKind);
    const pointerLocation = this.getPointerLocation(
      actionUnit,
      this._landmarks
    );
    const textLocation = this.getTextBox(pointerLocation);

    // console.assert(fontColor, text, pointerLocation, textLocation)

    if (textLocation.textBoxNr != 404) {
      this.fillTextBackground(
        9,
        textLocation.x,
        textLocation.y,
        text,
        fontColor
      );
      this.placeTextOnCanvas(
        9,
        "#000000",
        textLocation.x,
        textLocation.y,
        pointerLocation.x,
        pointerLocation.y,
        text
      );
    }
  }

  sortAUsByLocations(actionUnits, landmarks) {
    // const order = [1, 4, 2, 6, 9, 10, 14, 23, 12, 15, 16, 27, 12, 26, 28, 22, 18, 24, 25, 13, 11, 5, 7, 41, 42, 43, 44, 45, 46];
    // const order = [6, 2, 5, 1, 7, 4, 41, 12, 26, 42, 43, 14, 44, 45, 23, 15, 10, 24, 18, 22, 28, 11, 13, 27];

    const sortedYValues = [];

    actionUnits.forEach((au) => {
      const involvedLandmarks = this.getLandmarksByNr(
        landmarks,
        auLandmarkMap2[au]
      );
      sortedYValues.push([this.getMiddle(involvedLandmarks).y, au]);
    });

    // sortedYValues.sort {
    //     $0 .0 == $1 .0 ? $0 .1 > $1 .1 : $0 .0 > $1 .0
    // }

    return sortedYValues.map((pair) => {
      return pair[1];
    });
  }

  fillTextBackground(textSize, textX, textY, text, color) {
    let textWidth = 0;
    text.forEach((line) => {
      textWidth = Math.max(textWidth, line.length);
    });
    textWidth *= 0.8 * textSize;
    const numberOfLines = text.length;
    const ctx = this._visualizationCanvasContext;
    const lineHeight = textSize + 1;
    ctx.fillStyle = color;
    ctx.fillRect(
      textX - 3,
      textY - lineHeight,
      textWidth,
      (1 + numberOfLines) * lineHeight
    );
    ctx.strokeStyle = color;
    ctx.strokeRect(
      textX - 3,
      textY - lineHeight,
      textWidth,
      (1 + numberOfLines) * lineHeight
    );
  }

  placeTextOnCanvas(
    fontSize,
    fontColor,
    textX,
    textY,
    pointerX,
    pointerY,
    textArray
  ) {
    const ctx = this._visualizationCanvasContext;
    const left = textX < this._visualizationCanvas.width / 2;
    ctx.font = `${fontSize}pt Monospace`;
    let i = 0;
    textArray.forEach((lineOfText) => {
      if (i === 0) {
        const xOffset = left ? lineOfText.length * fontSize * 0.76 : -1;
        ctx.beginPath();
        ctx.moveTo(textX + xOffset, textY);
        ctx.lineTo(pointerX, pointerY);
        ctx.closePath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();
        ctx.strokeStyle = "#000000";
      }
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fillText(
        lineOfText,
        textX,
        textY + 0.5 * fontSize + i * (fontSize + 1)
      );
      i++;
    });
  }

  getText(actionUnit, textKind) {
    const text = prescriptionDict[actionUnit.toString()][textKind][0];
    return this.linebreakList(text, 18);
  }

  linebreakList(str, maxLineLength) {
    const wordList = str.split(" ");
    const sentenceList = [];
    let newString = "";
    let i = 0;
    while (i < wordList.length) {
      if (newString.length + wordList[i].length < maxLineLength) {
        newString += wordList[i] + " ";
      } else {
        sentenceList.push(newString);
        newString = wordList[i] += " ";
      }
      i++;
    }
    sentenceList.push(newString);
    return sentenceList;
  }

  getTextBox(pointer) {
    const textBoxes = [
      [0, 200, 70],
      [1, 25, 80],
      [2, 25, 130],
      [3, 25, 180],
      [4, 25, 230],
      [5, 25, 280],
      [6, 25, 330],
      [7, 330, 80],
      [8, 330, 130],
      [9, 330, 180],
      [10, 330, 230],
      [11, 330, 280],
      [12, 330, 330],
    ];

    let distances = [];

    textBoxes.forEach((textBox) => {
      if (!this._booked.includes(textBox[0])) {
        const xOffset =
          textBox[0] > 0
            ? textBox[0] < 7
              ? 140
              : textBox[0] > 7
              ? -40
              : 0
            : 0;
        distances.push([
          textBox[0],
          this.getDistance(
            [pointer.x, pointer.y],
            [textBox[1] + xOffset, textBox[2]]
          ),
        ]);
      }
    });

    if (distances.length > 0) {
      let minDist = 500;
      let bestBox;
      distances.forEach((box) => {
        const boxNr = box[0];
        const distance = box[1];
        if (distance < minDist) {
          bestBox = boxNr;
          minDist = distance;
        }
      });
      this._booked.push(bestBox);
      return {
        textboxNr: bestBox,
        x: textBoxes[bestBox][1],
        y: textBoxes[bestBox][2],
      };
    } else {
      return {
        textboxNr: 404,
        x: 0,
        y: 0,
      };
    }
  }

  getDistance(pointA, pointB) {
    return Math.sqrt(
      Math.pow(pointB[0] - pointA[0], 2) + Math.pow(pointB[1] - pointA[1], 2)
    );
  }

  getPointerLocation(au, landmarks) {
    if (Object.keys(auLandmarkMap2).includes(au.toString())) {
      // console.log("AU", au)
      const involvedLandmarks = this.getLandmarksByNr(
        landmarks,
        auLandmarkMap2[au]
      );
      return this.getMiddle(involvedLandmarks);
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  }

  getMiddle(listOfPoints) {
    let xSum = 0;
    let ySum = 0;
    const nrPoints = listOfPoints.length;
    // console.log(listOfPoints)
    listOfPoints.forEach((point) => {
      xSum += point._x;
      ySum += point._y;
    });
    return {
      x: xSum / nrPoints,
      y: ySum / nrPoints,
    };
  }

  getLandmarksByNr(landmarks, listOfLandmarkNumbers) {
    const landmarksList = [];
    listOfLandmarkNumbers.forEach((nr) => {
      landmarksList.push(landmarks[nr]);
    });
    return landmarksList;
  }
}
