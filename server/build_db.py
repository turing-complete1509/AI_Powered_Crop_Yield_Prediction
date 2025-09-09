import pandas as pd
from vector_db import add_to_db
from weather import fetch_weather
 

csv_files = ["using1.csv", "usingnew.csv"]

def safe_meta(value):
    if pd.isna(value):
        return "NA"
    return str(value)

for csv_file in csv_files:
    print(f"📂 Processing {csv_file} ...")
    df = pd.read_csv(csv_file)
    df.columns = df.columns.str.strip().str.lower()

    has_disease = "disease" in df.columns

    for _, row in df.iterrows():
        docs, ids, metadatas = [], [], []

        
        if has_disease:
            doc1 = (
                f"Crop: {row['crop']} | Disease: {row['disease']} | "
                f"Causal Agent: {row['causal_agent']} | Symptoms: {row.get('symptoms_identification','NA')} | "
                f"Organic Control: {row.get('organic_control','NA')} | Chemical Control: {row.get('chemical_control','NA')}"
            )
            meta_doc1 = {
                "crop": safe_meta(row["crop"]),
                "disease": safe_meta(row["disease"]),
                "causal_agent": safe_meta(row["causal_agent"])
            }
            docs.append(doc1)
            ids.append(str(row.get("id", f"{csv_file}_row")) + "_1")
            metadatas.append(meta_doc1)

        
        doc2 = (
            f"State: {row.get('state','NA')} | Soil_type: {row.get('soil_type','NA')} | "
            f"Irrigation: {row.get('irrigation','NA')} | Season: {row.get('season','NA')} | "
            f"Crop: {row.get('crop','NA')} | Soil_N_status: {row.get('soil_n_status','NA')} | "
            f"Soil_P_status: {row.get('soil_p_status','NA')} | Soil_K_status: {row.get('soil_k_status','NA')}"
        )
        meta_doc2 = {col: safe_meta(row.get(col)) for col in df.columns}
        docs.append(doc2)
        ids.append(str(row.get("id", f"{csv_file}_row")) + "_2")
        metadatas.append(meta_doc2)

        
        location = row.get("state", None)
        if location and location != "NA":
            try:
                weather_doc, weather_meta = fetch_weather(location)
                docs.append(weather_doc)
                ids.append(f"weather_{location}")
                metadatas.append(weather_meta)
            except Exception as e:
                print(f"⚠️ Could not fetch weather for {location}: {e}")
            
        
        add_to_db(docs=docs, ids=ids, metadatas=metadatas)

print("✅ All CSV files + weather processed and stored in Chroma")
