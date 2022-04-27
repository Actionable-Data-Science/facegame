const prescriptionDict = {
    "1": {
        "description": ['Inner eyebrows are raised.', 'Inner part of the eyebrows is pulled upwards'],
        "label": "inner brow raiser",
        "prescription": ['Raise your inner eyebrows.'],
        "prescription_negative": ['Try not to raise the inner part of your eyebrows.'],
        "short_description": ['Inner brows raised.'],
        "short_prescription": ['Raise inner brows.'],
        "short_prescription_negative": ['Do not raise inner brows.']
    },
    "2": {
        "description": ['Outer eyebrows are raised.', 'Outer part of the eyebrows is pulled upwards.'],
        "label": "outer brow raiser",
        "prescription": ['Raise the outer part of your eyebrows.'],
        "prescription_negative": ['Try not to raise the outer part of your eyebrows.'],
        "short_description": ['Outer brows raised.'],
        "short_prescription": ['Raise outer brows.'],
        "short_prescription_negative": ['Do not raise outer brows.']
    },
    "4": {
        "description": ['Eyebrows are lowered and pulled together.', 'Eyebrows are lowered.'],
        "label": "brow lowerer",
        "prescription": ['Lower your eyebrows and pull them together.'],
        "prescription_negative": ['Try not to lower your eyebrows.'],
        "short_description": ['Brows lowered.'],
        "short_prescription": ['Lower brows.'],
        "short_prescription_negative": ['Do not lower brows.']
    },
    "5": {
        "description": ['Upper eyelid is raised.'],
        "label": "upper lid raiser",
        "prescription": ['Raise your upper eyelids.', 'Widen your eye aperture.'],
        "prescription_negative": ['Try not to raise your upper eyelids.'],
        "short_description": ['Upper eyelids raised.'],
        "short_prescription": ['Raise upper eyelids.'],
        "short_prescription_negative": ['Do not raise upper eyelids.']
    },
    "6": {
        "description": ['The cheeks are raised.'],
        "label": "cheek raiser",
        "prescription": ['Raise your cheeks.'],
        "prescription_negative": ['Try not to raise your cheeks.'],
        "short_description": ['Cheeks raised.'],
        "short_prescription": ['Raise cheeks.'],
        "short_prescription_negative": ['Do not raise cheeks.']
    },
    "7": {
        "description": ['Eyelids are tightened.'],
        "label": "lid tightener",
        "prescription": ['Tighten your eyelids.', 'Narrow your eye aperture.'],
        "prescription_negative": ['Try not to tighten your eyelids.'],
        "short_description": ['Eyelids tightened.'],
        "short_prescription": ['Tighten eyelids.'],
        "short_prescription_negative": ['Do not tighten eyelids.']
    },
    "9": {
        "description": ['The skin around the nose is pulled upwards and wrinkled.'],
        "label": "nose wrinkler",
        "prescription": ['Wrinkle your nose by pulling the skin around it upwards.'],
        "prescription_negative": ['Try not to wrinkle your nose.'],
        "short_description": ['Nose wrinkled.'],
        "short_prescription": ['Wrinkle nose.'],
        "short_prescription_negative": ['Do not wrinkle nose.']
    },
    "10": {
        "description": ['Upper lip is raised.'],
        "label": "upper lip raiser",
        "prescription": ['Raise your upper lip.'],
        "prescription_negative": ['Try not to raise your upper lip.'],
        "short_description": ['Upper lip raised.'],
        "short_prescription": ['Raise upper lip.'],
        "short_prescription_negative": ['Do not raise upper lip.']
    },
    "11": {
        "description": ['Muscles next to the nose wings are deepened.', 'Nasolabial furrows are deepened.'],
        "label": "nasolabial deepener",
        "prescription": ['Deepen the muscles next to the nose wings.'],
        "prescription_negative": ['Try not to deepen the muscles next to the nose wings.'],
        "short_description": ['Muscles next to nose wings deepened.'],
        "short_prescription": ['Deepen muscles next to nose wings.'],
        "short_prescription_negative": ['Do not deepen muscles next to nose wings.']
    },
    "12": {
        "description": ['Lip corners are pulled back and upwards.'],
        "label": "lip corner puller",
        "prescription": ['Pull the corners of your lips back and upwards.', 'Smile more.'],
        "prescription_negative": ['Try not to pull the corners of your lips back and upwards.'],
        "short_description": ['Lip corners pulled back and upwards.'],
        "short_prescription": ['Pull lip corners back and upwards.'],
        "short_prescription_negative": ['Do not pull lip corners back and upwards.']
    },
    "13": {
        "description": ['The cheeks are evidently puffed out.', 'Corner of the lips are pulled up at a sharp angle.'],
        "label": "cheek puffer",
        "prescription": ['Pull the corners of your lips up at a sharp angle to puff your cheeks out.'],
        "prescription_negative": ['Try not to pull the corners of your lips up sharply so that your cheeks do not puff out.'],
        "short_description": ['Cheeks puffed out.'],
        "short_prescription": ['Puff out cheeks.'],
        "short_prescription_negative": ['Do not puff out cheeks.']
    },
    "14": {
        "description": ['Corners of the mouth are tightened.', 'Dimples appear on the cheek, next to the lip corners.'],
        "label": "dimpler",
        "prescription": ['Tighten the corners of your mouth to cause dimples to appear on your cheek.', 'Press your cheeks against your teeth to cause dimples to appear on your cheek.'],
        "prescription_negative": ['Try not to tighten the corners of your mouth so that no dimple appears on your cheeks.', 'Try not to press your cheeks against your teeth so that no dimple appears on your cheek.'],
        "short_description": ['Dimples appear.'],
        "short_prescription": ['Tighten mouth corners to display dimples.'],
        "short_prescription_negative": ['Do not tighten mouth corners to hide dimples.']
    },
    "15": {
        "description": ['Lip corners are pulled down.'],
        "label": "lip corner depressor",
        "prescription": ['Pull the corners of your lips down.'],
        "prescription_negative": ['Try not to pull the corners of your lips down.'],
        "short_description": ['Lip corners pulled down.'],
        "short_prescription": ['Pull down lip corners.'],
        "short_prescription_negative": ['Do not pull down lip corners.']
    },
    "16": {
        "description": ['The lower lip is pulled down.'],
        "label": "lower lip depressor",
        "prescription": ['Pull down your lower lip.'],
        "prescription_negative": ['Try not to pull down your lower lip.'],
        "short_description": ['Lower lip pulled down.'],
        "short_prescription": ['Pull down lower lip.'],
        "short_prescription_negative": ['Do not pull down lower lip.']
    },
    "17": {
        "description": ['Lower lip and the chin are raised.'],
        "label": "chin raiser",
        "prescription": ['Push your lower lip and chin upwards.'],
        "prescription_negative": ['Try not to push your lower lip and chin upwards.'],
        "short_description": ['Chin raised.'],
        "short_prescription": ['Raise chin.'],
        "short_prescription_negative": ['Do not raise chin.']
    },
    "20": {
        "description": ['Lip corners are pulled sideways.', 'Lips are stretched.'],
        "label": "lip stretcher",
        "prescription": ['Stretch your lips sideways.', 'Pull the corners of your lips sideways.'],
        "prescription_negative": ['Try not to stretch your lips sideways.', 'Try not to pull the corners of your lips sideways.'],
        "short_description": ['Lip stretched sideways.'],
        "short_prescription": ['Stretch lip sideways.'],
        "short_prescription_negative": ['Do not stretch lip sideways.']
    },
    "23": {
        "description": ['Lips are tightened.'],
        "label": "lip tightener",
        "prescription": ['Tighten your lips; make them thin.'],
        "prescription_negative": ['Try not to tighten your lips.'],
        "short_description": ['Lips tightened.'],
        "short_prescription": ['Tighten lips.'],
        "short_prescription_negative": ['Do not tighten lips.']
    },
    "24": {
        "description": ['Lips are pressed together.'],
        "label": "lip pressor",
        "prescription": ['Press your lips together.'],
        "prescription_negative": ['Try not to press your lips together.'],
        "short_description": ['Lips pressed together.'],
        "short_prescription": ['Press lips together.'],
        "short_prescription_negative": ['Do not press lips together.']
    },
    "25": {
        "description": ['Lips part.'],
        "label": "lips part",
        "prescription": ['Part your lips.'],
        "prescription_negative": ['Try not to part your lips.'],
        "short_description": ['Lips part.'],
        "short_prescription": ['Part lips.'],
        "short_prescription_negative": ['Do not part lips.']
    },
    "26": {
        "description": ['The jaw is dropped.'],
        "label": "jaw drop",
        "prescription": ['Relax your mouth and let your jaw drop.'],
        "prescription_negative": ['Try not to drop your jaw.'],
        "short_description": ['Jaw dropped.'],
        "short_prescription": ['Let jaw drop.'],
        "short_prescription_negative": ['Do not let jaw drop.']
    },
    "27": {
        "description": ['Mouth is stretched and open.'],
        "label": "mouth stretch",
        "prescription": ['Stretch open your mouth.'],
        "prescription_negative": ['Try not to stretch your mouth open.'],
        "short_description": ['Mouth streched open.'],
        "short_prescription": ['Stretch open mouth.'],
        "short_prescription_negative": ['Do not stretch open mouth.']
    },
    "28": {
        "description": ['Lips are sucked in.'],
        "label": "lip suck",
        "prescription": ['Suck your lips in.', 'Pull your lips into your mouth.'],
        "prescription_negative": ['Try not to suck your lips in.'],
        "short_description": ['Lips sucked in.'],
        "short_prescription": ['Suck lips in.'],
        "short_prescription_negative": ['Do not suck lips in.']
    },
    "43": {
        "description": ['Eyes are closed.'],
        "label": "eyes closed",
        "prescription": ['Close your eyes.', 'Close your eyes more.'],
        "prescription_negative": ['Try not to close your eyes.'],
        "short_description": ['Eyes closed.'],
        "short_prescription": ['Close eyes.'],
        "short_prescription_negative": ['Do not close eyes.']
    }
}


const feeDictionary = {
    "cheeks": {
        "00": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']

        },
        "01": {
            "au": "AU13",
            "label": "cheek puffer",
            "description": ['The cheeks are evidently puffed out.', 'Corner of the lips are pulled up at a sharp angle.'],
            "prescription": ['Pull the corners of your lips up at a sharp angle to puff your cheeks out.'],
            "prescription_negative": ['Try not to pull the corners of your lips up sharply so that your cheeks do not puff out.']
        },
        "10": {
            "au": "AU6",
            "label": "cheek raiser",
            "description": ['The cheeks are raised.'],
            "prescription": ['Raise your cheeks.'],
            "prescription_negative": ['Try not to raise your cheeks.']
        },
        "11": {
            "au": "AU6, AU13",
            "label": "cheek raiser, cheek puffer",
            "description": ['The cheeks are both raised and puffed out.'],
            "prescription": ['Raise your cheeks, and pull the corners of your lips upward to puff your cheeks out.'],
            "prescription_negative": ['Try not to raise your cheeks, and not to ouff out your cheeks.']
        }
    },
    "eyebrows": {
        "000": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "001": {
            "au": "AU4",
            "label": "brow lowerer",
            "description": ['Eyebrows are lowered and pulled together.', 'Eyebrows are lowered.'],
            "prescription": ['Lower your eyebrows and pull them together.'],
            "prescription_negative": ['Try not to lower your eyebrows.']
        },
        "010": {
            "au": "AU2",
            "label": "outer brow raiser",
            "description": ['Outer eyebrows are raised.', 'Outer part of the eyebrows is pulled upwards.'],
            "prescription": ['Raise the outer part of your eyebrows.'],
            "prescription_negative": ['Try not to raise the outer part of your eyebrows.']
        },
        "011": {
            "au": "AU2, AU4",
            "label": "outer brow raiser, brow lowerer",
            "description": ['Outer eyebrows are raised, and inner brows are lowered.'],
            "prescription": ['Raise your eyebrows, and lower the inner brows.'],
            "prescription_negative": ['Try not to raise the outer part of the eyebrows, and not to lower the inner part of the eyebrows.']
        },
        "100": {
            "au": "AU1",
            "label": "inner brow raiser",
            "description": ['Inner eyebrows are raised.', 'Inner part of the eyebrows is pulled upwards'],
            "prescription": ['Raise your inner eyebrows.'],
            "prescription_negative": ['Try not to raise the inner part of your eyebrows.']
        },
        "101": {
            "au": "AU1, AU4",
            "label": "inner brow raiser, brow lowerer",
            "description": ['Inner eyebrows are raised and pulled together, and the outer eyebrows are lowered.'],
            "prescription": ['Raise your inner eyebrows and pull them together while lowering the outer parts of the eyebrows.'],
            "prescription_negative": ['Try not to raise your inner eyebrows, and not to lower the outer part of your eyebrows.']
        },
        "110": {
            "au": "AU1, AU2",
            "label": "",
            "description": ['Entire eyebrow is pulled upwards.'],
            "prescription": ['Lift your eyebrows up.'],
            "prescription_negative": ['Try not to lift your eyebrows.']
        },
        "111": {
            "au": "AU1, AU2, AU4",
            "label": "",
            "description": ['Entire eyebrow is pulled upwards, and the eyebrows are pulled together.'],
            "prescription": ['Lift your eyebrows up and pull them together.'],
            "prescription_negative": ['Try not to lift your eyebrows and not to pull them together.']
        }

    },
    "eyelids": {
        "000": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "001": {
            "au": "AU43",
            "label": "eyes closed",
            "description": ['Eyes are closed.'],
            "prescription": ['Close your eyes.', 'Close your eyes more.'],
            "prescription_negative": ['Try not to close your eyes.']
        },
        "010": {
            "au": "AU7",
            "label": "lid tightener",
            "description": ['Eyelids are tightened.'],
            "prescription": ['Tighten your eyelids.', 'Narrow your eye aperture.'],
            "prescription_negative": ['Try not to tighten your eyelids.']
        },
        "011": {
            "au": "AU7, AU43",
            "label": "lid tightener, eyes closed",
            "description": ['Eyes are closed, and eyelids are tightened.'],
            "prescription": ['Close your eyes and tighten your eyelids.'],
            "prescription_negative": ['Try not to close your eyes, and not to tighten your eyelids.']
        },
        "100": {
            "au": "AU5",
            "label": "upper lid raiser",
            "description": ['Upper eyelid is raised.'],
            "prescription": ['Raise your upper eyelids.', 'Widen your eye aperture.'],
            "prescription_negative": ['Try not to raise your upper eyelids.']
        },
        "101": {
            "au": "AU5, AU43",
            "label": "upper lid raiser, eyes closed",
            "description": ['ANOMALY: AU5 @ AU43'],
            "prescription": ['ANOMALY: AU5 @ AU43'],
            "prescription_negative": ['ANOMALY: AU5 @ AU43']
        },
        "110": {
            "au": "AU5, AU7",
            "label": "upper lid raiser, lid tightener",
            "description": ['Upper eyelids are raised and the lower lids are tightened.'],
            "prescription": ['Raise your upper eyelids and then tighten the lower lids.'],
            "prescription_negative": ['Try not to raise your upper eyelids, and not to tighten the lower lids.']
        },
        "111": {
            "au": "AU5, AU7, AU43",
            "label": "upper lid raiser, lid tightener, eyes closed",
            "description": ['ANOMALY: AU5 @ AU43'],
            "prescription": ['ANOMALY: AU5 @ AU43'],
            "prescription_negative": ['ANOMALY: AU5 @ AU43']
        }
    },
    "lips": {
        "000": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "001": {
            "au": "AU16",
            "label": "lower lip depressor",
            "description": ['The lower lip is pulled down.'],
            "prescription": ['Pull down your lower lip.'],
            "prescription_negative": ['Try not to pull down your lower lip.']
        },
        "010": {
            "au": "AU15",
            "label": "lip corner depressor",
            "description": ['Lip corners are pulled down.'],
            "prescription": ['Pull the corners of your lips down.'],
            "prescription_negative": ['Try not to pull the corners of your lips down.']
        },
        "011": {
            "au": "AU15, AU16",
            "label": "lip corner depressor, lower lip depressor",
            "description": ['The lower lips and the lip corners are pulled down.'],
            "prescription": ['Pull down your lower lips and lip corners.'],
            "prescription_negative": ['Try not to pull down your lower lips and lip corners.']
        },
        "100": {
            "au": "AU10",
            "label": "upper lip raiser",
            "description": ['Upper lip is raised.'],
            "prescription": ['Raise your upper lip.'],
            "prescription_negative": ['Try not to raise your upper lip.']
        },
        "101": {
            "au": "AU10, AU16",
            "label": "upper lip raiser, lower lip depressor",
            "description": ['Upper lip is raised, and lower lip is pulled down.'],
            "prescription": ['Raise your upper lip, and pull down your lower lip.'],
            "prescription_negative": ['Try not to raise your upper lip, and not to pull down your lower lip.']
        },
        "110": {
            "au": "AU10, AU15",
            "label": "upper lip raiser, lip corner depressor",
            "description": ['Upper lip is raised, and lip corners are pulled down.'],
            "prescription": ['Raise your upper lip, and pull down the corners of your lips.'],
            "prescription_negative": ['Try not to raise your upper lip, and not to pull down the corners of your lips.']
        },
        "111": {
            "au": "AU10, AU15, AU16",
            "label": "upper lip raiser, lip corner depressor, lower lip depressor",
            "description": ['The lower lips and the lip corners are pulled down, and the upper lip is raised.'],
            "prescription": ['Pull down your lower lips and lip corners, and raise your upper lip.'],
            "prescription_negative": ['Try not to pull down your lower lips and lip corners, and not to raise your upper lip.']
        }
    },
    "chin_nose": {
        "00": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "01": {
            "au": "AU17",
            "label": "chin raiser",
            "description": ['Lower lip and the chin are raised.'],
            "prescription": ['Push your lower lip and chin upwards.'],
            "prescription_negative": ['Try not to push your lower lip and chin upwards.']
        },
        "10": {
            "au": "AU9",
            "label": "nose wrinkler",
            "description": ['The skin around the nose is pulled upwards and wrinkled.'],
            "prescription": ['Wrinkle your nose by pulling the skin around it upwards.'],
            "prescription_negative": ['Try not to wrinkle your nose.']
        },
        "11": {
            "au": "AU9, AU17",
            "label": "nose wrinkler, chin raiser",
            "description": ['Nose is wrinkled, and the chin is also pulled upwards.'],
            "prescription": ['Wrinkle your nose, and raise your chin.'],
            "prescription_negative": ['Try not to wrinkle your nose, and not to raise your chin.']
        }
    },
    "mouth": {
        "000": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "001": {
            "au": "AU27",
            "label": "mouth stretch",
            "description": ['Mouth is stretched and open.'],
            "prescription": ['Stretch open your mouth.'],
            "prescription_negative": ['Try not to stretch your mouth open.']
        },
        "010": {
            "au": "AU26",
            "label": "jaw drop",
            "description": ['The jaw is dropped.'],
            "prescription": ['Relax your mouth and let your jaw drop.'],
            "prescription_negative": ['Try not to drop your jaw.']
        },
        "011": {
            "au": "AU26, AU27",
            "label": "jaw drop, mouth stretch",
            "description": ['ANOMALY: 26@27'],
            "prescription": ['ANOMALY: 26@27'],
            "prescription_negative": ['ANOMALY: 26@27']
        },
        "100": {
            "au": "AU25",
            "label": "lips part",
            "description": ['Lips part.'],
            "prescription": ['Part your lips.'],
            "prescription_negative": ['Try not to part your lips.']
        },
        "101": {
            "au": "AU25, AU27",
            "label": "lips part, mouth stretch",
            "description": ['Mouth is strecthed open, and lips are wide apart.'],
            "prescription": ['Stretch open your mouth, and part your lips widely.'],
            "prescription_negative": ['Try not to stretch open your mouth, and not to part your lips.']
        },
        "110": {
            "au": "AU25, AU26",
            "label": "lips part, jaw drop",
            "description": ['The jaw is dropped, and the lips are part.'],
            "prescription": ['Let your jaw drop, and part your lips.'],
            "prescription_negative": ['Try not to let your jaw drop, and not to part your lips.']
        },
        "111": {
            "au": "AU25, AU26, AU27",
            "label": "lips part, jaw drop, mouth stretch",
            "description": ['ANOMALY: 26@27'],
            "prescription": ['ANOMALY: 26@27'],
            "prescription_negative": ['ANOMALY: 26@27']
        }
    },
    "horizontal": {
        "00": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "01": {
            "au": "AU14",
            "label": "dimpler",
            "description": ['Corners of the mouth are tightened.', 'Dimples appear on the cheek, next to the lip corners.'],
            "prescription": ['Tighten the corners of your mouth to cause dimples to appear on your cheek.', 'Press your cheeks against your teeth to cause dimples to appear on your cheek.'],
            "prescription_negative": ['Try not to tighten the corners of your mouth so that no dimple appears on your cheeks.', 'Try not to press your cheeks against your teeth so that no dimple appears on your cheek.']
        },
        "10": {
            "au": "AU20",
            "label": "lip stretcher",
            "description": ['Lip corners are pulled sideways.', 'Lips are stretched.'],
            "prescription": ['Stretch your lips sideways.', 'Pull the corners of your lips sideways.'],
            "prescription_negative": ['Try not to stretch your lips sideways.', 'Try not to pull the corners of your lips sideways.']
        },
        "11": {
            "au": "AU14, AU20",
            "label": "dimpler, lip stretcher",
            "description": ['Lips are stretched, and dimples appear on the cheek.'],
            "prescription": ['Stretch your lips sideways, and tighten the corners of your lips to cause dimples to appear.'],
            "prescription_negative": ['Try not to stretch your lips sideways, and not to tighten the corners of your lips.']
        }
    },
    "oblique": {
        "00": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "01": {
            "au": "AU12",
            "label": "lip corner puller",
            "description": ['Lip corners are pulled back and upwards.'],
            "prescription": ['Pull the corners of your lips back and upwards.', 'Smile more.'],
            "prescription_negative": ['Try not to pull the corners of your lips back and upwards.']
        },
        "10": {
            "au": "AU11",
            "label": "nasolabial deepener",
            "description": ['Muscles next to the nose wings are deepened.', 'Nasolabial furrows are deepened.'],
            "prescription": ['Deepen the muscles next to the nose wings.'],
            "prescription_negative": ['Try not to deepen the muscles next to the nose wings.']
        },
        "11": {
            "au": "AU11, AU12",
            "label": "nasolabial deepener, lip corner puller",
            "description": ['Lip corners are pulled back and upwards, and the muscles next to the nose wings are deepened.'],
            "prescription": ['Smile more, and deepen the muscles next to your nose wings.'],
            "prescription_negative": ['Try not to pull the corners of your lips back and upwards, and not to deepen the muscles next to your nose wings.']
        }
    },
    "orbital": {
        "000": {
            "au": "",
            "label": "",
            "description": [''],
            "prescription": [''],
            "prescription_negative": ['']
        },
        "001": {
            "au": "AU28",
            "label": "lip suck",
            "description": ['Lips are sucked in.'],
            "prescription": ['Suck your lips in.', 'Pull your lips into your mouth.'],
            "prescription_negative": ['Try not to suck your lips in.']
        },
        "010": {
            "au": "AU24",
            "label": "lip pressor",
            "description": ['Lips are pressed together.'],
            "prescription": ['Press your lips together.'],
            "prescription_negative": ['Try not to press your lips together.']
        },
        "011": {
            "au": "AU24, AU28",
            "label": "lip pressor, lip suck",
            "description": ['Lips are sucked in and pressed together.'],
            "prescription": ['Press your lips together, and suck your lips in.'],
            "prescription_negative": ['Try not to press your lips together, and not to suck your lips in.']
        },
        "100": {
            "au": "AU23",
            "label": "lip tightener",
            "description": ['Lips are tightened.'],
            "prescription": ['Tighten your lips; make them thin.'],
            "prescription_negative": ['Try not to tighten your lips.']
        },
        "101": {
            "au": "AU23, AU28",
            "label": "lip tightener, lip suck",
            "description": ['Lips are tightened and sucked in.'],
            "prescription": ['Tighten your lips, and suck your lips in.'],
            "prescription_negative": ['Try not to tighten your lips, and not to suck your lips in.']
        },
        "110": {
            "au": "AU23, AU24",
            "label": "lip tightener, lip pressor",
            "description": ['Lips are tightened and pressed together.'],
            "prescription": ['Tighten your lips, and press them together.'],
            "prescription_negative": ['Try not to tighten your lips, and not to press them together.']
        },
        "111": {
            "au": "AU23, AU24, AU28",
            "label": "lip tightener, lip pressor, lip suck",
            "description": ['Lips are tightened, pressed together, and sucked in.'],
            "prescription": ['Tighten your lips, press them together, and suck them in.'],
            "prescription_negative": ['Try not to tighten your lips, not to press them together, and not to suck them in.']
        }
    }
}