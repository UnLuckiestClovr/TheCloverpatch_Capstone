import pymongo, json, uuid

from pymongo import ReturnDocument
from models.apimodels import *


MongoClient = pymongo.MongoClient("mongodb://localhost:11002/") # Test Connection, Change to Containerized Connection string upon Deployment

objDatabase = MongoClient["CloverpatchProducts"]
flowerColl = objDatabase["Flowers"]


def FetchAllFlowers():
    try: 
        result = list(flowerColl.find())

        flowers = [{key: value for key, value in flower.items()} for flower in result]  # Returning as a List of Objects that can be transferred as JSON

        return {
            'success': True,
            'message': 'Fetch Successful',
            'flowers': json.dumps(flowers)
        }
    except Exception as e:
        print(f"Error Fetching List of Flowers")
        return None


def CreateFlowerProduct(inputFlower: FlowerProduct):
    try:
        newID = uuid.uuid4()

        newFlower = FlowerProduct(
            _id=newID,
            PName=inputFlower.PName,
            PMonth=inputFlower.PMonth,
            PCostPerFlower=inputFlower.PCostPerFlower,
            PImageURL=inputFlower.PImageURL
        )

        flowerColl.insert_one(json.loads(newFlower.model_dump_json()))

        return {
            'success': True,
            'message': f'Flower {newID} Created Successfully!'
        }
    except Exception as e:
        print(f'Flower Creation Error: {e}')
        return None


def UpdateFlowerProduct(updatedFlower: FlowerProduct):
    try:
        pass
    except Exception as e:
        print(f'Flower Update Error: {e}')
        return None


def DeleteFlowerProduct():
    try:
        pass
    except Exception as e:
        print(f'Flower Deletion Error: {e}')
        return None