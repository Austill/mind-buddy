# test_db.py
from app import create_app, mongo

app = create_app()

with app.app_context():
    # Test a simple insert
    test_collection = mongo["test_collection"]
    test_doc = {"name": "Austin", "role": "boss"}
    inserted_id = test_collection.insert_one(test_doc).inserted_id
    print("Inserted ID:", inserted_id)

    # Test fetching
    docs = list(test_collection.find())
    print("Docs in collection:", docs)
