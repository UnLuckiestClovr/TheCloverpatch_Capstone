import pymongo, json, uuid

from datetime import datetime
from pymongo import ReturnDocument
from models.apimodels import *


MongoClient = pymongo.MongoClient("mongodb://CloverpatchProductDatabase:27017/") # Test Connection, Change to Containerized Connection string upon Deployment

objDatabase = MongoClient["CloverpatchProducts"]
flowerColl = objDatabase["Flowers"]


def FetchAllFlowers():
    try: 
        result = list(flowerColl.find())

        flowers = [{key: value for key, value in flower.items()} for flower in result]  # Returning as a List of Objects that can be transferred as JSON

        return {
            'success': True,
            'message': 'Fetch Successful',
            'flowers': json.dumps(flowers, default=str)
        }
    except Exception as e:
        print(f"Error Fetching List of Flowers: {e}")
        return None


def FetchFlowers_byCurrentMonth():
    try:
        month = datetime.now().month

        result = list(flowerColl.find({'PMonth': month}))

        flowers = [{key: value for key, value in flower.items()} for flower in result]  # Returning as a List of Objects that can be transferred as JSON

        return {
            'success': True,
            'message': 'Fetch by Month Successful',
            'flowers': json.dumps(flowers, default=str)
        }
    except Exception as e:
        print(f"Error Fetching List of Flowers by Month")
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

        flowerColl.insert_one(json.loads(newFlower.json()))

        return {
            'success': True,
            'message': f'Flower {newID} Created Successfully!'
        }
    except Exception as e:
        print(f'Flower Creation Error: {e}')
        return None


def UpdateFlowerProduct(updatedFlower: FlowerProduct):
    try:
        result = flowerColl.find_one_and_replace({"_id": updatedFlower._id})

        return {
            'success': True,
            'message': f'Updated Flower {updatedFlower._id} Successfully',
            'updatedFlower': json.dumps(result)
        }
    except Exception as e:
        print(f'Flower Update Error: {e}')
        return None


def DeleteFlowerProduct(id: str):
    try:
        result = flowerColl.find_one_and_delete({"_id": id})
        if result != None:
            return {
                "success": True,
                "message": "Item Deletion Successful"
            }
        else:
            return {
                "success": False,
                "message": f"Item Deletion Unsuccessful: Item Under ID of \'{id}\' Does not Exist"
            }
    except Exception as e:
        print(f'Flower Deletion Error: {e}')
        return None