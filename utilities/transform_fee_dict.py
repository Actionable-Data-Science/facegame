import json
import sys

with open(sys.argv[1]) as f:
    json_str = f.read()
    json_data = json.loads(json_str)
    
new_dict = {}    

def generate_entry_from_json(json):
    return {
            "label": json["label"],
            "description": json["label"],
            "prescription": json["label"],
            "prescription_negative": json["label"],   
            }

for face_region in json_data.keys():
    for combo in json_data[face_region].keys():
        if combo.count("1") == 1:
            au = int(json_data[face_region][combo]["au"][2:])
            new_dict[au] = generate_entry_from_json(json_data[face_region][combo])
            
with open("transformed_feedictionary.json", "w") as f:
    json.dump(new_dict, f)


